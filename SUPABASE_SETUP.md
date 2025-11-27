# Supabase Setup Guide for Owoabenes POS System

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Create a new project with any name (e.g., "owoabenes-pos")
5. Choose a region close to you
6. Set a strong database password

## Step 2: Get Your Credentials

After project is created:

1. Go to **Settings → API** in your Supabase dashboard
2. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key (keep secret!)

## Step 3: Run SQL Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the contents of `/scripts/01-create-tables.sql`
4. Click "Run"

This creates all needed tables: products, transactions, and staff.

## Step 4: Add Environment Variables

In v0:

1. Click **Vars** in the left sidebar
2. Add your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY` = Service Role Key

## Step 5: Deploy

Click **Publish** to deploy your system with Supabase!

## Testing

1. Login as admin (admin123)
2. Go to Products
3. Add a product - it should save to Supabase
4. Check Supabase dashboard → Table Editor to verify data appears

## Data Structure

- **Products**: name, category, price, quantity, brand_name, expiry_date, description, image
- **Transactions**: receipt_number, customer_name, items, subtotal, discount, total, amount_received, change, payment_method
- **Staff**: name, role, email, phone, join_date
