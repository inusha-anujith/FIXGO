package com.fixgo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {
    "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration",
    "org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration",
    "org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration"
})
public class FixgoApplication {
    public static void main(String[] args) {
        SpringApplication.run(FixgoApplication.class, args);
    }
}