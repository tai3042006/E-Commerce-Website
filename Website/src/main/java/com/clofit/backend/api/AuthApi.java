package com.clofit.backend.api;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
class AuthApi {
    private final JdbcTemplate db;
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    private final ObjectProvider<JavaMailSender> mail;
    private final String siteUrl;
    private final String from;

    AuthApi(JdbcTemplate db,ObjectProvider<JavaMailSender> mail,@Value("${STORE_URL:}") String siteUrl,
            @Value("${MAIL_FROM:}") String from) {
        this.db=db; this.mail=mail; this.siteUrl=siteUrl.replaceFirst("/+$",""); this.from=from;
    }

    @Bean
    ApplicationRunner createAdmin(@Value("${clofit.admin.email}") String email,
                                  @Value("${clofit.admin.password}") String password) {
        return args -> {
            if (email.isBlank() && password.isBlank()) return;
            String address = email(email);
            checkPassword(password);
            db.update("""
                INSERT INTO users(id,name,email,password,role) VALUES (?, 'Site Admin', ?, ?, 'admin')
                ON DUPLICATE KEY UPDATE email = email
                """, id(), address, bcrypt.encode(password));
        };
    }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    Map<String, Object> register(@RequestBody Map<String, Object> body) {
        String email = email(body.get("email"));
        String name = required(body.get("name"), 150);
        String phone = optional(body.get("phone"), 50);
        String password = checkPassword(body.get("password"));
        String id = id();
        try {
            db.update("INSERT INTO users(id,name,email,phone,password,role) VALUES (?,?,?,?,?,'customer')",
                id, name, email, phone, bcrypt.encode(password));
        } catch (DuplicateKeyException error) {
            throw error(HttpStatus.CONFLICT, "email_taken");
        }
        notify("admin", null, "userRegistered", "New customer: " + name, "/admin/customers");
        return createSession(profile(id));
    }

    @PostMapping("/auth/login")
    Map<String, Object> login(@RequestBody Map<String, Object> body) {
        String email = email(body.get("email"));
        String password = password(body.get("password"));
        Map<String,Object> row = first("SELECT id,password FROM users WHERE email=?", email);
        if (row == null || !matches(password, (String) row.get("password"))) {
            throw error(HttpStatus.UNAUTHORIZED, "invalid_credentials");
        }
        String id=(String)row.get("id");
        String stored=(String)row.get("password");
        if (!stored.startsWith("$2")) db.update("UPDATE users SET password=? WHERE id=? AND password=?",bcrypt.encode(password),id,stored);
        return createSession(profile(id));
    }

    @GetMapping("/auth/me")
    Map<String, Object> me(HttpServletRequest request) {
        return requireUser(request);
    }

    @PostMapping("/auth/logout")
    Map<String, Boolean> logout(HttpServletRequest request) {
        db.update("DELETE FROM sessions WHERE token=?", request.getHeader("x-auth-token"));
        return Map.of("ok", true);
    }

    @PatchMapping("/settings/profile")
    @Transactional
    Map<String, Object> updateProfile(HttpServletRequest request, @RequestBody Map<String,Object> body) {
        Map<String,Object> user = requireUser(request);
        String id = (String) user.get("id");
        String name = required(body.getOrDefault("name", user.get("name")), 150);
        String oldEmail = (String) user.get("email");
        String email = email(body.getOrDefault("email", oldEmail));
        String phone = optional(body.getOrDefault("phone", user.get("phone")), 50);
        try {
            db.update("UPDATE users SET name=?,email=?,phone=? WHERE id=?", name, email, phone, id);
            db.update("UPDATE customers SET name=?,email=? WHERE email=?", name, email, oldEmail);
        } catch (DuplicateKeyException error) {
            throw error(HttpStatus.CONFLICT, "email_taken");
        }
        return profile(id);
    }

    @PatchMapping("/settings/password")
    @Transactional
    Map<String, Boolean> updatePassword(HttpServletRequest request, @RequestBody Map<String,Object> body) {
        String userId = userId(request);
        String oldPassword = password(body.get("old_password"));
        String newPassword = checkPassword(body.get("new_password"));
        String stored = db.queryForObject("SELECT password FROM users WHERE id=? FOR UPDATE", String.class, userId);
        if (!matches(oldPassword, stored)) throw error(HttpStatus.BAD_REQUEST, "invalid_old_password");
        db.update("UPDATE users SET password=? WHERE id=?", bcrypt.encode(newPassword), userId);
        db.update("DELETE FROM sessions WHERE user_id=? AND token<>?", userId, request.getHeader("x-auth-token"));
        return Map.of("ok", true);
    }

    @PostMapping("/auth/forgot-password")
    Map<String,Boolean> forgotPassword(@RequestBody Map<String,Object> body) {
        JavaMailSender sender=mail.getIfAvailable();
        if (sender==null || from.isBlank() || !siteUrl.startsWith("https://")) {
            throw error(HttpStatus.SERVICE_UNAVAILABLE,"Password reset email is not configured");
        }
        String address=email(body.get("email"));
        Map<String,Object> user=first("SELECT id FROM users WHERE email=?",address);
        if (user!=null) {
            byte[] bytes=new byte[32];
            new SecureRandom().nextBytes(bytes);
            String token=HexFormat.of().formatHex(bytes);
            db.update("INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES (?,?,NOW()+INTERVAL 1 HOUR)",
                hash(token),user.get("id"));
            SimpleMailMessage message=new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(address);
            message.setSubject("Reset your CloFit password");
            message.setText("Open this link within one hour: " + siteUrl + "/reset-password?token=" + token);
            try { sender.send(message); }
            catch (MailException e) {
                db.update("DELETE FROM password_resets WHERE token_hash=?",hash(token));
                System.getLogger(getClass().getName()).log(System.Logger.Level.WARNING,"Could not send a password reset email");
            }
        }
        return Map.of("ok",true);
    }

    @PostMapping("/auth/reset-password")
    @Transactional
    Map<String, Boolean> resetPassword(@RequestBody Map<String,Object> body) {
        String token = required(body.get("token"), 64);
        String password = checkPassword(body.get("password"));
        String hash=hash(token);
        Map<String,Object> reset = first("""
            SELECT user_id FROM password_resets
            WHERE token_hash=? AND NOT used AND expires_at>CURRENT_TIMESTAMP FOR UPDATE
            """, hash);
        if (reset == null) throw error(HttpStatus.BAD_REQUEST, "invalid_or_expired_token");
        Object userId = reset.get("user_id");
        db.update("UPDATE users SET password=? WHERE id=?", bcrypt.encode(password), userId);
        db.update("UPDATE password_resets SET used=1 WHERE token_hash=?", hash);
        db.update("DELETE FROM sessions WHERE user_id=?", userId);
        return Map.of("ok", true);
    }

    Map<String,Object> requireUser(HttpServletRequest request) {
        String token = request.getHeader("x-auth-token");
        if (token == null || token.length() > 50) throw error(HttpStatus.UNAUTHORIZED, "unauthorized");
        Map<String,Object> user = first("""
            SELECT u.id,u.name,u.email,u.phone,u.role FROM sessions s JOIN users u ON u.id=s.user_id
            WHERE s.token=? AND s.created_at >= CURRENT_TIMESTAMP - INTERVAL 7 DAY
            """, token);
        if (user == null) throw error(HttpStatus.UNAUTHORIZED, "unauthorized");
        return user;
    }

    String userId(HttpServletRequest request) { return (String) requireUser(request).get("id"); }

    void requireAdmin(HttpServletRequest request) {
        if (!"admin".equals(requireUser(request).get("role"))) throw error(HttpStatus.FORBIDDEN, "forbidden");
    }

    void notify(String audience, String userId, String event, String message, String link) {
        db.update("INSERT INTO notifications(id,audience,user_id,event,message,link) VALUES (?,?,?,?,?,?)",
            id(), audience, userId, event, message, link);
    }

    private Map<String,Object> createSession(Map<String,Object> user) {
        String token = id();
        db.update("INSERT INTO sessions(token,user_id,role) VALUES (?,?,?)", token, user.get("id"), user.get("role"));
        return Map.of("token", token, "user", user);
    }

    private Map<String,Object> profile(String id) {
        return first("SELECT id,name,email,phone,role FROM users WHERE id=?", id);
    }

    private Map<String,Object> first(String sql, Object... args) {
        return db.queryForList(sql, args).stream().findFirst().orElse(null);
    }

    private boolean matches(String password, String stored) {
        if (stored == null) return false;
        if (stored.startsWith("$2")) return bcrypt.matches(password, stored);
        int hash = 0x811c9dc5;
        for (int i = 0; i < password.length(); i++) hash = (hash ^ password.charAt(i)) * 0x01000193;
        return ("%08x%s".formatted(hash, Integer.toHexString(password.length()))).equals(stored);
    }

    static String id() { return UUID.randomUUID().toString(); }
    static ResponseStatusException error(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }

    static String optional(Object value, int max) {
        if (value == null) return null;
        if (!(value instanceof String text) || text.length() > max) throw error(HttpStatus.BAD_REQUEST, "invalid_field");
        return text.trim();
    }

    static String required(Object value, int max) {
        String text = optional(value, max);
        if (text == null || text.isBlank()) throw error(HttpStatus.BAD_REQUEST, "required_field");
        return text;
    }

    private static String email(Object value) {
        String text = required(value, 255).toLowerCase(Locale.ROOT);
        if (!text.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) throw error(HttpStatus.BAD_REQUEST, "invalid_email");
        return text;
    }

    private static String password(Object value) {
        if (value instanceof String text && !text.isBlank() && text.getBytes(StandardCharsets.UTF_8).length<=72) return text;
        throw error(HttpStatus.BAD_REQUEST,"invalid_password_length");
    }

    private static String checkPassword(Object value) {
        String text=password(value);
        if (text.length()<6) throw error(HttpStatus.BAD_REQUEST,"invalid_password_length");
        return text;
    }

    private static String hash(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException(error);
        }
    }
}
