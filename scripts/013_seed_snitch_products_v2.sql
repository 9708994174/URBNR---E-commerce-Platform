-- Clear existing products and add Snitch menswear collection
TRUNCATE public.catalog_products CASCADE;

-- Insert Snitch menswear products with real images
INSERT INTO public.catalog_products (name, description, category, price, stock_quantity, image_url, sizes, colors, is_featured) VALUES
  -- Shirts
  ('Linen Blend Plaid Plus Size Shirt', 'Premium linen blend shirt with classic plaid pattern. Lightweight and breathable.', 'shirt', 1899.00, 50, '/images/screenshot-202025-12-15-20115750.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Beige', 'Blue'], true),
  ('Linen Blend Stripes Plus Size Shirt', 'Elegant striped shirt in breathable linen blend fabric. Perfect for summer.', 'shirt', 1899.00, 45, '/images/screenshot-202025-12-15-20115750.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'Black', 'Beige'], true),
  ('Floral Slim Fit Luxe Shirt', 'Contemporary floral print shirt with slim fit tailoring.', 'shirt', 1699.00, 40, '/images/screenshot-202025-12-15-20115750.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Purple', 'Navy', 'Black'], true),
  ('Linen Look Mandarin Shirt', 'Modern mandarin collar shirt in linen-look fabric.', 'shirt', 1199.00, 55, '/images/screenshot-202025-12-15-20115750.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Teal', 'White', 'Black'], false),
  ('Light Flannel Slim Fit Checks Shirt', 'Soft flannel shirt with classic check pattern and slim fit.', 'shirt', 999.00, 60, '/images/screenshot-202025-12-15-20115649.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Grey', 'Blue', 'Red'], true),
  ('Light Weight Flannel Plaid Slim Fit Shirt', 'Versatile plaid flannel perfect for layering.', 'shirt', 999.00, 65, '/images/screenshot-202025-12-15-20115649.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Brown', 'Green', 'Navy'], false),
  
  -- T-Shirts
  ('Pixel Heart Embroidered T-Shirt', 'Trendy t-shirt with pixel heart embroidery detail.', 'tshirt', 999.00, 100, '/images/screenshot-202025-12-15-20115649.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Black', 'Grey'], true),
  ('Core Lab Essential Tee', 'Premium cotton essential t-shirt from Core Lab collection.', 'tshirt', 799.00, 120, '/images/tshirt-core.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Maroon', 'Black', 'White', 'Navy'], true),
  ('Oversized Graphic Tee', 'Contemporary oversized fit with bold graphics.', 'tshirt', 899.00, 90, '/images/tshirt-graphic.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Green'], false),
  
  -- Jeans
  ('Stretch Bootcut Jeans', 'Modern bootcut jeans with stretch for comfort.', 'jeans', 1899.00, 60, '/images/screenshot-202025-12-15-20115649.png', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Black'], true),
  ('Slim Fit Dark Wash Jeans', 'Classic slim fit jeans in dark indigo wash.', 'jeans', 2199.00, 70, '/images/jeans-slim.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Black'], true),
  ('Relaxed Fit Comfort Jeans', 'Relaxed fit jeans for all-day comfort.', 'jeans', 1999.00, 65, '/images/jeans-relaxed.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Light Blue', 'Medium Blue', 'Black'], false),
  
  -- Trousers
  ('Stretch Relaxed Fit Trousers', 'Comfortable relaxed fit trousers with stretch fabric.', 'trousers', 1899.00, 80, '/images/screenshot-202025-12-15-20115710.png', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Black', 'Khaki', 'Grey', 'Olive'], true),
  ('Formal Pleated Trousers', 'Tailored trousers with pleated front for formal occasions.', 'trousers', 2299.00, 55, '/images/trousers-formal.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Black', 'Navy', 'Charcoal'], false),
  
  -- Jackets
  ('Snap Button Suede Stretch Jacket', 'Luxe suede jacket with snap button closure.', 'jackets', 3099.00, 30, '/images/screenshot-202025-12-15-20115649.png', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Tan', 'Brown', 'Black'], true),
  ('Denim Trucker Jacket', 'Classic trucker jacket in premium denim.', 'jackets', 2799.00, 40, '/images/jacket-denim.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Blue', 'Black'], true),
  
  -- Winterwear
  ('Wool Blend Crew Neck Sweater', 'Cozy crew neck sweater in soft wool blend.', 'winterwear', 2499.00, 50, '/images/sweater-crew.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Burgundy', 'Navy', 'Grey', 'Black'], true),
  ('Hooded Puffer Jacket', 'Warm puffer jacket with detachable hood.', 'winterwear', 4999.00, 35, '/images/jacket-puffer.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Olive'], true),
  
  -- Polos
  ('Classic Pique Polo', 'Timeless polo shirt in breathable pique cotton.', 'polos', 1299.00, 80, '/images/polo-classic.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Green'], true),
  
  -- Sweatshirts
  ('Color Block Sweatshirt', 'Trendy color block design sweatshirt.', 'sweatshirts', 1899.00, 70, '/images/sweatshirt-colorblock.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Grey/Black', 'Navy/White'], false),
  
  -- Shorts
  ('Cargo Shorts', 'Utility-inspired cargo shorts with multiple pockets.', 'shorts', 1499.00, 75, '/images/shorts-cargo.jpg', ARRAY['28', '30', '32', '34', '36'], ARRAY['Khaki', 'Olive', 'Black'], false);
