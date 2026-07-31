-- =========================================================
-- CV Creator — SQLite Schema
-- =========================================================

-- ---------------------------------------------------------
-- USERS
-- ---------------------------------------------------------
CREATE TABLE users (
  id                INTEGER PRIMARY KEY,
  full_name         TEXT              NOT NULL,
  email             TEXT              NOT NULL UNIQUE,
  password_hash     TEXT              NOT NULL,
  avatar_url        TEXT,
  role              TEXT              NOT NULL DEFAULT 'user'
                      CHECK (role IN ('user', 'admin')),
  theme_preference  TEXT              NOT NULL DEFAULT 'light'
                      CHECK (theme_preference IN ('light', 'dark')),
  is_active         INTEGER           NOT NULL DEFAULT 1,
  last_login_at     DATETIME,
  created_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ---------------------------------------------------------
-- CV_TEMPLATES
-- ---------------------------------------------------------
CREATE TABLE cv_templates (
  id                INTEGER PRIMARY KEY,
  name              TEXT              NOT NULL,
  description       TEXT,
  category          TEXT              NOT NULL DEFAULT 'general',
  thumbnail_url     TEXT,
  preview_html      TEXT,
  default_colors    TEXT              NOT NULL DEFAULT '["#0284C7","#0369A1","#E0F2FE","#0F172A"]',
  price_cents       INTEGER           NOT NULL DEFAULT 300,
  is_active         INTEGER           NOT NULL DEFAULT 1,
  sold_count        INTEGER           NOT NULL DEFAULT 0,
  avg_rating        REAL              NOT NULL DEFAULT 0.0,
  created_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_category  ON cv_templates(category);
CREATE INDEX idx_templates_is_active ON cv_templates(is_active);

-- ---------------------------------------------------------
-- USER_CVS
-- ---------------------------------------------------------
CREATE TABLE user_cvs (
  id                INTEGER PRIMARY KEY,
  user_id           INTEGER           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id       INTEGER           NOT NULL REFERENCES cv_templates(id) ON DELETE RESTRICT,
  title             TEXT              NOT NULL DEFAULT 'Untitled CV',
  selected_color    TEXT              NOT NULL DEFAULT '#0284C7',
  content           TEXT              NOT NULL DEFAULT '{}',
  pdf_url           TEXT,
  is_finalized      INTEGER           NOT NULL DEFAULT 0,
  created_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_cvs_user_id     ON user_cvs(user_id);
CREATE INDEX idx_user_cvs_template_id ON user_cvs(template_id);

-- ---------------------------------------------------------
-- SALES_ORDERS
-- ---------------------------------------------------------
CREATE TABLE sales_orders (
  id                INTEGER PRIMARY KEY,
  user_id           INTEGER           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id       INTEGER           NOT NULL REFERENCES cv_templates(id) ON DELETE RESTRICT,
  user_cv_id        INTEGER           REFERENCES user_cvs(id) ON DELETE SET NULL,
  amount_cents      INTEGER           NOT NULL,
  currency          TEXT              NOT NULL DEFAULT 'USD',
  status            TEXT              NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','paid','refunded','failed')),
  payment_provider  TEXT,
  payment_ref       TEXT,
  purchased_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id      ON sales_orders(user_id);
CREATE INDEX idx_orders_template_id  ON sales_orders(template_id);
CREATE INDEX idx_orders_purchased_at ON sales_orders(purchased_at);
CREATE INDEX idx_orders_status       ON sales_orders(status);

-- ---------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------
CREATE TABLE reviews (
  id                INTEGER PRIMARY KEY,
  user_id           INTEGER           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id       INTEGER           NOT NULL REFERENCES cv_templates(id) ON DELETE CASCADE,
  rating            INTEGER           NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment           TEXT,
  created_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, template_id)
);

CREATE INDEX idx_reviews_template_id ON reviews(template_id);

-- ---------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------

-- Trigger: keep cv_templates.avg_rating in sync
CREATE TRIGGER trg_reviews_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE cv_templates
  SET avg_rating = (
        SELECT ROUND(AVG(rating), 1)
        FROM reviews WHERE template_id = NEW.template_id
      )
  WHERE id = NEW.template_id;
END;

CREATE TRIGGER trg_reviews_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
  UPDATE cv_templates
  SET avg_rating = (
        SELECT ROUND(AVG(rating), 1)
        FROM reviews WHERE template_id = NEW.template_id
      )
  WHERE id = NEW.template_id;
END;

CREATE TRIGGER trg_reviews_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
  UPDATE cv_templates
  SET avg_rating = COALESCE((
        SELECT ROUND(AVG(rating), 1)
        FROM reviews WHERE template_id = OLD.template_id
      ), 0.0)
  WHERE id = OLD.template_id;
END;

-- Trigger: keep cv_templates.sold_count in sync on paid orders
CREATE TRIGGER trg_orders_after_paid
AFTER UPDATE ON sales_orders
FOR EACH ROW
WHEN NEW.status = 'paid' AND OLD.status != 'paid'
BEGIN
  UPDATE cv_templates SET sold_count = sold_count + 1 WHERE id = NEW.template_id;
END;

CREATE TRIGGER trg_orders_after_insert_paid
AFTER INSERT ON sales_orders
FOR EACH ROW
WHEN NEW.status = 'paid'
BEGIN
  UPDATE cv_templates SET sold_count = sold_count + 1 WHERE id = NEW.template_id;
END;
