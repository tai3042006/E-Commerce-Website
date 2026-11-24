package com.clofit.backend.api;

import static com.clofit.backend.api.AuthApi.error;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.*;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
class PayOsClient {
    private static final String API = "https://api-merchant.payos.vn/v2/payment-requests";
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(4)).build();
    private final ObjectMapper json;
    private final String clientId;
    private final String apiKey;
    private final String checksum;
    private final String siteUrl;
    private final BigDecimal usdVndRate;

    PayOsClient(ObjectMapper json,@Value("${PAYOS_CLIENT_ID:}") String clientId,
               @Value("${PAYOS_API_KEY:}") String apiKey,@Value("${PAYOS_CHECKSUM_KEY:}") String checksum,
               @Value("${STORE_URL:}") String siteUrl,@Value("${USD_VND_RATE:0}") BigDecimal usdVndRate) {
        this.json=json; this.clientId=clientId; this.apiKey=apiKey; this.checksum=checksum;
        this.siteUrl=siteUrl.replaceFirst("/+$","");
        this.usdVndRate=usdVndRate;
    }

    void requireConfigured() {
        if (clientId.isBlank() || apiKey.isBlank() || checksum.isBlank() || !siteUrl.startsWith("https://") || usdVndRate==null || usdVndRate.signum()<=0) {
            throw error(HttpStatus.SERVICE_UNAVAILABLE,"QR payment is not configured");
        }
    }

    long amountVnd(BigDecimal total) {
        long amount;
        try {
            amount=total.multiply(usdVndRate).setScale(0,RoundingMode.HALF_UP).longValueExact();
        } catch (ArithmeticException ignored) {
            throw error(HttpStatus.BAD_REQUEST,"invalid_payment_amount");
        }
        if (amount<=0 || amount>Integer.MAX_VALUE) throw error(HttpStatus.BAD_REQUEST,"invalid_payment_amount");
        return amount;
    }

    JsonNode create(long code,long amount,String orderId) {
        requireConfigured();
        String returnUrl=siteUrl + "/checkout?order=" + orderId;
        String description="CLOFIT " + code;
        Map<String,Object> values=new TreeMap<>(Map.of("amount",amount,"cancelUrl",returnUrl,
            "description",description,"orderCode",code,"returnUrl",returnUrl));
        String signature=sign(values.entrySet().stream().map(entry -> entry.getKey()+"="+entry.getValue())
            .collect(Collectors.joining("&")));
        values.put("signature",signature);
        values.put("expiredAt",java.time.Instant.now().plusSeconds(1800).getEpochSecond());
        return send(API,values);
    }

    JsonNode lookup(long code) {
        requireConfigured();
        return send(API+"/"+code,null);
    }

    boolean verify(JsonNode webhook) {
        if (checksum.isBlank() || !webhook.path("data").isObject()) return false;
        String provided=webhook.path("signature").asText();
        if (!provided.matches("[a-fA-F0-9]{64}")) return false;
        Map<String,String> fields=new TreeMap<>();
        webhook.path("data").properties().forEach(field -> {
            String value=field.getValue().asText("");
            fields.put(field.getKey(),Set.of("null","undefined").contains(value)?"":value);
        });
        String raw=fields.entrySet().stream().map(field -> field.getKey()+"="+field.getValue()).collect(Collectors.joining("&"));
        return MessageDigest.isEqual(HexFormat.of().parseHex(sign(raw)),HexFormat.of().parseHex(provided));
    }

    private String sign(String raw) {
        try {
            Mac mac=Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(checksum.getBytes(StandardCharsets.UTF_8),"HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }

    private JsonNode send(String url,Map<String,Object> body) {
        try {
            HttpRequest.Builder request=HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(10))
                .header("x-client-id",clientId).header("x-api-key",apiKey).header("Accept","application/json");
            if (body!=null) request.header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)));
            HttpResponse<String> response=http.send(request.build(),HttpResponse.BodyHandlers.ofString());
            JsonNode envelope=json.readTree(response.body());
            if (response.statusCode()==404 || "20".equals(envelope.path("code").asText())) return null;
            if (response.statusCode()==200 && "00".equals(envelope.path("code").asText()) && envelope.path("data").isObject()) {
                return envelope.path("data");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (java.io.IOException ignored) {}
        throw error(HttpStatus.BAD_GATEWAY,"Could not reach the payment provider. Retry for the same order.");
    }
}
