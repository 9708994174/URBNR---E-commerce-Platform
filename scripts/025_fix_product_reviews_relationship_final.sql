-- ============================================
-- FINAL FIX FOR PRODUCT REVIEWS RELATIONSHIP
-- This script fixes the "Could not find a relationship" error
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;

ALTER TABLE IF EXISTS public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;

-- Step 3: Add foreign key constraints with explicit names
ALTER TABLE public.product_reviews
ADD CONSTRAINT product_reviews_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.catalog_products(id) 
ON DELETE CASCADE;

ALTER TABLE public.product_reviews
ADD CONSTRAINT product_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS product_reviews_user_id_idx ON public.product_reviews (user_id);
CREATE INDEX IF NOT EXISTS product_reviews_created_at_idx ON public.product_reviews (created_at DESC);

-- Step 5: Enable Row Level Security
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.product_reviews;

-- Step 7: Create RLS policies
CREATE POLICY "Anyone can read reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own reviews" 
  ON public.product_reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own reviews" 
  ON public.product_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
  ON public.product_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.catalog_products TO anon, authenticated;

-- Step 9: Refresh PostgREST schema cache
-- This is done automatically, but we can verify the relationship exists
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
  AND tc.table_name = 'product_reviews';

-- Step 10: Note about PostgREST cache
-- If the relationship still doesn't work after running this script:
-- 1. Wait 1-2 minutes for PostgREST to refresh its cache
-- 2. Or restart your Supabase project (Settings > Restart)
-- 3. The code now uses manual joins, so it will work regardless

SELECT 'product_reviews relationship fixed successfully! The code uses manual joins, so it will work even if PostgREST cache needs time to refresh.' as result;

