-- ============================================
-- COMPLETE PRODUCT REVIEWS FIX
-- This script ensures product_reviews table is fully functional
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop table if exists to recreate cleanly (optional - comment out if you have existing reviews)
-- DROP TABLE IF EXISTS public.product_reviews CASCADE;

-- Step 3: Create product_reviews table with all constraints
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Add foreign key constraints
-- Drop existing constraints if they exist
ALTER TABLE IF EXISTS public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;

ALTER TABLE IF EXISTS public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;

-- Add foreign key to catalog_products
ALTER TABLE public.product_reviews
ADD CONSTRAINT product_reviews_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.catalog_products(id) 
ON DELETE CASCADE;

-- Add foreign key to profiles (which references auth.users)
ALTER TABLE public.product_reviews
ADD CONSTRAINT product_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS product_reviews_user_id_idx ON public.product_reviews (user_id);
CREATE INDEX IF NOT EXISTS product_reviews_created_at_idx ON public.product_reviews (created_at DESC);

-- Step 6: Enable Row Level Security
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can insert reviews" ON public.product_reviews;

-- Step 8: Create RLS policies
-- Anyone can read reviews (public access)
CREATE POLICY "Anyone can read reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (true);

-- Users can insert their own reviews (must be authenticated and user_id must match auth.uid())
CREATE POLICY "Users can insert own reviews" 
  ON public.product_reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" 
  ON public.product_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" 
  ON public.product_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Step 9: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- Step 10: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_reviews_updated_at();

-- Step 12: Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'product_reviews'
ORDER BY ordinal_position;

-- Step 13: Verify foreign keys
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

-- Done! You should see table structure and foreign keys listed
SELECT 'product_reviews table created and configured successfully!' as result;

