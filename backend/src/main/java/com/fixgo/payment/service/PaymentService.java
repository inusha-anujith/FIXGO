package com.fixgo.payment.service;

import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import java.text.DecimalFormat;

@Service
public class PaymentService {
    // Note: Later, move these to your application.properties file for security
    private final String merchantId = "1234567"; 
    private final String merchantSecret = "YOUR_PAYHERE_SECRET"; 

    public String generatePayHereHash(String orderId, double amount, String currency) {
        DecimalFormat df = new DecimalFormat("0.00");
        String formattedAmount = df.format(amount);
        
        // PayHere Formula: MD5(merchantId + orderId + amount + currency + UPPERCASE(MD5(merchantSecret)))
        String hashedSecret = DigestUtils.md5DigestAsHex(merchantSecret.getBytes()).toUpperCase();
        String hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;
        
        return DigestUtils.md5DigestAsHex(hashString.getBytes()).toUpperCase();
    }
}