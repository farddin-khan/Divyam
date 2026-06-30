CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  weight TEXT,
  category_id INTEGER REFERENCES categories(id),
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  ingredients TEXT,
  how_to_use TEXT,
  benefits TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "select_products" ON products FOR SELECT USING (true);
CREATE POLICY "select_cart_items" ON cart_items FOR SELECT USING (true);
CREATE POLICY "insert_cart_items" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "update_cart_items" ON cart_items FOR UPDATE USING (true);
CREATE POLICY "delete_cart_items" ON cart_items FOR DELETE USING (true);
CREATE POLICY "select_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "select_order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "select_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "insert_reviews" ON reviews FOR INSERT WITH CHECK (true);

INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Hair Care', 'hair-care', 'Natural Ayurvedic hair care products for healthy, lustrous hair', 'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Skin Care', 'skin-care', 'Gentle, effective skin care rooted in ancient Ayurvedic wisdom', 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Wellness', 'wellness', 'Holistic wellness products for mind, body and spirit', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
('Body Care', 'body-care', 'Nourishing body care products with pure Ayurvedic ingredients', 'https://images.pexels.com/photos/5240672/pexels-photo-5240672.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
('Essential Oils', 'essential-oils', 'Pure, therapeutic grade essential oils for aromatherapy', 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800', 5);

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, weight, category_id, images, featured, best_seller, new_arrival, ingredients, how_to_use, benefits, meta_title, meta_description) VALUES
('Bhringraj Hair Mask', 'bhringraj-hair-mask', 'A potent Ayurvedic hair mask featuring Bhringraj, known as the King of Herbs for hair. This deep conditioning treatment repairs damaged hair, reduces hair fall, and restores natural vitality. Blended with nourishing oils and botanical extracts.', 'Deep conditioning hair mask with Bhringraj for damaged hair repair', 29.99, 38.00, 'HBA-002', 120, '200g', 1, ARRAY['https://images.pexels.com/photos/5240676/pexels-photo-5240676.jpeg?auto=compress&cs=tinysrgb&w=800'], false, true, false, 'Bhringraj Powder, Amla Powder, Brahmi Powder, Coconut Milk Powder, Aloe Vera, Neem Extract', 'Mix with water or yogurt to form a paste. Apply to scalp and hair. Leave for 30-45 minutes. Rinse with normal water. Use once a week.', ARRAY['Repairs damaged hair','Reduces hair fall','Restores natural vitality','Deep conditions','Adds volume'], 'Bhringraj Hair Mask - Ayurvedic Deep Conditioner | Holy Basil Ayurveda', 'Revitalize your hair with our Bhringraj Hair Mask. Natural deep conditioning treatment for damaged hair.'),

('Vitamin C Face Serum', 'vitamin-c-face-serum', 'A brightening facial serum powered by 15% Vitamin C and Vitamin E to enhance radiance, even skin tone, and reduce dark spots. Infused with hyaluronic acid and botanical extracts for hydration and glow.', 'Brighten skin with vitamin C and hyaluronic acid serum', 45.99, 55.00, 'HBA-003', 85, '30ml', 2, ARRAY['https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800'], true, true, true, 'Vitamin C, Vitamin E, Ferulic Acid, Hyaluronic Acid, Aloe Vera, Botanical Extracts', 'Apply 3-4 drops to cleansed face and neck each morning. Gently massage until absorbed. Use daily for best brightening results.', ARRAY['Brightens complexion','Reduces dark spots','Boosts radiance','Hydrates skin','Improves texture'], 'Vitamin C Face Serum - Radiance & Glow | Divyam Ayurveda', 'Experience glowing skin with our Vitamin C Face Serum. High potency antioxidant serum for bright, even-toned skin.'),

('Neem & Tulsi Face Wash', 'neem-tulsi-face-wash', 'A purifying face wash combining the antibacterial power of Neem with the sacred Tulsi (Holy Basil). This gentle yet effective cleanser removes impurities, controls acne, and balances skin without stripping natural oils.', 'Purify skin with Neem and Tulsi antibacterial face wash', 18.99, 24.00, 'HBA-004', 200, '150ml', 2, ARRAY['https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800'], false, true, false, 'Neem Extract, Tulsi Extract, Aloe Vera, Tea Tree Oil, Glycerin, Natural Surfactants', 'Wet face. Apply small amount and massage gently. Rinse thoroughly. Use morning and evening.', ARRAY['Controls acne','Removes impurities','Balances skin pH','Antibacterial protection','Gentle cleansing'], 'Neem & Tulsi Face Wash - Natural Acne Cleanser | Holy Basil Ayurveda', 'Cleanse and purify with our Neem & Tulsi Face Wash. Natural antibacterial formula for clear skin.'),

('Ashwagandha Capsules', 'ashwagandha-capsules', 'Premium Ashwagandha capsules formulated to support stress relief, stamina, and overall vitality. Each capsule contains pure Ashwagandha extract and is designed for daily wellness support.', 'Strengthen mind and body with premium Ashwagandha capsules', 34.99, 42.00, 'HBA-005', 120, '120 capsules', 3, ARRAY['https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'], true, true, true, 'Ashwagandha Root Extract, Vegetable Cellulose Capsule, Rice Extract', 'Take 1-2 capsules daily with warm milk or water after meals. Best taken in the evening for relaxation and restorative benefits.', ARRAY['Reduces stress & anxiety','Boosts immunity','Enhances vitality','Supports restful sleep','Improves mental clarity'], 'Ashwagandha Capsules - Daily Stress Relief | Divyam Ayurveda', 'Buy our Ashwagandha Capsules for daily stress relief and holistic wellness. Pure Ayurvedic formula for balance and vitality.'),

('Triphala Digestive Support', 'triphala-digestive-support', 'A traditional Ayurvedic formulation of three fruits: Amalaki, Bibhitaki, and Haritaki. This gentle detoxifier supports digestive health, promotes regularity, and aids natural cleansing. Made from sustainably sourced ingredients.', 'Natural digestive support with traditional Triphala formula', 22.99, 28.00, 'HBA-006', 180, '120 capsules', 3, ARRAY['https://images.pexels.com/photos/5240672/pexels-photo-5240672.jpeg?auto=compress&cs=tinysrgb&w=800'], false, false, true, 'Amalaki (Emblica Officinalis), Bibhitaki (Terminalia Bellirica), Haritaki (Terminalia Chebula)', 'Take 2 capsules daily with warm water, preferably before bed. For enhanced benefits, take on an empty stomach.', ARRAY['Supports digestion','Promotes regularity','Natural detoxifier','Rich in antioxidants','Gentle cleansing'], 'Triphala Capsules - Ayurvedic Digestive Health | Holy Basil Ayurveda', 'Support your digestion naturally with Triphala. Ancient three-fruit formula for gut health.'),

('Sandalwood Body Lotion', 'sandalwood-body-lotion', 'Luxurious body lotion infused with pure Sandalwood oil and Shea Butter. This rich, non-greasy formula deeply moisturizes skin while the calming aroma of sandalwood soothes the senses. Perfect for daily use.', 'Deeply moisturize with sandalwood-infused body lotion', 27.99, 35.00, 'HBA-007', 130, '250ml', 4, ARRAY['https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800'], true, false, false, 'Shea Butter, Coconut Oil, Sandalwood Oil, Aloe Vera, Vitamin E, Jojoba Oil', 'Apply to clean, damp skin after bathing. Massage until absorbed. Use daily for soft, supple skin.', ARRAY['Deep moisturization','Soothes dry skin','Calming aroma','Non-greasy formula','Improves skin elasticity'], 'Sandalwood Body Lotion - Natural Moisturizer | Holy Basil Ayurveda', 'Nourish your skin with our Sandalwood Body Lotion. Rich, natural hydration with calming aroma.'),

('Turmeric Body Scrub', 'turmeric-body-scrub', 'An invigorating body scrub with Turmeric, Sugar, and nourishing oils. Gently exfoliates dead skin cells, brightens skin tone, and leaves skin silky smooth. The warm, earthy scent uplifts the mood.', 'Exfoliate and brighten with turmeric sugar body scrub', 21.99, 28.00, 'HBA-008', 95, '200g', 4, ARRAY['https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=800'], false, true, true, 'Turmeric Powder, Organic Sugar, Coconut Oil, Sweet Almond Oil, Vitamin E, Essential Oils', 'Apply to wet skin in circular motions. Focus on rough areas. Rinse thoroughly. Use 2-3 times per week.', ARRAY['Gentle exfoliation','Brightens skin tone','Removes dead skin','Nourishes deeply','Uplifting aroma'], 'Turmeric Body Scrub - Natural Exfoliator | Holy Basil Ayurveda', 'Reveal radiant skin with our Turmeric Body Scrub. Natural exfoliation with Ayurvedic ingredients.'),

('Lavender Essential Oil', 'lavender-essential-oil', 'Pure, therapeutic-grade Lavender essential oil steam-distilled from lavender flowers grown in the pristine valleys of Kashmir. Known for its calming and soothing properties, perfect for aromatherapy, massage, and skincare.', 'Calm and relax with pure lavender essential oil', 19.99, 26.00, 'HBA-009', 250, '15ml', 5, ARRAY['https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800'], true, true, false, '100% Pure Lavender Essential Oil (Lavandula Angustifolia)', 'For aromatherapy: Add 3-5 drops to diffuser. For massage: Dilute with carrier oil. For bath: Add 5-8 drops to warm bath water.', ARRAY['Promotes relaxation','Improves sleep quality','Soothes skin irritations','Relieves stress','Natural fragrance'], 'Lavender Essential Oil - Pure Therapeutic Grade | Holy Basil Ayurveda', 'Buy pure Lavender essential oil for aromatherapy and relaxation. Therapeutic grade, steam distilled.'),

('Rose Essential Oil', 'rose-essential-oil', 'Exquisite Rose essential oil extracted through careful steam distillation of Damascus rose petals. This precious oil hydrates, tones, and rejuvenates skin while its divine fragrance uplifts the spirit and balances emotions.', 'Hydrate and rejuvenate with precious rose essential oil', 39.99, 50.00, 'HBA-010', 60, '10ml', 5, ARRAY['https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800'], false, false, true, '100% Pure Rose Essential Oil (Rosa Damascena)', 'For skincare: Dilute 1-2 drops with carrier oil and apply. For aromatherapy: Use in diffuser. For bath: Add 3-4 drops.', ARRAY['Hydrates and tones skin','Uplifts mood','Balances emotions','Anti-aging benefits','Luxurious natural fragrance'], 'Rose Essential Oil - Pure Damascus Rose | Holy Basil Ayurveda', 'Experience luxury with our pure Rose essential oil. Hydrating, toning, and emotionally balancing.');

INSERT INTO reviews (product_id, customer_name, rating, review_text, verified_purchase) VALUES
(3, 'Anita D.', 5, 'The Vitamin C Face Serum is absolutely magical. My skin has never looked better. The glow is real!', true),
(3, 'Lisa T.', 5, 'Worth every penny. My dark spots have faded and my complexion is so much brighter.', true),
(5, 'Michael B.', 5, 'These Ashwagandha Capsules have helped me manage stress so much better. Sleep quality improved within a week.', true),
(7, 'Emma W.', 4, 'Lovely lotion, absorbs quickly and the sandalwood scent is so calming. Great for daily use.', true),
(9, 'Rachel G.', 5, 'This lavender oil is incredibly pure. I use it in my diffuser every night. Best sleep ever!', true);