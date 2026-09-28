-- ============================================================
-- TeenTrack - Teenager Expense Tracker
-- Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS TABLE ───
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─── CATEGORIES TABLE ───
-- user_id = NULL means it's a default (system) category
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  icon VARCHAR(10) DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- ─── TRANSACTIONS TABLE ───
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) DEFAULT '',
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'UPI', 'Debit Card', 'Bank Transfer', 'Other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- ─── BUDGETS TABLE ───
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, month, year)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_month_year ON budgets(month, year);

-- ─── SAVINGS GOALS TABLE ───
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_savings_goals_user ON savings_goals(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Since we use the service_role key from the backend (which bypasses RLS),
-- these policies serve as a defense-in-depth layer for any direct Supabase access.

-- Users can only see their own profile
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = id);

-- Categories: users can see defaults (user_id IS NULL) + their own
CREATE POLICY categories_read ON categories
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY categories_write ON categories
  FOR ALL USING (user_id = auth.uid());

-- Transactions: users can only access their own
CREATE POLICY transactions_own_data ON transactions
  FOR ALL USING (user_id = auth.uid());

-- Budgets: users can only access their own
CREATE POLICY budgets_own_data ON budgets
  FOR ALL USING (user_id = auth.uid());

-- Savings Goals: users can only access their own
CREATE POLICY savings_goals_own_data ON savings_goals
  FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- DEFAULT EXPENSE CATEGORIES (system-wide, user_id = NULL)
-- ============================================================

INSERT INTO categories (user_id, name, type, icon) VALUES
  -- Expense categories
  (NULL, 'Food', 'expense', '🍔'),
  (NULL, 'Snacks', 'expense', '🍿'),
  (NULL, 'Transportation', 'expense', '🚌'),
  (NULL, 'Entertainment', 'expense', '🎬'),
  (NULL, 'Gaming', 'expense', '🎮'),
  (NULL, 'Shopping', 'expense', '🛍️'),
  (NULL, 'Education', 'expense', '📚'),
  (NULL, 'Subscriptions', 'expense', '📱'),
  (NULL, 'Mobile/Data', 'expense', '📶'),
  (NULL, 'Clothing', 'expense', '👕'),
  (NULL, 'Sports', 'expense', '⚽'),
  (NULL, 'Travel', 'expense', '✈️'),
  (NULL, 'Gifts', 'expense', '🎁'),
  (NULL, 'Health', 'expense', '💊'),
  (NULL, 'Other', 'expense', '📦'),
  -- Income categories
  (NULL, 'Pocket Money', 'income', '💰'),
  (NULL, 'Allowance', 'income', '🏦'),
  (NULL, 'Part-time Work', 'income', '💼'),
  (NULL, 'Gift', 'income', '🎁'),
  (NULL, 'Scholarship', 'income', '🎓'),
  (NULL, 'Other', 'income', '💵')
ON CONFLICT DO NOTHING;
