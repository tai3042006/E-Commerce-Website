
-- Addresses for customers (users)
CREATE TABLE IF NOT EXISTS addresses (
  id          VARCHAR(50)    NOT NULL,
  customer_id VARCHAR(50)    NOT NULL,
  full_name   VARCHAR(150)   NOT NULL,
  phone       VARCHAR(50)    NOT NULL,
  address_line VARCHAR(200)  NOT NULL,
  city        VARCHAR(100)   NOT NULL,
  is_default  TINYINT(1)     NOT NULL DEFAULT 0,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addresses_customer (customer_id),
  CONSTRAINT fk_addresses_customer
    FOREIGN KEY (customer_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Payment methods (mock, stores only last 4 digits)
CREATE TABLE IF NOT EXISTS payment_methods (
  id          VARCHAR(50)    NOT NULL,
  customer_id VARCHAR(50)    NOT NULL,
  card_brand  VARCHAR(20)    NOT NULL,   -- e.g., visa, mastercard, amex
  last4       VARCHAR(4)     NOT NULL,
  expiry_month TINYINT      NOT NULL,
  expiry_year  SMALLINT     NOT NULL,
  is_default  TINYINT(1)     NOT NULL DEFAULT 0,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payment_customer (customer_id),
  CONSTRAINT fk_payment_customer
    FOREIGN KEY (customer_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
