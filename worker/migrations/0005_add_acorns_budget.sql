-- Add Acorns category if not exists
INSERT INTO categories (name, color, sort_order, active)
SELECT 'Acorns', '#16a34a', 11, 1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Acorns');

-- Seed 2026 Budgets for Acorns ($60/week)
-- Jan (5 weeks): $300
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 1, id, 30000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 30000;

-- Feb (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 2, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Mar (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 3, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Apr (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 4, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- May (5 weeks): $300
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 5, id, 30000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 30000;

-- Jun (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 6, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Jul (5 weeks): $300
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 7, id, 30000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 30000;

-- Aug (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 8, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Sep (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 9, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Oct (5 weeks): $300
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 10, id, 30000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 30000;

-- Nov (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 11, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;

-- Dec (4 weeks): $240
INSERT INTO budgets (user_id, year, month, category_id, budget_cents)
SELECT 'default', 2026, 12, id, 24000 FROM categories WHERE name = 'Acorns'
ON CONFLICT(user_id, year, month, category_id) DO UPDATE SET budget_cents = 24000;
