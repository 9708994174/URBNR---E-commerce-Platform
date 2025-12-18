# Fix Product Reviews Foreign Key Relationship

## Problem
You're getting the error: "Could not find a relationship between 'product_reviews' and 'profiles'"

## Solution

### Option 1: Fix the Foreign Key Relationship (Recommended)

Run this SQL script in your Supabase SQL Editor:

**File:** `scripts/023_fix_product_reviews_foreign_key.sql`

This script will:
1. Drop and recreate the foreign key constraint with explicit naming
2. Ensure Supabase PostgREST recognizes the relationship
3. Grant necessary permissions

### Option 2: Use Simple Query (Already Implemented)

The code has been updated with a fallback mechanism that:
- First tries to use the relationship query
- If that fails, fetches reviews and profiles separately
- Merges them together automatically

This means reviews should work even if the relationship isn't recognized.

## Quick Fix Steps

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** the entire contents of `scripts/023_fix_product_reviews_foreign_key.sql`
3. **Click "Run"**
4. **Refresh your application**

## Verify It's Working

After running the SQL script, you can verify the relationship exists by running:

```sql
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'product_reviews'
  AND kcu.column_name = 'user_id';
```

You should see a row with `product_reviews_user_id_fkey` constraint.

## What Changed in the Code

The `components/product-reviews.tsx` file now:
- Tries to use the relationship query first
- Falls back to separate queries if relationship isn't found
- Automatically merges profile data with reviews
- Works in both scenarios

## Still Having Issues?

If you're still getting errors:
1. Make sure the `product_reviews` table exists
2. Make sure the `profiles` table exists
3. Check that `user_id` column in `product_reviews` references `profiles.id`
4. Verify RLS policies allow reading profiles (they should by default)

The fallback code should handle most cases automatically, so reviews should work even without running the SQL script.


