-- ============================================
-- ADD PRODUCT FIT AND QUALITY COLUMNS
-- This script adds product_fit and product_quality columns
-- to the existing product_reviews table
-- ============================================

-- Add product_fit column if it doesn't exist
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS product_fit TEXT 
CHECK (product_fit IN ('Perfect', 'Loose', 'Tight', 'Too Loose', 'Too Tight') OR product_fit IS NULL);

-- Add product_quality column if it doesn't exist
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS product_quality TEXT 
CHECK (product_quality IN ('Excellent', 'Very Good', 'Average', 'Bad', 'Very Bad') OR product_quality IS NULL);

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'product_reviews'
  AND column_name IN ('product_fit', 'product_quality')
ORDER BY column_name;

SELECT 'Columns added successfully! ✅' as result;


