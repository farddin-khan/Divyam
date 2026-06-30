ALTER TABLE orders
  ADD COLUMN payment_method TEXT DEFAULT 'card',
  ADD COLUMN payment_status TEXT DEFAULT 'pending',
  ADD COLUMN shiprocket_order_id TEXT,
  ADD COLUMN shiprocket_status TEXT;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "update_orders" ON orders FOR UPDATE USING (true);
