package com.clofit.backend.api;

import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class PayOsClientTest {
    private static final String KEY = "unit-test-key";
    private final ObjectMapper json = new ObjectMapper();
    private final PayOsClient payos = new PayOsClient(json,"client","api",KEY,"https://example.com",new BigDecimal("25500"));

    @Test
    void convertsUsdToWholeDong() {
        assertEquals(254745,payos.amountVnd(new BigDecimal("9.99")));
        assertThrows(ResponseStatusException.class,() -> payos.amountVnd(BigDecimal.ZERO));
    }

    @Test
    void webhookRejectsAnAlteredAmount() throws Exception {
        String canonical = "amount=254745&code=00&orderCode=78001";
        Mac hmac = Mac.getInstance("HmacSHA256");
        hmac.init(new SecretKeySpec(KEY.getBytes(StandardCharsets.UTF_8),"HmacSHA256"));
        ObjectNode envelope = json.createObjectNode();
        ObjectNode data = envelope.putObject("data").put("orderCode",78001).put("amount",254745).put("code","00");
        envelope.put("signature",HexFormat.of().formatHex(hmac.doFinal(canonical.getBytes(StandardCharsets.UTF_8))));
        assertTrue(payos.verify(envelope));
        data.put("amount",100);
        assertFalse(payos.verify(envelope));
    }

    @Test
    void refusesToChargeWithoutCredentials() {
        PayOsClient unconfigured = new PayOsClient(json,"","","","",BigDecimal.ZERO);
        assertThrows(ResponseStatusException.class,unconfigured::requireConfigured);
    }
}
