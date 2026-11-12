-- ============================================================================
-- SalonEase - Users Table DDL
-- Production-ready schema for user authentication and role management
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE TABLE IF NOT EXISTS `users` (
    `id`               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `full_name`        VARCHAR(100)    NOT NULL,
    `email`            VARCHAR(150)    NOT NULL,
    `phone`            VARCHAR(20)     DEFAULT NULL,
    `hashed_password`  VARCHAR(255)    NOT NULL,
    `role`             ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    `is_active`        BOOLEAN         NOT NULL DEFAULT TRUE,
    `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_email` (`email`),
    KEY `idx_users_role` (`role`),
    KEY `idx_users_is_active` (`is_active`),
    KEY `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Sample Data
-- Passwords are bcrypt hashes (cost factor 12):
--   admin user    -> 'admin123'
--   customer user -> 'customer123'
-- Regenerate with: python -c "import bcrypt; print(bcrypt.hashpw(b'YOUR_PASSWORD', bcrypt.gensalt(rounds=12)).decode())"
-- ============================================================================

INSERT INTO `users` (`full_name`, `email`, `phone`, `hashed_password`, `role`, `is_active`)
VALUES
    ('Salon Admin', 'admin@salonease.com', '+1-555-0100',
     '$2b$12$8uXHgahh/B.923pKg7Nd4OAdugXe2EpSO..QGm0VncmDNu3kv6q9e',
     'admin', TRUE),
    ('Jane Customer', 'jane@example.com', '+1-555-0199',
     '$2b$12$GzkTci/wnpbc5ZZoEyfpoeLE9wq1PfkvrIij.8MklEqzVEdmsdF9y',
     'customer', TRUE);
