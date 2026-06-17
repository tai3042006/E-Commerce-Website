-- CloFit database schema (MySQL 8+)
-- The server runs this on startup if tables don't exist.

CREATE TABLE IF NOT EXISTS categories (
  id          VARCHAR(32) PRIMARY KEY,
  label       VARCHAR(64) NOT NULL,
  parent_id   VARCHAR(32) NULL,
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(64) PRIMARY KEY,
  name        VARCHAR(128) NOT NULL,
  tagline     VARCHAR(255),
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  old_price   DECIMAL(10,2) NULL,
  image       VARCHAR(512),
  hover_image VARCHAR(512),
  category_id VARCHAR(32) NOT NULL,
  gender      ENUM('men','women','unisex') NOT NULL,
  rating      DECIMAL(2,1) DEFAULT 0,
  reviews     INT DEFAULT 0,
  badge       ENUM('new','sale','bestseller') NULL,
  in_stock    TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_gender (gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_images (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  VARCHAR(64) NOT NULL,
  url         VARCHAR(512) NOT NULL,
  sort_order  INT DEFAULT 0,
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,
  INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_colors (
  product_id  VARCHAR(64) NOT NULL,
  hex         VARCHAR(16) NOT NULL,
  PRIMARY KEY (product_id, hex),
  CONSTRAINT fk_product_colors_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_sizes (
  product_id  VARCHAR(64) NOT NULL,
  size        VARCHAR(16) NOT NULL,
  PRIMARY KEY (product_id, size),
  CONSTRAINT fk_product_sizes_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customers (
  id           VARCHAR(32) PRIMARY KEY,
  name         VARCHAR(128) NOT NULL,
  email        VARCHAR(128) UNIQUE NOT NULL,
  joined_at    DATE NOT NULL,
  orders_count INT DEFAULT 0,
  spent        DECIMAL(10,2) DEFAULT 0,
  location     VARCHAR(128)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(32) PRIMARY KEY,
  customer_id     VARCHAR(32) NOT NULL,
  order_date      DATE NOT NULL,
  total           DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','processing','shipped','delivered','cancelled') NOT NULL,
  product_summary VARCHAR(255),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
