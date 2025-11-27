-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  brand_name VARCHAR(100),
  expiry_date DATE,
  description TEXT,
  image TEXT,
  -- Added wholesale pricing columns
  wholesale_price DECIMAL(10, 2),
  wholesale_price_with_profit DECIMAL(10, 2),
  -- Added minimum stock column
  min_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  amount_received DECIMAL(10, 2) NOT NULL,
  change DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_transactions_receipt ON transactions(receipt_number);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_staff_email ON staff(email);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - adjust based on your needs)
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON products FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON staff FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON staff FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON staff FOR DELETE USING (true);
