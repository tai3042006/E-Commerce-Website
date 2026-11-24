package com.clofit.backend.api;

import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@SpringBootApplication
@RestController
@RestControllerAdvice
public class CloFitApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloFitApplication.class, args);
    }

    private final JdbcTemplate db;

    CloFitApplication(JdbcTemplate db) { this.db = db; }

    @GetMapping("/health")
    public Map<String, String> health() {
        db.queryForObject("SELECT 1", Integer.class);
        return Map.of("status", "ok", "backend", "java");
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> httpError(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode())
            .body(Map.of("error", error.getReason() == null ? "request_failed" : error.getReason()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> databaseError(DataAccessException error) {
        System.getLogger(getClass().getName()).log(System.Logger.Level.ERROR, "Database request failed", error);
        return ResponseEntity.status(503).body(Map.of("error", "database_request_failed"));
    }
}
