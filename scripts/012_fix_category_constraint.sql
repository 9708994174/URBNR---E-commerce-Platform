-- Fix category constraint to support all Snitch product categories
ALTER TABLE public.catalog_products DROP CONSTRAINT IF EXISTS catalog_products_category_check;
ALTER TABLE public.catalog_products ADD CONSTRAINT catalog_products_category_check 
  CHECK (category IN ('tshirt', 'shirt', 'jeans', 'trousers', 'shoes', 'winterwear', 'jackets', 'shorts', 'sweatshirts', 'sweaters', 'polos', 'accessories'));
