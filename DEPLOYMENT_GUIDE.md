# Owoabenes POS System - Deployment & Setup Guide

## 🚀 Quick Start

### 1. Setup Supabase

#### Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a free account or sign in
4. Create a new project with name "owoabenes-pos"
5. Choose a region close to you
6. Set a strong database password

### 2. Add Environment Variables

Go to v0 Sidebar → **Vars** and add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

**Where to find these:**
1. In Supabase dashboard, go to Settings → API
2. Copy the Project URL for `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the Anon Public key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy the Service Role key for `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the SQL from `/scripts/01-create-tables.sql`
4. Paste it in the query editor
5. Click "Run"

### 4. Deploy

1. Click **Publish** button (top right)
2. System will deploy with Supabase integration
3. Your POS system is now live!

## ✅ What's Connected

- **Products**: Fully synced with Supabase PostgreSQL
- **Transactions**: All sales automatically saved to database
- **Staff**: Staff data persisted in database
- **Real-time Sync**: Changes appear instantly across admin/cashier

## 📊 How It Works

1. **Cashier Terminal** → Product added to cart → Checkout → Transaction saved to Supabase
2. **Admin Dashboard** → Automatically syncs transactions from database
3. **Product Management** → Add/edit products → Saved to Supabase → Available in cashier

## 🔐 Security Notes

- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret (server-side only)
- Never expose service role key in client code
- Keep environment variables secure in v0 Vars
- RLS policies enabled for data protection

## 🛠️ Troubleshooting

### "Cannot connect to Supabase"
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify environment variables are set in v0 Vars
- Check network connectivity

### "Products not showing up"
- Refresh the page
- Check that SQL tables were created in Supabase
- Look at browser console for errors

### "Transactions not saving"
- Check API response in Network tab (F12)
- Verify all Supabase environment variables are set
- Check Supabase project status

## 📱 System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Supabase project created and configured

## 🎯 Features Active

✅ Cashier login (8 AM - 5 PM only)
✅ Product management with images
✅ Real-time inventory tracking
✅ Transaction history synced to admin
✅ Receipt printing with logo
✅ Payment confirmation system
✅ Staff management
✅ Daily sales analytics
✅ Multiple payment methods
✅ Discount system
✅ All prices in Ghana Cedis (GHS)

---

**Need Help?** Check the console (F12) for detailed error messages.
