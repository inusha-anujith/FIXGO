package com.fixgo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point.
 *
 * <p>{@code @SpringBootApplication} component-scans this package and everything
 * below it, so every domain module under {@code com.fixgo} — auth, user,
 * vehicle, provider, job, rating, chat, report, notification, admin — is picked
 * up without further configuration. A component placed outside {@code com.fixgo}
 * is silently ignored.
 */
@SpringBootApplication
public class FixgoApplication {

    public static void main(String[] args) {
        SpringApplication.run(FixgoApplication.class, args);
    }
}
