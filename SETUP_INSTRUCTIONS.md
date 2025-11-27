# Owoabenes POS System - Supabase Setup Instructions

## Adding Your Supabase Credentials

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a free account or sign in
4. Create a new project (name: "owoabenes-pos")
5. Choose a region and set a strong password

### Step 2: Get Your Credentials
1. In Supabase dashboard, go to **Settings → API**
2. Copy these three values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key

### Step 3: Add Variables in v0

Click **Vars** in the left sidebar and add:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
\`\`\`

### Step 4: Create Database Tables

1. Go to Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Copy all content from `/scripts/01-create-tables.sql`
4. Paste in query editor
5. Click "Run"

This creates: products, transactions, and staff tables

### Step 5: Deploy

Click **Publish** button in v0 to deploy with Supabase!

## Testing Your Connection

After setup:
1. Login as admin (admin123)
2. Go to Products tab
3. Add a test product
4. Go to Supabase dashboard → Table Editor → "products"
5. You should see your product in the table!

## Local Development Setup

Edit `.env.local` file with your credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
\`\`\`

Then run: `npm run dev`

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure all 3 variables are added to v0 Vars
- Check spelling matches exactly
- Republish after adding variables

### Connection Refused
- Verify credentials are correct
- Check Supabase project is active
- Ensure internet connection is stable

### Tables not created
- Go to Supabase SQL Editor
- Run the SQL script from `/scripts/01-create-tables.sql`
- Check for any error messages

## Support
For help with Supabase, visit [supabase.com/docs](https://supabase.com/docs)
