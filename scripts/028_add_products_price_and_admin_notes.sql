-- ============================================
-- ADD PRICE AND ADMIN_NOTES COLUMNS TO PRODUCTS TABLE
-- This script adds the missing columns needed for admin product approval
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Add price column to products table
-- This column stores the price set by admin when approving a product
ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Step 2: Add admin_notes column to products table
-- This column stores admin notes (approval notes, rejection reasons, etc.)
ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Step 3: Add comment for documentation
COMMENT ON COLUMN public.products.price IS 'Price set by admin when approving the product';
COMMENT ON COLUMN public.products.admin_notes IS 'Admin notes for approval/rejection, visible to the product owner';

-- Step 4: Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'products'
  AND column_name IN ('price', 'admin_notes')
ORDER BY column_name;

-- Done! You should see both columns listed
SELECT 'price and admin_notes columns added successfully to products table!' as result;

