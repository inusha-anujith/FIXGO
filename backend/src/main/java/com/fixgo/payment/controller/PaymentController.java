package com.fixgo.payment.controller;

import org.springframework.web.bind.annotation.*;
import com.fixgo.payment.service.PaymentService;
import com.fixgo.payment.dto.HashRequestDTO;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/hash")
    public Map<String, String> getPaymentHash(@RequestBody HashRequestDTO request) {
        String hash = paymentService.generatePayHereHash(request.orderId(), request.amount(), request.currency());
        return Map.of("hash", hash);
    }
}