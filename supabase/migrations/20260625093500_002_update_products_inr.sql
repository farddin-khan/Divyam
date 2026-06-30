-- Add currency column
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

-- Update categories
UPDATE categories SET name = 'Men''s Wellness', slug = 'mens-wellness', description = 'Premium Ayurvedic supplements for men''s health and vitality' WHERE id = 3;
UPDATE categories SET name = 'Women''s Wellness', slug = 'womens-wellness', description = 'Natural Ayurvedic products for women''s health and beauty' WHERE id = 2;

-- Delete Amla Hair Oil (id=1) and Sandalwood Body Lotion (id=7)
DELETE FROM reviews WHERE product_id IN (1, 7);
DELETE FROM cart_items WHERE product_id IN (1, 7);
DELETE FROM order_items WHERE product_id IN (1, 7);
DELETE FROM products WHERE id IN (1, 7);

-- Update remaining products with INR prices
UPDATE products SET price = 899, compare_price = 1299, currency = 'INR' WHERE id = 2;
UPDATE products SET price = 1499, compare_price = 1999, currency = 'INR' WHERE id = 3;
UPDATE products SET price = 349, compare_price = 499, currency = 'INR' WHERE id = 4;
UPDATE products SET price = 649, compare_price = 899, currency = 'INR' WHERE id = 5;
UPDATE products SET price = 499, compare_price = 699, currency = 'INR' WHERE id = 6;
UPDATE products SET price = 399, compare_price = 599, currency = 'INR' WHERE id = 8;
UPDATE products SET price = 449, compare_price = 649, currency = 'INR' WHERE id = 9;
UPDATE products SET price = 799, compare_price = 1099, currency = 'INR' WHERE id = 10;

-- Add TestraStone Booster
INSERT INTO products (name, slug, description, short_description, price, compare_price, currency, sku, stock_quantity, weight, category_id, images, featured, best_seller, new_arrival, ingredients, how_to_use, benefits, meta_title, meta_description) VALUES
('TestraStone Booster', 'testrastone-booster', 
'TestraStone Booster is a premium Ayurvedic formulation designed to naturally support strength, stamina, and overall men''s vitality. Crafted with a powerful blend of Shilajit, Ashwagandha, Safed Musli, and Kaunch Beej, this supplement helps boost testosterone levels naturally, enhance energy, and improve daily performance. Each capsule is packed with pure herbal extracts, free from harmful chemicals and additives.',
'Natural strength & performance support with Shilajit, Ashwagandha & Safed Musli',
1299, 1899, 'INR', 'DA-TSB-001', 500, '60 Capsules', 3, 
ARRAY['/images/products/TestraStone.jpeg','/images/products/Dsign.jpeg'], 
true, true, false,
'Shilajit Extract (500mg), Ashwagandha Root Extract (300mg), Safed Musli Extract (200mg), Kaunch Beej Extract (150mg), Gokshura Extract (100mg), Vidarikand Extract (100mg), Akarkara Extract (50mg), Jaiphal Extract (50mg)',
'Take 1 capsule twice daily with milk or water after meals. For best results, use consistently for 3 months along with regular exercise and a balanced diet.',
ARRAY['Supports natural testosterone production','Enhances strength & stamina','Boosts energy & vitality','Improves muscle recovery','Supports immunity & wellness','Pure herbal formula, no chemicals'],
'TestraStone Booster - Natural Testosterone Support | Divyam Ayurvedha',
'Buy TestraStone Booster - premium Ayurvedic supplement for men with Shilajit, Ashwagandha & Safed Musli. Natural strength & performance support.');

-- Add D-Sign Vitality Capsules
INSERT INTO products (name, slug, description, short_description, price, compare_price, currency, sku, stock_quantity, weight, category_id, images, featured, best_seller, new_arrival, ingredients, how_to_use, benefits, meta_title, meta_description) VALUES
('D-Sign Vitality Capsules', 'd-sign-vitality', 
'D-Sign Vitality Capsules are a scientifically formulated Ayurvedic blend for men seeking enhanced vigor, vitality, and overall wellness. Enriched with potent herbs like Shilajit, Ashwagandha, Safed Musli, and Gokshura, these capsules help improve stamina, boost energy levels, and support reproductive health. Made with 100% natural ingredients, free from chemicals and preservatives.',
'Enhance vigor & vitality with Shilajit, Ashwagandha & Safed Musli',
999, 1499, 'INR', 'DA-DSV-002', 350, '60 Capsules', 3, 
ARRAY['/images/products/Dsign.jpeg','/images/products/TestraStone.jpeg'], 
true, true, true,
'Shilajit (Asphaltum) 400mg, Ashwagandha (Withania Somnifera) 300mg, Safed Musli (Chlorophytum Borivilianum) 250mg, Gokshura (Tribulus Terrestris) 200mg, Kaunch Beej (Mucuna Pruriens) 150mg, Vidarikand (Pueraria Tuberosa) 100mg, Akarkara (Anacyclus Pyrethrum) 50mg',
'Take 1 capsule twice daily with warm milk or water after meals. Continue for at least 2-3 months for optimal results.',
ARRAY['Enhances vigor & vitality','Supports reproductive health','Boosts energy & stamina','Improves muscle strength','Supports immune function','100% natural & safe'],
'D-Sign Vitality Capsules - Men''s Wellness Supplement | Divyam Ayurvedha',
'Buy D-Sign Vitality Capsules for enhanced vigor and vitality. Pure Ayurvedic formula with Shilajit, Ashwagandha & Safed Musli.');

-- Add reviews for new products
INSERT INTO reviews (product_id, customer_name, rating, review_text, verified_purchase) VALUES
((SELECT id FROM products WHERE slug = 'testrastone-booster'), 'Rahul S.', 5, 'Amazing results! My energy levels have significantly improved after just 3 weeks. Feeling much more active and confident. Highly recommend TestraStone!', true),
((SELECT id FROM products WHERE slug = 'testrastone-booster'), 'Vikram K.', 5, 'Best Ayurvedic supplement I have tried. The quality is top-notch and the results are visible. Will definitely buy again.', true),
((SELECT id FROM products WHERE slug = 'testrastone-booster'), 'Amit P.', 4, 'Good product. Took about a month to see noticeable changes. Patience is key with Ayurvedic supplements.', true),
((SELECT id FROM products WHERE slug = 'd-sign-vitality'), 'Sanjay M.', 5, 'D-Sign Vitality has changed my life. Better stamina, more energy, and overall improved wellness. Divyam Ayurvedha products are genuinely effective.', true),
((SELECT id FROM products WHERE slug = 'd-sign-vitality'), 'Rajesh T.', 5, 'Very impressed with the quality. Pure ingredients and no side effects. My daily performance has improved significantly.', true);