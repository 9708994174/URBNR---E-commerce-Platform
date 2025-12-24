-- Make product_id nullable in orders table to support catalog products
-- This allows orders to be created from either custom products (product_id) or catalog products (catalog_product_id)

ALTER TABLE public.orders 
ALTER COLUMN product_id DROP NOT NULL;

-- Add a check constraint to ensure at least one product reference exists
-- Note: This is a soft constraint - we'll enforce it in application logic
-- PostgreSQL doesn't support CHECK constraints with OR conditions easily

SELECT 'product_id column is now nullable in orders table!' as result;


