# Quick Testing Guide

## Test Login Times
- **Before 8 AM**: Cashier login blocked ❌
- **8 AM - 5 PM**: Cashier can login ✅
- **Before 4:30 PM**: Logout button disabled ❌
- **4:30 PM - 5 PM**: Logout enabled ✅
- **After 5 PM**: Logout enabled ✅

## Test Cashier Flow
1. Login as Cashier (8-5 timeframe)
2. Add products to cart
3. Enter customer name (optional)
4. Set discount (0-100%)
5. Click Checkout
6. Payment modal appears
7. Enter amount received
8. Click Confirm Payment
9. Receipt displays
10. Print receipt

## Test Admin Dashboard
1. Login as Admin
2. Go to Dashboard → See all metrics
3. Go to Transactions → Search by receipt # or name
4. Go to Inventory → Check stock levels
5. Go to Products → Add new product
6. Go to Staff → View all staff

## Test Database Sync
1. Add transaction as cashier
2. Logout and login as admin
3. Check Transactions tab
4. Transaction should appear! ✅

## Demo Credentials
- **Cashier**: cashier123
- **Admin**: admin123
