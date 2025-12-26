-- Seed Categories
INSERT INTO categories (name, color, sort_order, active) VALUES
('Grocery', '#22c55e', 1, 1),
('FPL (Electric)', '#f59e0b', 2, 1),
('Fun Food', '#ec4899', 3, 1),
('Gas', '#3b82f6', 4, 1),
('Chewy (Pet Supplies)', '#8b5cf6', 5, 1),
('Xfinity (Internet)', '#06b6d4', 6, 1),
('Discretionary Wants', '#f43f5e', 7, 1),
('Car Payment', '#64748b', 8, 1),
('Auto - Vehicle Renewal', '#a855f7', 9, 1),
('Bonus', '#10b981', 10, 1);

-- Seed January 2026 Budgets (amounts in cents)
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2026, 1, 1, 50000),   -- Grocery $500
('default', 2026, 1, 2, 10000),   -- FPL $100
('default', 2026, 1, 3, 27500),   -- Fun Food $275
('default', 2026, 1, 4, 8000),    -- Gas $80
('default', 2026, 1, 5, 5500),    -- Chewy $55
('default', 2026, 1, 6, 8500),    -- Xfinity $85
('default', 2026, 1, 7, 75319),   -- Discretionary Wants $753.19
('default', 2026, 1, 8, 19500);   -- Car Payment $195

-- Seed August 2025 Monthly Rollups
INSERT INTO monthly_rollups (user_id, year, month, category_id, actual_cents, label_text) VALUES
('default', 2025, 8, 1, 35022, 'Amazon 40.70, Publix 18.09, Aldi 191.43, Myprotein 100.00'),
('default', 2025, 8, 2, 10300, 'FPL'),
('default', 2025, 8, 3, 26990, 'De Romos 91.59, Urban Buzz Coffee 15.34, sushi Thai 31.51, Ninos Pizzeria 35.47, Ankrolab Brewing 23.44, Ankrolab Brewing 20.84, Sushi Thai Too 51.71'),
('default', 2025, 8, 4, 6052, 'RaceTrac, 7-Eleven 28.71'),
('default', 2025, 8, 5, 5500, 'Chewy 55.00'),
('default', 2025, 8, 6, 7900, 'Xfinity 79.00'),
('default', 2025, 8, 7, 63874, 'DermaCare 5.00, PayPal 225.00, CS skins 43.00, Steam 25.00/18.00/15.13, uBreakiFix 223.63, PlayStation 69.99, Apple 18.99'),
('default', 2025, 8, 8, 19500, 'Car Payment');

-- Seed September 2025 Monthly Rollups
INSERT INTO monthly_rollups (user_id, year, month, category_id, actual_cents, label_text) VALUES
('default', 2025, 9, 1, 42606, 'Publix 22.19 + 19.16, ALDI 138.92, Amazon 65.68, 28.82, 8.51, 76.98, 65.80'),
('default', 2025, 9, 2, 9565, 'FPL'),
('default', 2025, 9, 3, 15409, 'Casa Blanca 78.53, 3 Pepper Burrito 17.57, Chipotle 14.54, CAVA 30.99, Panda Express 12.46'),
('default', 2025, 9, 4, 6007, '7-Eleven 30.65, 29.42'),
('default', 2025, 9, 5, 5542, 'Chewy 55.42'),
('default', 2025, 9, 6, 8500, 'Internet'),
('default', 2025, 9, 7, 12456, 'Steam 12.10, 19.99, 39.98; GMG 52.49'),
('default', 2025, 9, 8, 19500, 'Car Payment');

-- Seed October 2025 Monthly Rollups
INSERT INTO monthly_rollups (user_id, year, month, category_id, actual_cents, label_text) VALUES
('default', 2025, 10, 1, 25331, '$145.16 Aldi, $17.03 Publix, $2.00 Publix, $2.00 Publix, $87.12 Cabos Cantina'),
('default', 2025, 10, 2, 6741, 'FPL'),
('default', 2025, 10, 3, 23507, '$14.49 Taco Bus, $14.54 Chipotle, $81.67 Carrabbas, $36.62 Cheddars, $25.72 CAVA, $30.93 Outback, $16.80 Crazy Dingo Brewing, $14.30 Macs Minis'),
('default', 2025, 10, 4, 7063, '$11.59 7-Eleven, $30.66 7-Eleven, $28.38 RaceTrac'),
('default', 2025, 10, 5, 0, 'No purchase'),
('default', 2025, 10, 6, 8500, 'Xfinity'),
('default', 2025, 10, 7, 84138, 'Karlstor $29.25; Munchner Geschenke-Stuben $70.00; Galeria Kaufhof $5.84; Mini Metro $4.00; Ticketmaster $20.00; PayPal $225.00; Amazon $229.56; Amazon $72.66; Amazon $116.84; Steam $5.00; Steam $7.19; Steam $15.03; Apple $18.99; Apple $3.99; Harborside $2.00; Total Wine $22.35'),
('default', 2025, 10, 8, 19500, 'Car Payment');

-- Seed November 2025 Monthly Rollups
INSERT INTO monthly_rollups (user_id, year, month, category_id, actual_cents, label_text) VALUES
('default', 2025, 11, 1, 52343, '$162.08 ALDI, $3.58 ALDI, $9.40 Walmart, $70.72 Walmart $50.30 Amazon (groceries), $107.50 MyProtein, $3.46 Walmart Supercenter'),
('default', 2025, 11, 2, 8743, 'FPL'),
('default', 2025, 11, 3, 28458, '$79.03 Capones Coal Fired Pizza, $36.29 Tokyo Hibachi, $20.02 Panda Express, $11.18 McDonalds, $13.64 McDonalds, $18.45 McDonalds, $15.03 McDonalds, $26.68 Tropical Smoothie Cafe'),
('default', 2025, 11, 4, 8700, '$31.98 7-Eleven $24.96 7-Eleven, $30.06 7-Eleven'),
('default', 2025, 11, 5, 0, 'No purchase'),
('default', 2025, 11, 6, 8500, 'Xfinity'),
('default', 2025, 11, 7, 39344, '$107.50 Amazon, $5.00 Steam Games, $18.99 Apple, $35.95 PayPal, $1.00 Front Gate Tickets, Paypal $225'),
('default', 2025, 11, 8, 19500, 'Car Payment');

-- Seed December 2025 Monthly Rollups
INSERT INTO monthly_rollups (user_id, year, month, category_id, actual_cents, label_text) VALUES
('default', 2025, 12, 1, 38375, '$149.85 ALDI, $70.52 Amazon (groceries), $62.24 Walmart, $10.44 Chipotle, $90.70 Aldi'),
('default', 2025, 12, 2, 6156, '$61.56 FPL'),
('default', 2025, 12, 3, 21222, '$26.94 CAVA, $47.23 Artisan Eatery, $40.34 Tokyo Hibachi & Sushi, $35.00 Tony Saccos Coal Oven Pizza, $9.52 Bay Street Yard, $53.19 The Toasted Yolk Cafe'),
('default', 2025, 12, 4, 5693, '$30.02 7-Eleven, $26.91 7-Eleven'),
('default', 2025, 12, 5, 5331, '$53.31 Chewy'),
('default', 2025, 12, 6, 8500, 'Xfinity'),
('default', 2025, 12, 7, 99443, '$32.37 Amazon, $24.39 Amazon, $48.45 Old Navy, $18.11 Old Navy, $43.26 Target (Dec 1), $43.26 Target (Dec 15), $43.26 Target (Dec 31), $185.62 Rockville, $30.89 PayPal, $39.36 Amazon, $14.43 Steam Games, $43.26 PayPal, $95.80 Homesense, $5.00 Harborside Parking Lot, $90.90 Vinyl.com, $2.22 Apple, $19.35 Amazon, $54.22 Amazon, $89.10 Amazon, $21.97 Amazon, $49.21 Amazon'),
('default', 2025, 12, 8, 19500, 'Car Payment'),
('default', 2025, 12, 9, 5505, '$55.05 Vehicle Renewal');

-- Seed December 2025 Budgets (for completeness)
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2025, 12, 1, 50000),   -- Grocery $500
('default', 2025, 12, 2, 10000),   -- FPL $100
('default', 2025, 12, 3, 16900),   -- Fun Food $169
('default', 2025, 12, 4, 6500),    -- Gas $65
('default', 2025, 12, 5, 5500),    -- Chewy $55
('default', 2025, 12, 6, 8500),    -- Xfinity $85
('default', 2025, 12, 7, 58700),   -- Discretionary Wants $587
('default', 2025, 12, 8, 19500),   -- Car Payment $195
('default', 2025, 12, 9, 0);       -- Auto - Vehicle Renewal $0

-- Seed November 2025 Budgets
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2025, 11, 1, 50000),
('default', 2025, 11, 2, 10000),
('default', 2025, 11, 3, 10000),
('default', 2025, 11, 4, 6500),
('default', 2025, 11, 5, 5500),
('default', 2025, 11, 6, 8500),
('default', 2025, 11, 7, 58700),
('default', 2025, 11, 8, 19500);

-- Seed October 2025 Budgets
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2025, 10, 1, 50000),
('default', 2025, 10, 2, 10000),
('default', 2025, 10, 3, 10000),
('default', 2025, 10, 4, 6500),
('default', 2025, 10, 5, 5500),
('default', 2025, 10, 6, 8500),
('default', 2025, 10, 7, 58700),
('default', 2025, 10, 8, 19500);

-- Seed September 2025 Budgets
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2025, 9, 1, 50000),
('default', 2025, 9, 2, 10000),
('default', 2025, 9, 3, 10000),
('default', 2025, 9, 4, 6500),
('default', 2025, 9, 5, 5500),
('default', 2025, 9, 6, 8500),
('default', 2025, 9, 7, 50700),
('default', 2025, 9, 8, 19500);

-- Seed August 2025 Budgets
INSERT INTO budgets (user_id, year, month, category_id, budget_cents) VALUES
('default', 2025, 8, 1, 50000),
('default', 2025, 8, 2, 10000),
('default', 2025, 8, 3, 10000),
('default', 2025, 8, 4, 6500),
('default', 2025, 8, 5, 5500),
('default', 2025, 8, 6, 8500),
('default', 2025, 8, 7, 50700),
('default', 2025, 8, 8, 19500);

-- Seed Rainy Day Fund Goal
INSERT INTO goals (user_id, name, target_cents, current_cents, is_rainy_day) VALUES
('default', 'Rainy Day Fund', 500000, 0, 1);

-- Seed 2026 Paychecks (bi-weekly starting Jan 2, 2026)
-- Base paycheck: $1,586.43 = 158643 cents
-- January 2026: 3 paychecks (Jan 2, Jan 16, Jan 30 - 3rd is bonus)
-- July 2026: 3 paychecks (Jul 3, Jul 17, Jul 31 - 3rd is bonus)
INSERT INTO income_events (user_id, date, amount_cents, type, note) VALUES
-- January 2026 (3 paychecks - 3rd is bonus)
('default', '2026-01-02', 158643, 'base', 'Paycheck 1'),
('default', '2026-01-16', 158643, 'base', 'Paycheck 2'),
('default', '2026-01-30', 158643, 'bonus', 'Bonus Paycheck (3rd paycheck month)'),
-- February 2026
('default', '2026-02-13', 158643, 'base', 'Paycheck 1'),
('default', '2026-02-27', 158643, 'base', 'Paycheck 2'),
-- March 2026
('default', '2026-03-13', 158643, 'base', 'Paycheck 1'),
('default', '2026-03-27', 158643, 'base', 'Paycheck 2'),
-- April 2026
('default', '2026-04-10', 158643, 'base', 'Paycheck 1'),
('default', '2026-04-24', 158643, 'base', 'Paycheck 2'),
-- May 2026
('default', '2026-05-08', 158643, 'base', 'Paycheck 1'),
('default', '2026-05-22', 158643, 'base', 'Paycheck 2'),
-- June 2026
('default', '2026-06-05', 158643, 'base', 'Paycheck 1'),
('default', '2026-06-19', 158643, 'base', 'Paycheck 2'),
-- July 2026 (3 paychecks - 3rd is bonus)
('default', '2026-07-03', 158643, 'base', 'Paycheck 1'),
('default', '2026-07-17', 158643, 'base', 'Paycheck 2'),
('default', '2026-07-31', 158643, 'bonus', 'Bonus Paycheck (3rd paycheck month)'),
-- August 2026
('default', '2026-08-14', 158643, 'base', 'Paycheck 1'),
('default', '2026-08-28', 158643, 'base', 'Paycheck 2'),
-- September 2026
('default', '2026-09-11', 158643, 'base', 'Paycheck 1'),
('default', '2026-09-25', 158643, 'base', 'Paycheck 2'),
-- October 2026
('default', '2026-10-09', 158643, 'base', 'Paycheck 1'),
('default', '2026-10-23', 158643, 'base', 'Paycheck 2'),
-- November 2026
('default', '2026-11-06', 158643, 'base', 'Paycheck 1'),
('default', '2026-11-20', 158643, 'base', 'Paycheck 2'),
-- December 2026
('default', '2026-12-04', 158643, 'base', 'Paycheck 1'),
('default', '2026-12-18', 158643, 'base', 'Paycheck 2');
