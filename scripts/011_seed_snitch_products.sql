-- Clear existing catalog products and add Snitch menswear collection
DELETE FROM public.catalog_products;

-- Insert Snitch menswear products
INSERT INTO public.catalog_products (name, description, category, price, stock_quantity, image_url, sizes, colors, is_featured) VALUES
  -- Featured Shirts
  ('Solid Oxford Shirt', 'Premium cotton oxford shirt with button-down collar. Perfect for smart-casual looks.', 'shirt', 1499.00, 50, '/images/attachments-gen-images-public-stylish-man-in-premium-menswear-urban-setting.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Blue', 'Black', 'Pink'], true),
  ('Striped Casual Shirt', 'Contemporary striped shirt in breathable fabric. Ideal for everyday wear.', 'shirt', 1299.00, 45, '/images/attachments-gen-images-public-stylish-man-in-premium-menswear-urban-setting.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'Grey', 'Burgundy'], true),
  ('Denim Chambray Shirt', 'Lightweight chambray shirt with vintage wash. A wardrobe essential.', 'shirt', 1599.00, 40, '/images/attachments-gen-images-public-stylish-shirt-on-model-menswear.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Light Blue', 'Dark Blue', 'Black'], true),
  
  -- T-Shirts
  ('Premium Cotton Crew Neck', 'Soft combed cotton t-shirt with regular fit. Perfect for layering.', 'tshirt', 699.00, 100, '/images/attachments-gen-images-public-trendy-t-shirt-streetwear-men.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Grey', 'Navy', 'Olive'], true),
  ('Graphic Print Tee', 'Bold graphic print t-shirt for a contemporary streetwear look.', 'tshirt', 799.00, 80, '/images/tshirt-graphic-print.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Burgundy'], true),
  ('Polo Collar T-Shirt', 'Classic polo style with ribbed collar and cuffs.', 'tshirt', 899.00, 70, '/images/men3.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'White', 'Maroon'], false),
  ('V-Neck Essential Tee', 'Versatile v-neck t-shirt in premium jersey fabric.', 'tshirt', 699.00, 90, '/images/men4.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Grey', 'Navy'], false),
  
  -- Jeans  
  ('Slim Fit Stretch Jeans', 'Modern slim fit jeans with stretch denim for all-day comfort.', 'jeans', 2499.00, 60, '/images/SlimFit.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Black', 'Grey'], true),
  ('Straight Leg Denim', 'Classic straight leg jeans in premium denim with vintage wash.', 'jeans', 2299.00, 55, '/images/StraightLeg.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Medium Blue', 'Dark Blue', 'Black'], true),
  ('Tapered Fit Jogger Jeans', 'Athletic tapered fit with jogger-style cuffs. Street-ready style.', 'jeans', 2699.00, 50, '/images/attachments-gen-images-public-premium-jeans-menswear-fashion.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Black', 'Dark Blue', 'Charcoal'], false),
  ('Distressed Slim Jeans', 'Edgy distressed jeans with contemporary slim fit.', 'jeans', 2799.00, 45, '/images/attachments-gen-images-public-premium-jeans-menswear-fashion.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Light Blue', 'Medium Blue'], false),
  
  -- Trousers
  ('Formal Slim Trousers', 'Tailored slim fit trousers for formal occasions.', 'trousers', 1999.00, 55, '/images/attachments-gen-images-public-premium-jeans-menswear-fashion.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Black', 'Navy', 'Grey', 'Khaki'], true),
  ('Chino Casual Pants', 'Comfortable chinos perfect for smart-casual looks.', 'trousers', 1799.00, 65, '/images/attachments-gen-images-public-premium-jeans-menswear-fashion.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Beige', 'Olive', 'Navy', 'Black'], false),
  
  -- Winterwear
  ('Wool Blend Overcoat', 'Premium wool blend overcoat for cold weather sophistication.', 'winterwear', 4999.00, 30, '/images/attachments-gen-images-public-winter-jacket-menswear-outerwear.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Camel', 'Grey'], true),
  ('Puffer Jacket', 'Lightweight puffer jacket with water-resistant finish.', 'winterwear', 3499.00, 40, '/images/attachments-gen-images-public-winter-jacket-menswear-outerwear.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Olive'], true),
  ('Denim Jacket', 'Classic denim jacket with modern fit and finish.', 'winterwear', 2999.00, 35, '/images/attachments-gen-images-public-winter-jacket-menswear-outerwear.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Blue', 'Black'], false),
  ('Bomber Jacket', 'Contemporary bomber jacket with ribbed cuffs and hem.', 'winterwear', 3299.00, 38, '/images/attachments-gen-images-public-winter-jacket-menswear-outerwear.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Olive'], false),
  
  -- Shoes
  ('Classic White Sneakers', 'Minimalist white sneakers for versatile styling.', 'shoes', 2999.00, 50, '/images/placeholder.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Off-White'], true),
  ('Leather Loafers', 'Premium leather loafers for formal and semi-formal occasions.', 'shoes', 3499.00, 40, '/images/placeholder.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Brown', 'Black', 'Tan'], true),
  ('High-Top Sneakers', 'Street-style high-top sneakers with padded collar.', 'shoes', 3299.00, 45, '/images/placeholder.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Navy'], false),
  ('Chelsea Boots', 'Sleek chelsea boots with elastic side panels.', 'shoes', 4499.00, 35, '/images/placeholder.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'Brown', 'Burgundy'], false);

-- Update catalog_products table to support new categories
ALTER TABLE public.catalog_products DROP CONSTRAINT IF EXISTS catalog_products_category_check;
ALTER TABLE public.catalog_products ADD CONSTRAINT catalog_products_category_check 
  CHECK (category IN ('tshirt', 'shirt', 'jeans', 'trousers', 'shoes', 'winterwear'));
