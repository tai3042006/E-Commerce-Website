-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id    VARCHAR(50)  NOT NULL,
  label VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(50)     NOT NULL,
  name        VARCHAR(200)    NOT NULL,
  tagline     VARCHAR(300)    NULL,
  description TEXT            NULL,
  price       DECIMAL(10,2)   NOT NULL,
  old_price   DECIMAL(10,2)   NULL,
  image       VARCHAR(500)    NULL,
  hover_image VARCHAR(500)    NULL,
  category_id VARCHAR(50)     NOT NULL,
  gender      VARCHAR(20)     NOT NULL DEFAULT 'unisex',
  rating      DECIMAL(3,1)    NOT NULL DEFAULT 0.0,
  reviews     INT UNSIGNED    NOT NULL DEFAULT 0,
  badge       VARCHAR(50)     NULL,
  in_stock    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_category (category_id),
  KEY idx_gender   (gender),
  KEY idx_badge    (badge)
) ENGINE=InnoDB;

-- Product gallery images
CREATE TABLE IF NOT EXISTS product_images (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id VARCHAR(50)     NOT NULL,
  url        VARCHAR(500)    NOT NULL,
  sort_order SMALLINT        NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pi_product (product_id),
  CONSTRAINT fk_pi_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Product colours
CREATE TABLE IF NOT EXISTS product_colors (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id VARCHAR(50)     NOT NULL,
  hex        VARCHAR(10)     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_pc_product (product_id),
  CONSTRAINT fk_pc_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Product sizes
CREATE TABLE IF NOT EXISTS product_sizes (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id VARCHAR(50)     NOT NULL,
  size       VARCHAR(20)     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_ps_product (product_id),
  CONSTRAINT fk_ps_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Users (login / register)
CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR(50)  NOT NULL,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50)  NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'customer',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB;

-- Notifications — powers the Observer-pattern notification system:
--   * audience = 'admin'    -> shown to every admin (e.g. "new user registered")
--   * audience = 'customer' -> shown to every regular customer (e.g. "new product added")
--   * audience = 'user'     -> targeted at a single user_id (e.g. "your order shipped")
CREATE TABLE IF NOT EXISTS notifications (
  id         VARCHAR(50)  NOT NULL,
  audience   VARCHAR(20)  NOT NULL,            -- 'admin' | 'customer' | 'user'
  user_id    VARCHAR(50)  NULL,                -- set only when audience = 'user'
  event      VARCHAR(50)  NOT NULL,            -- 'userRegistered' | 'productAdded' | 'orderCreated' | ...
  message    VARCHAR(500) NOT NULL,
  link       VARCHAR(300) NULL,                -- optional frontend route, e.g. /product/123
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_audience (audience),
  KEY idx_notif_user     (user_id),
  KEY idx_notif_created  (created_at)
) ENGINE=InnoDB;

-- Product reviews (star rating + written review, optionally posted anonymously)
CREATE TABLE IF NOT EXISTS product_reviews (
  id           VARCHAR(50)   NOT NULL,
  product_id   VARCHAR(50)   NOT NULL,
  user_id      VARCHAR(50)   NOT NULL,
  rating       TINYINT       NOT NULL,
  comment      TEXT          NULL,
  is_anonymous TINYINT(1)    NOT NULL DEFAULT 0,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_product_user (product_id, user_id),
  KEY idx_review_product (product_id),
  CONSTRAINT fk_review_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Customers (admin panel)
CREATE TABLE IF NOT EXISTS customers (
  id           VARCHAR(50)     NOT NULL,
  name         VARCHAR(150)    NOT NULL,
  email        VARCHAR(255)    NOT NULL,
  joined_at    DATETIME        NULL,
  orders_count INT UNSIGNED    NOT NULL DEFAULT 0,
  spent        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  location     VARCHAR(100)    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_email (email)
) ENGINE=InnoDB;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(50)   NOT NULL,
  customer_id     VARCHAR(50)   NOT NULL,
  order_date      DATETIME      NULL,
  total           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status          VARCHAR(50)   NOT NULL DEFAULT 'pending',
  product_summary VARCHAR(300)  NULL,
  items_count     INT UNSIGNED  NOT NULL DEFAULT 0,
  address         VARCHAR(300)  NULL,
  city            VARCHAR(100)  NULL,
  zip             VARCHAR(20)   NULL,
  country         VARCHAR(100)  NULL,
  PRIMARY KEY (id),
  KEY idx_order_customer (customer_id),
  CONSTRAINT fk_order_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(50) NOT NULL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_sess_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addresses (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address_line VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL,
  card_brand VARCHAR(20) NOT NULL,
  last4 VARCHAR(4) NOT NULL,
  expiry_month TINYINT NOT NULL,
  expiry_year SMALLINT NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_uploads (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  media_type VARCHAR(50) NOT NULL,
  data MEDIUMBLOB NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notification_reads (
  user_id VARCHAR(50) NOT NULL,
  notification_id VARCHAR(50) NOT NULL,
  PRIMARY KEY(user_id, notification_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(notification_id) REFERENCES notifications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS checkout_requests (
  number BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  request_id CHAR(36) NOT NULL,
  UNIQUE KEY uq_checkout_request (user_id, request_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_payments (
  code BIGINT NOT NULL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  user_id VARCHAR(50) NOT NULL,
  amount_vnd BIGINT NOT NULL,
  link_id VARCHAR(50) NULL,
  qr_code TEXT NULL,
  paid_at DATETIME NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS order_lines (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  size VARCHAR(20) NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS offline_payments (
  order_id VARCHAR(50) PRIMARY KEY,
  method VARCHAR(10) NOT NULL,
  image_id VARCHAR(50),
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO checkout_requests(user_id,request_id)
SELECT user_id,SUBSTRING(order_id,4) FROM order_payments
WHERE order_id REGEXP '^CF-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
