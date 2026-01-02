-- Remove Acorns budgets
DELETE FROM budgets WHERE category_id = (SELECT id FROM categories WHERE name = 'Acorns');

-- Remove Acorns category
DELETE FROM categories WHERE name = 'Acorns';

-- Reduce Discretionary Wants by Acorns amount ($60/week)
-- Jan 2026 (5 weeks): -$300 ($300.00)
-- 75319 - 30000 = 45319
UPDATE budgets 
SET budget_cents = budget_cents - 30000 
WHERE user_id = 'default' 
  AND year = 2026 
  AND month = 1 
  AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');

-- Attempt to update Feb-Dec 2026 if they exist (based on Acorns weeks)
-- Feb (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 2 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Mar (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 3 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Apr (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 4 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- May (5 weeks): -$300
UPDATE budgets SET budget_cents = budget_cents - 30000 WHERE user_id = 'default' AND year = 2026 AND month = 5 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Jun (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 6 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Jul (5 weeks): -$300
UPDATE budgets SET budget_cents = budget_cents - 30000 WHERE user_id = 'default' AND year = 2026 AND month = 7 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Aug (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 8 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Sep (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 9 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Oct (5 weeks): -$300
UPDATE budgets SET budget_cents = budget_cents - 30000 WHERE user_id = 'default' AND year = 2026 AND month = 10 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Nov (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 11 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
-- Dec (4 weeks): -$240
UPDATE budgets SET budget_cents = budget_cents - 24000 WHERE user_id = 'default' AND year = 2026 AND month = 12 AND category_id = (SELECT id FROM categories WHERE name = 'Discretionary Wants');
