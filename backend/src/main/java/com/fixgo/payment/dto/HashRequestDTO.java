package com.fixgo.payment.dto;

public record HashRequestDTO(String orderId, double amount, String currency) {}