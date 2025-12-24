-- Update product images to match the screenshot provided by the user
UPDATE public.catalog_products
SET image_url = CASE name
  -- Row 1 products from screenshot
  WHEN 'Linen Blend Plaid Plus Size Shirt' THEN '/images/image.png'
  WHEN 'Linen Blend Stripes Plus Size Shirt' THEN '/images/screenshot-202025-12-15-20115750.png'
  WHEN 'Floral Slim Fit Luxe Shirt' THEN '/images/screenshot-202025-12-15-20115750.png'
  WHEN 'Premium Cotton Crew Neck' THEN '/images/tshirt-core.jpg'
  WHEN 'Core Lab Essential Tee' THEN '/images/tshirt-core.jpg'
  WHEN 'Oversized Graphic Tee' THEN '/images/tshirt-graphic.jpg'
  
  -- Row 2 products from screenshot
  WHEN 'Stretch Bootcut Jeans' THEN '/images/jeans-slim.jpg'
  WHEN 'Slim Fit Dark Wash Jeans' THEN '/images/jeans-slim.jpg'
  WHEN 'Relaxed Fit Comfort Jeans' THEN '/images/jeans-relaxed.jpg'
  WHEN 'Stretch Relaxed Fit Trousers' THEN '/images/trousers-formal.jpg'
  WHEN 'Formal Pleated Trousers' THEN '/images/trousers-formal.jpg'
  
  -- Winterwear products
  WHEN 'Wool Blend Crew Neck Sweater' THEN '/images/sweater-crew.jpg'
  WHEN 'Hooded Puffer Jacket' THEN '/images/jacket-puffer.jpg'
  WHEN 'Snap Button Suede Stretch Jacket' THEN '/images/jacket-denim.jpg'
  WHEN 'Denim Trucker Jacket' THEN '/images/jacket-denim.jpg'
  
  -- Other products
  WHEN 'Classic Pique Polo' THEN '/images/polo-classic.jpg'
  WHEN 'Color Block Sweatshirt' THEN '/images/sweatshirt-colorblock.jpg'
  WHEN 'Cargo Shorts' THEN '/images/shorts-cargo.jpg'
  
  ELSE image_url
END
WHERE name IN (
  'Linen Blend Plaid Plus Size Shirt',
  'Linen Blend Stripes Plus Size Shirt',
  'Floral Slim Fit Luxe Shirt',
  'Premium Cotton Crew Neck',
  'Core Lab Essential Tee',
  'Oversized Graphic Tee',
  'Stretch Bootcut Jeans',
  'Slim Fit Dark Wash Jeans',
  'Relaxed Fit Comfort Jeans',
  'Stretch Relaxed Fit Trousers',
  'Formal Pleated Trousers',
  'Wool Blend Crew Neck Sweater',
  'Hooded Puffer Jacket',
  'Snap Button Suede Stretch Jacket',
  'Denim Trucker Jacket',
  'Classic Pique Polo',
  'Color Block Sweatshirt',
  'Cargo Shorts'
);
