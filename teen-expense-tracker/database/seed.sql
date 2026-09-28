-- ============================================================
-- TeenTrack - Development Seed Data
-- WARNING: This is demo/development data only.
-- Do NOT run this against a production database.
-- ============================================================

-- This seed data assumes you already have a test user registered.
-- You can insert a test user manually or register via the API.
-- The password below is the bcrypt hash of "TestPass123" with 12 rounds.

INSERT INTO users (id, name, email, password_hash) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo Teen', 'demo@teentrack.app', '$2a$12$jkmRtfO0E2Ostr4TYfNuXOvhCaDEpaqCOn9yVo.9yJ1MIY93GqJt2')
ON CONFLICT (email) DO NOTHING;

-- Get default category IDs (these are the ones inserted by schema.sql)
-- We use subqueries to reference them by name

-- Sample expense transactions for the demo user
INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date, payment_method) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Food' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 250.00, 'Lunch at school canteen', '2026-09-15', 'Cash'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Gaming' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 599.00, 'Mobile game subscription', '2026-09-10', 'UPI'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Transportation' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 150.00, 'Bus pass weekly', '2026-09-08', 'Cash'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Shopping' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 1200.00, 'New sneakers', '2026-09-05', 'Debit Card'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 350.00, 'Movie with friends', '2026-09-20', 'UPI'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Snacks' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 180.00, 'Snacks and drinks', '2026-09-22', 'Cash'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Education' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 450.00, 'Notebook and stationery', '2026-09-03', 'Cash'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Subscriptions' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 199.00, 'Spotify subscription', '2026-09-01', 'UPI'),
  -- Income transactions
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Pocket Money' AND type = 'income' AND user_id IS NULL LIMIT 1), 'income', 5000.00, 'Monthly pocket money', '2026-09-01', 'Bank Transfer'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Part-time Work' AND type = 'income' AND user_id IS NULL LIMIT 1), 'income', 3000.00, 'Tutoring younger students', '2026-09-15', 'UPI'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Gift' AND type = 'income' AND user_id IS NULL LIMIT 1), 'income', 2000.00, 'Birthday gift from uncle', '2026-09-18', 'Cash'),
  -- Previous month transactions (August)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Food' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 200.00, 'Lunch', '2026-08-12', 'Cash'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Gaming' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 299.00, 'Game purchase', '2026-08-15', 'UPI'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND user_id IS NULL LIMIT 1), 'expense', 500.00, 'Concert tickets', '2026-08-20', 'Debit Card'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Pocket Money' AND type = 'income' AND user_id IS NULL LIMIT 1), 'income', 5000.00, 'Monthly pocket money', '2026-08-01', 'Bank Transfer'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Part-time Work' AND type = 'income' AND user_id IS NULL LIMIT 1), 'income', 2500.00, 'Weekend tutoring', '2026-08-18', 'UPI');

-- Sample budgets
INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Food' AND type = 'expense' AND user_id IS NULL LIMIT 1), 2000.00, 9, 2026),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND user_id IS NULL LIMIT 1), 1000.00, 9, 2026),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Transportation' AND type = 'expense' AND user_id IS NULL LIMIT 1), 800.00, 9, 2026),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM categories WHERE name = 'Shopping' AND type = 'expense' AND user_id IS NULL LIMIT 1), 1500.00, 9, 2026);

-- Sample savings goals
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'New Headphones', 5000.00, 2500.00, '2026-12-31'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Gaming Console', 35000.00, 8000.00, '2027-06-30'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emergency Fund', 10000.00, 4200.00, NULL);
