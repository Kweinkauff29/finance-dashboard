-- Individual Transactions from Dec 2025
-- Grocery (category_id = 1)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-15', 14985, 'ALDI', 1, NULL),
('default', '2025-12-10', 7052, 'Amazon', 1, 'groceries'),
('default', '2025-12-08', 6224, 'Walmart', 1, NULL),
('default', '2025-12-05', 1044, 'Chipotle', 1, NULL),
('default', '2025-12-20', 9070, 'ALDI', 1, NULL);

-- FPL (category_id = 2)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-01', 6156, 'FPL', 2, 'Electric bill');

-- Fun Food (category_id = 3)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-03', 2694, 'CAVA', 3, NULL),
('default', '2025-12-07', 4723, 'Artisan Eatery', 3, NULL),
('default', '2025-12-12', 4034, 'Tokyo Hibachi & Sushi', 3, NULL),
('default', '2025-12-14', 3500, 'Tony Saccos Coal Oven Pizza', 3, NULL),
('default', '2025-12-18', 952, 'Bay Street Yard', 3, NULL),
('default', '2025-12-22', 5319, 'The Toasted Yolk Cafe', 3, 'pending');

-- Gas (category_id = 4)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-05', 3002, '7-Eleven', 4, NULL),
('default', '2025-12-19', 2691, '7-Eleven', 4, NULL);

-- Chewy (category_id = 5)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-10', 5331, 'Chewy', 5, NULL);

-- Xfinity (category_id = 6)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-01', 8500, 'Xfinity', 6, 'Internet');

-- Discretionary Wants (category_id = 7)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-02', 3237, 'Amazon', 7, NULL),
('default', '2025-12-02', 2439, 'Amazon', 7, NULL),
('default', '2025-12-04', 4845, 'Old Navy', 7, NULL),
('default', '2025-12-04', 1811, 'Old Navy', 7, NULL),
('default', '2025-12-01', 4326, 'Target', 7, NULL),
('default', '2025-12-15', 4326, 'Target', 7, NULL),
('default', '2025-12-31', 4326, 'Target', 7, NULL),
('default', '2025-12-06', 18562, 'Rockville', 7, NULL),
('default', '2025-12-08', 3089, 'PayPal', 7, NULL),
('default', '2025-12-09', 3936, 'Amazon', 7, 'pending'),
('default', '2025-12-10', 1443, 'Steam Games', 7, NULL),
('default', '2025-12-11', 4326, 'PayPal', 7, NULL),
('default', '2025-12-13', 9580, 'Homesense', 7, NULL),
('default', '2025-12-14', 500, 'Harborside Parking Lot', 7, NULL),
('default', '2025-12-16', 9090, 'Vinyl.com', 7, NULL),
('default', '2025-12-17', 222, 'Apple', 7, NULL),
('default', '2025-12-18', 1935, 'Amazon', 7, NULL),
('default', '2025-12-19', 5422, 'Amazon', 7, NULL),
('default', '2025-12-20', 8910, 'Amazon', 7, 'pending'),
('default', '2025-12-21', 2197, 'Amazon', 7, NULL),
('default', '2025-12-22', 4921, 'Amazon', 7, NULL);

-- Car Payment (category_id = 8)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-01', 19500, 'Car Payment', 8, NULL);

-- Auto - Vehicle Renewal (category_id = 9)
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-12-15', 5505, 'Vehicle Renewal', 9, 'pending');

-- November 2025 Transactions
-- Grocery
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-02', 16208, 'ALDI', 1, NULL),
('default', '2025-11-05', 358, 'ALDI', 1, NULL),
('default', '2025-11-08', 940, 'Walmart', 1, NULL),
('default', '2025-11-10', 7072, 'Walmart', 1, NULL),
('default', '2025-11-12', 5030, 'Amazon', 1, 'groceries'),
('default', '2025-11-15', 10750, 'MyProtein', 1, NULL),
('default', '2025-11-18', 346, 'Walmart Supercenter', 1, NULL);

-- FPL
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-01', 8743, 'FPL', 2, 'Electric bill');

-- Fun Food
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-03', 7903, 'Capones Coal Fired Pizza', 3, NULL),
('default', '2025-11-07', 3629, 'Tokyo Hibachi', 3, NULL),
('default', '2025-11-10', 2002, 'Panda Express', 3, NULL),
('default', '2025-11-12', 1118, 'McDonalds', 3, NULL),
('default', '2025-11-15', 1364, 'McDonalds', 3, NULL),
('default', '2025-11-18', 1845, 'McDonalds', 3, NULL),
('default', '2025-11-21', 1503, 'McDonalds', 3, NULL),
('default', '2025-11-25', 2668, 'Tropical Smoothie Cafe', 3, NULL);

-- Gas
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-05', 3198, '7-Eleven', 4, NULL),
('default', '2025-11-15', 2496, '7-Eleven', 4, NULL),
('default', '2025-11-25', 3006, '7-Eleven', 4, 'pending');

-- Xfinity
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-01', 8500, 'Xfinity', 6, 'Internet');

-- Discretionary Wants
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-05', 10750, 'Amazon', 7, 'pending'),
('default', '2025-11-08', 500, 'Steam Games', 7, NULL),
('default', '2025-11-10', 1899, 'Apple', 7, 'pending'),
('default', '2025-11-12', 3595, 'PayPal', 7, 'pending'),
('default', '2025-11-15', 100, 'Front Gate Tickets', 7, NULL),
('default', '2025-11-20', 22500, 'PayPal', 7, NULL);

-- Car Payment
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-11-01', 19500, 'Car Payment', 8, NULL);

-- October 2025 Transactions
-- Grocery
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-05', 14516, 'ALDI', 1, NULL),
('default', '2025-10-10', 1703, 'Publix', 1, NULL),
('default', '2025-10-12', 200, 'Publix', 1, NULL),
('default', '2025-10-15', 200, 'Publix', 1, NULL),
('default', '2025-10-20', 8712, 'Cabos Cantina', 1, NULL);

-- FPL
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-01', 6741, 'FPL', 2, 'Electric bill');

-- Fun Food
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-03', 1449, 'Taco Bus', 3, NULL),
('default', '2025-10-05', 1454, 'Chipotle', 3, NULL),
('default', '2025-10-08', 8167, 'Carrabbas', 3, NULL),
('default', '2025-10-12', 3662, 'Cheddars', 3, NULL),
('default', '2025-10-15', 2572, 'CAVA', 3, NULL),
('default', '2025-10-18', 3093, 'Outback', 3, NULL),
('default', '2025-10-22', 1680, 'Crazy Dingo Brewing', 3, NULL),
('default', '2025-10-25', 1430, 'Macs Minis', 3, NULL);

-- Gas
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-05', 1159, '7-Eleven', 4, NULL),
('default', '2025-10-15', 3066, '7-Eleven', 4, NULL),
('default', '2025-10-25', 2838, 'RaceTrac', 4, NULL);

-- Xfinity
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-01', 8500, 'Xfinity', 6, 'Internet');

-- Discretionary Wants
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-02', 2925, 'Karlstor', 7, NULL),
('default', '2025-10-03', 7000, 'Munchner Geschenke-Stuben', 7, NULL),
('default', '2025-10-04', 584, 'Galeria Kaufhof', 7, NULL),
('default', '2025-10-05', 400, 'Mini Metro', 7, NULL),
('default', '2025-10-06', 2000, 'Ticketmaster', 7, 'Parking Pass'),
('default', '2025-10-08', 22500, 'PayPal', 7, NULL),
('default', '2025-10-10', 22956, 'Amazon', 7, NULL),
('default', '2025-10-12', 7266, 'Amazon', 7, NULL),
('default', '2025-10-15', 11684, 'Amazon', 7, NULL),
('default', '2025-10-16', 500, 'Steam', 7, NULL),
('default', '2025-10-17', 719, 'Steam', 7, NULL),
('default', '2025-10-18', 1503, 'Steam', 7, NULL),
('default', '2025-10-20', 1899, 'Apple', 7, NULL),
('default', '2025-10-21', 399, 'Apple', 7, NULL),
('default', '2025-10-22', 200, 'Harborside Parking', 7, NULL),
('default', '2025-10-25', 2235, 'Total Wine', 7, NULL);

-- Car Payment
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-10-01', 19500, 'Car Payment', 8, NULL);

-- September 2025 Transactions
-- Grocery
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-02', 2219, 'Publix', 1, NULL),
('default', '2025-09-05', 1916, 'Publix', 1, NULL),
('default', '2025-09-08', 13892, 'ALDI', 1, NULL),
('default', '2025-09-10', 6568, 'Amazon', 1, NULL),
('default', '2025-09-12', 2882, 'Amazon', 1, NULL),
('default', '2025-09-15', 851, 'Amazon', 1, NULL),
('default', '2025-09-18', 7698, 'Amazon', 1, NULL),
('default', '2025-09-22', 6580, 'Amazon', 1, NULL);

-- FPL
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-01', 9565, 'FPL', 2, 'Electric bill');

-- Fun Food
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-05', 7853, 'Casa Blanca', 3, NULL),
('default', '2025-09-10', 1757, '3 Pepper Burrito', 3, NULL),
('default', '2025-09-15', 1454, 'Chipotle', 3, NULL),
('default', '2025-09-20', 3099, 'CAVA', 3, NULL),
('default', '2025-09-25', 1246, 'Panda Express', 3, NULL);

-- Gas
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-08', 3065, '7-Eleven', 4, NULL),
('default', '2025-09-22', 2942, '7-Eleven', 4, NULL);

-- Chewy
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-10', 5542, 'Chewy', 5, NULL);

-- Xfinity
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-01', 8500, 'Xfinity', 6, 'Internet');

-- Discretionary Wants
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-05', 1210, 'Steam', 7, NULL),
('default', '2025-09-10', 1999, 'Steam', 7, NULL),
('default', '2025-09-15', 3998, 'Steam', 7, NULL),
('default', '2025-09-20', 5249, 'GMG', 7, NULL);

-- Car Payment
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-09-01', 19500, 'Car Payment', 8, NULL);

-- August 2025 Transactions
-- Grocery
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-05', 4070, 'Amazon', 1, NULL),
('default', '2025-08-08', 1809, 'Publix', 1, NULL),
('default', '2025-08-12', 19143, 'ALDI', 1, NULL),
('default', '2025-08-20', 10000, 'Myprotein', 1, NULL);

-- FPL
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-01', 10300, 'FPL', 2, 'Electric bill');

-- Fun Food
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-03', 9159, 'De Romos', 3, NULL),
('default', '2025-08-06', 1534, 'Urban Buzz Coffee', 3, NULL),
('default', '2025-08-10', 3151, 'Sushi Thai', 3, NULL),
('default', '2025-08-14', 3547, 'Ninos Pizzeria', 3, NULL),
('default', '2025-08-18', 2344, 'Ankrolab Brewing', 3, NULL),
('default', '2025-08-22', 2084, 'Ankrolab Brewing', 3, NULL),
('default', '2025-08-26', 5171, 'Sushi Thai Too', 3, NULL);

-- Gas
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-10', 3181, 'RaceTrac', 4, NULL),
('default', '2025-08-22', 2871, '7-Eleven', 4, NULL);

-- Chewy
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-10', 5500, 'Chewy', 5, NULL);

-- Xfinity
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-01', 7900, 'Xfinity', 6, NULL);

-- Discretionary Wants
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-02', 500, 'DermaCare', 7, NULL),
('default', '2025-08-05', 22500, 'PayPal', 7, NULL),
('default', '2025-08-08', 4300, 'CS skins', 7, NULL),
('default', '2025-08-10', 2500, 'Steam', 7, NULL),
('default', '2025-08-12', 1800, 'Steam', 7, NULL),
('default', '2025-08-14', 1513, 'Steam', 7, 'pending'),
('default', '2025-08-16', 22363, 'uBreakiFix', 7, NULL),
('default', '2025-08-20', 6999, 'PlayStation', 7, NULL),
('default', '2025-08-25', 1899, 'Apple', 7, NULL);

-- Car Payment
INSERT INTO transactions (user_id, date, amount_cents, merchant, category_id, note) VALUES
('default', '2025-08-01', 19500, 'Car Payment', 8, NULL);

-- Delete the monthly rollups since we now have individual transactions
DELETE FROM monthly_rollups WHERE year = 2025 AND month IN (8, 9, 10, 11, 12);
