-- ============================================
-- FIX PRODUCT REVIEWS FOREIGN KEY RELATIONSHIP
-- This script ensures Supabase recognizes the relationship
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Drop and recreate the foreign key constraint to ensure it's properly recognized
ALTER TABLE IF EXISTS public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;

-- Step 2: Recreate the foreign key with explicit naming
ALTER TABLE public.product_reviews
ADD CONSTRAINT product_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Step 3: Verify the foreign key exists
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

-- Step 4: Grant necessary permissions for the relationship
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- Done! The foreign key relationship should now be recognized by Supabase
SELECT 'Foreign key relationship fixed successfully!' as result;



