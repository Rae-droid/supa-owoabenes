-- This migration adds the min_stock column if it doesn't exist
-- and fixes any existing schema issues

-- Add min_stock column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 0;

-- Ensure all required columns exist
ALTER TABLE staff ADD COLUMN IF NOT EXISTS join_date DATE;

-- Drop existing policies if they exist (if there are conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert access for all users" ON products;
DROP POLICY IF EXISTS "Enable update access for all users" ON products;
DROP POLICY IF EXISTS "Enable delete access for all users" ON products;

DROP POLICY IF EXISTS "Enable read access for all users" ON transactions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON transactions;

DROP POLICY IF EXISTS "Enable read access for all users" ON staff;
DROP POLICY IF EXISTS "Enable insert access for all users" ON staff;
DROP POLICY IF EXISTS "Enable update access for all users" ON staff;
DROP POLICY IF EXISTS "Enable delete access for all users" ON staff;

-- Recreate RLS policies without conflicts
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
