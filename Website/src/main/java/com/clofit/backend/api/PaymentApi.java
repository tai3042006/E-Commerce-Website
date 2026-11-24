package com.clofit.backend.api;

import static com.clofit.backend.api.AuthApi.error;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
class PaymentApi {
    private final JdbcTemplate db;
    private final AuthApi auth;
    private final PayOsClient payos;
    private final Settlement settlement;

    PaymentApi(JdbcTemplate db,AuthApi auth,PayOsClient payos,Settlement settlement) {
        this.db=db; this.auth=auth; this.payos=payos; this.settlement=settlement;
    }

    @PostMapping("/orders/{orderId}/payment")
    Map<String,Object> qr(HttpServletRequest request,@PathVariable String orderId) {
        Map<String,Object> payment=ownedPayment(request,orderId);
        if (payment.get("paid_at")!=null) return Map.of("state","PAID","displayId",payment.get("displayId"));
        if (payment.get("method")!=null) return Map.of("state","cod".equals(payment.get("method"))?"COD":"MANUAL_QR",
            "displayId",payment.get("displayId"),"total",payment.get("total"),"imageUrl","/api/uploads/"+payment.get("image_id"),"reference",payment.get("code"));
        long code=((Number)payment.get("code")).longValue();
        long amount=((Number)payment.get("amount_vnd")).longValue();
        if (payment.get("link_id") instanceof String) {
            return status(payment,payos.lookup(code));
        }

        JsonNode link;
        String qrCode="";
        try {
            link=payos.create(code,amount,orderId);
            if (link!=null) qrCode=link.path("qrCode").asText("");
        } catch (ResponseStatusException failure) {
            link=payos.lookup(code);
            if (link==null) throw failure;
        }
        verifyLink(payment,link);
        String linkId=link.path("paymentLinkId").asText(link.path("id").asText());
        db.update("UPDATE order_payments SET link_id=?,qr_code=COALESCE(NULLIF(?,''),qr_code) WHERE code=?",linkId,qrCode,code);
        if (!link.has("amountPaid")) link=payos.lookup(code);
        return status(ownedPayment(request,orderId),link);
    }

    @GetMapping("/orders/{orderId}/payment")
    Map<String,Object> check(HttpServletRequest request,@PathVariable String orderId) {
        Map<String,Object> payment=ownedPayment(request,orderId);
        if (payment.get("paid_at")!=null) return Map.of("state","PAID","displayId",payment.get("displayId"));
        if (payment.get("method")!=null) return Map.of("state","cod".equals(payment.get("method"))?"COD":"MANUAL_QR",
            "displayId",payment.get("displayId"),"total",payment.get("total"),"imageUrl","/api/uploads/"+payment.get("image_id"),"reference",payment.get("code"));
        long code=((Number)payment.get("code")).longValue();
        JsonNode link=payos.lookup(code);
        if (link==null) return Map.of("state","NOT_CREATED");
        return status(payment,link);
    }

    @PostMapping("/admin/orders/{id}/confirm-payment")
    @Transactional
    Map<String,Boolean> confirm(HttpServletRequest request,@PathVariable String id) {
        auth.requireAdmin(request);
        var row=db.queryForList("""
            SELECT p.code,p.paid_at,m.method,o.status FROM order_payments p JOIN offline_payments m ON m.order_id=p.order_id
            JOIN orders o ON o.id=p.order_id WHERE o.id=? FOR UPDATE
            """,id).stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"not_found"));
        if (row.get("paid_at")!=null) return Map.of("ok",true);
        boolean cod="cod".equals(row.get("method"));
        if (cod ? !Set.of("pending","processing","shipped","delivered").contains(row.get("status")) : !"awaiting_payment".equals(row.get("status"))) throw error(HttpStatus.CONFLICT,"Order is not ready for confirmation");
        settlement.paid(((Number)row.get("code")).longValue(),null);

        return Map.of("ok",true);
    }

    @PostMapping("/payments/payos/webhook")
    Map<String,Boolean> webhook(@RequestBody JsonNode body) {
        if (!payos.verify(body)) throw error(HttpStatus.BAD_REQUEST,"invalid_signature");
        long code=body.path("data").path("orderCode").asLong();
        List<Map<String,Object>> local=db.queryForList("SELECT * FROM order_payments WHERE code=?",code);
        // The provider sends a signed sample with an unknown code when registering the webhook.
        if (!local.isEmpty() && local.getFirst().get("paid_at")==null) {
            JsonNode link=payos.lookup(code);
            verifyLink(local.getFirst(),link);
            if (!body.path("data").path("paymentLinkId").asText().equals(link.path("id").asText())) {
                throw error(HttpStatus.CONFLICT,"payment_link_mismatch");
            }
            status(local.getFirst(),link);
        }
        return Map.of("ok",true);
    }

    private Map<String,Object> ownedPayment(HttpServletRequest request,String orderId) {
        return db.queryForList("SELECT p.*,m.method,m.image_id,o.total,COALESCE(CONCAT('CF-',10428+r.number),o.id) AS displayId FROM order_payments p JOIN orders o ON o.id=p.order_id LEFT JOIN offline_payments m ON m.order_id=p.order_id LEFT JOIN checkout_requests r ON r.user_id=p.user_id AND o.id=CONCAT('CF-',r.request_id) WHERE p.order_id=? AND p.user_id=?",orderId,auth.userId(request))
            .stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"not_found"));
    }

    private Map<String,Object> status(Map<String,Object> payment,JsonNode link) {
        verifyLink(payment,link);
        long amount=((Number)payment.get("amount_vnd")).longValue();
        String state=link.path("status").asText();
        String linkId=link.path("id").asText();
        if ("PAID".equals(state)) {
            if (link.path("amountPaid").asLong()!=amount || link.path("amountRemaining").asLong(-1)!=0) {
                throw error(HttpStatus.CONFLICT,"paid_amount_mismatch");
            }
            settlement.paid(((Number)payment.get("code")).longValue(),linkId);
        } else if (Set.of("CANCELLED","EXPIRED","FAILED").contains(state)) {
            db.update("""
                UPDATE orders SET status='cancelled' WHERE id=? AND status='awaiting_payment'
                """,payment.get("order_id"));
        }
        return Map.of("state",state,"amountVnd",amount,"qrCode",Objects.toString(payment.get("qr_code"),""),
            "checkoutUrl","https://pay.payos.vn/web/" + linkId);
    }

    private void verifyLink(Map<String,Object> payment,JsonNode link) {
        if (link==null || link.path("orderCode").asLong()!=((Number)payment.get("code")).longValue() ||
            link.path("amount").asLong()!=((Number)payment.get("amount_vnd")).longValue()) {
            throw error(HttpStatus.BAD_GATEWAY,"payment_link_mismatch");
        }
        String linkId=link.path("id").asText(link.path("paymentLinkId").asText());
        if (!linkId.matches("[a-fA-F0-9]{32}") ||
            (payment.get("link_id") instanceof String current && !current.equals(linkId))) {
            throw error(HttpStatus.BAD_GATEWAY,"payment_link_mismatch");
        }
    }
}

@Service
class Settlement {
    private final JdbcTemplate db;
    private final AuthApi auth;

    Settlement(JdbcTemplate db,AuthApi auth) { this.db=db; this.auth=auth; }

    @Transactional
    public void paid(long code,String linkId) {
        if (db.update("UPDATE order_payments SET paid_at=NOW(),link_id=? WHERE code=? AND paid_at IS NULL",linkId,code)==0) return;
        Map<String,Object> row=db.queryForMap("""
            SELECT p.order_id,p.user_id,o.total,o.customer_id FROM order_payments p
            JOIN orders o ON o.id=p.order_id WHERE p.code=?
            """,code);
        db.update("UPDATE orders SET status='pending' WHERE id=? AND status='awaiting_payment'",row.get("order_id"));
        db.update("UPDATE customers SET spent=spent+?,orders_count=orders_count+1 WHERE id=?",row.get("total"),row.get("customer_id"));
        String order=(String)row.get("order_id");
        auth.notify("user",(String)row.get("user_id"),"orderConfirmed","Payment confirmed for " + order,"/account");
        auth.notify("admin",null,"orderCreated","New paid order: " + order,"/admin/orders");
    }
}
