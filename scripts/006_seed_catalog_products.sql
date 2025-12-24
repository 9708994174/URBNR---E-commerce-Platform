-- Seed catalog products with more detailed data
-- This adds comprehensive PUMA men's products to the catalog

DELETE FROM public.catalog_products;

INSERT INTO public.catalog_products (name, description, category, price, stock_quantity, image_url, sizes, colors, is_featured) VALUES
  -- T-Shirts (Featured)
  ('PUMA Essentials Logo Tee', 'Classic cotton t-shirt featuring the iconic PUMA logo. Made from 100% organic cotton for ultimate comfort and sustainability. Perfect for casual everyday wear.', 'tshirt', 29.99, 150, '/placeholder.svg?height=500&width=500', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Red', 'Grey'], true),
  
  ('PUMA Training Performance Tee', 'Moisture-wicking dryCELL technology keeps you cool during intense workouts. Lightweight mesh panels for enhanced breathability. Athletic fit for maximum movement.', 'tshirt', 34.99, 120, '/placeholder.svg?height=500&width=500', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Grey', 'Blue', 'Green'], true),
  
  ('PUMA Graphic Street Tee', 'Bold street-style graphics with premium screen printing. Oversized fit for modern urban fashion. Limited edition design collaboration.', 'tshirt', 39.99, 100, '/placeholder.svg?height=500&width=500', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Black', 'Cream'], false),
  
  ('PUMA Retro Archive Tee', 'Vintage PUMA branding from the 90s archives. Soft-touch fabric with distressed print effect. Classic crew neck design.', 'tshirt', 32.99, 110, '/placeholder.svg?height=500&width=500', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'Burgundy', 'Forest Green'], false),
  
  ('PUMA Tech Compression Tee', 'Form-fitting compression wear with four-way stretch. Seamless construction reduces chafing. Ideal for base layering or high-intensity training.', 'tshirt', 44.99, 80, '/placeholder.svg?height=500&width=500', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy'], false),

  -- Shoes (Featured)
  ('PUMA Suede Classic XXI', 'The legendary PUMA Suede gets a modern update. Premium suede upper with iconic formstrip. Rubber outsole for durability and traction.', 'shoes', 89.99, 80, '/placeholder.svg?height=500&width=500', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['Black', 'Navy', 'Grey', 'Olive', 'Burgundy'], true),
  
  ('PUMA RS-X³ Tech', 'Chunky silhouette with running system technology. Mixed material upper with bold color blocking. EVA midsole for superior cushioning and comfort.', 'shoes', 119.99, 70, '/placeholder.svg?height=500&width=500', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['White/Blue/Red', 'Black/Yellow', 'Grey/Green'], true),
  
  ('PUMA Future Rider Play On', 'Retro running style meets modern comfort. Federbein cushioning system for smooth ride. Mesh and leather upper construction.', 'shoes', 94.99, 90, '/placeholder.svg?height=500&width=500', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['White/Blue', 'Black/Red', 'Grey/Yellow'], false),
  
  ('PUMA Clyde All-Pro Basketball', 'Court-ready performance basketball shoe. ProFoam midsole for responsive cushioning. Durable rubber outsole with multi-directional traction.', 'shoes', 129.99, 60, '/placeholder.svg?height=500&width=500', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['Red/White', 'Black/Gold', 'White/Navy'], false),
  
  ('PUMA Velocity NITRO 2', 'Advanced running shoe with NITRO foam technology. Lightweight breathable mesh engineered for speed. PUMAGRIP outsole for confident footing.', 'shoes', 139.99, 65, '/placeholder.svg?height=500&width=500', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['Blue/Yellow', 'Black/White', 'Grey/Orange'], true),

  -- Jeans (Featured)
  ('PUMA x AMI Paris Slim Jeans', 'Premium collaboration denim with AMI Paris branding. Slim tapered fit with stretch comfort. Dark indigo wash with subtle distressing.', 'jeans', 99.99, 75, '/placeholder.svg?height=500&width=500', ARRAY['28', '30', '32', '34', '36', '38', '40'], ARRAY['Dark Indigo', 'Black', 'Light Wash'], true),
  
  ('PUMA Athletic Tapered Denim', 'Engineered for movement with 4-way stretch technology. Athletic taper from thigh to ankle. Reinforced seams for durability.', 'jeans', 84.99, 90, '/placeholder.svg?height=500&width=500', ARRAY['28', '30', '32', '34', '36', '38', '40'], ARRAY['Black', 'Dark Blue', 'Grey'], false),
  
  ('PUMA Essentials Straight Leg', 'Classic straight leg fit for timeless style. Medium weight denim with natural cotton feel. Versatile five-pocket design.', 'jeans', 74.99, 100, '/placeholder.svg?height=500&width=500', ARRAY['28', '30', '32', '34', '36', '38', '40'], ARRAY['Medium Blue', 'Dark Blue', 'Black'], false),
  
  ('PUMA Relaxed Carpenter Jeans', 'Roomy fit with utility-inspired details. Multiple pockets including hammer loop. Heavyweight denim for durability.', 'jeans', 89.99, 70, '/placeholder.svg?height=500&width=500', ARRAY['28', '30', '32', '34', '36', '38', '40'], ARRAY['Light Blue', 'Dark Blue', 'Khaki'], false),
  
  ('PUMA Performance Tech Jogger Jeans', 'Hybrid design combining denim style with jogger comfort. Elasticated cuffs and drawstring waist. Moisture-wicking treatment.', 'jeans', 94.99, 85, '/placeholder.svg?height=500&width=500', ARRAY['28', '30', '32', '34', '36', '38', '40'], ARRAY['Black', 'Charcoal', 'Navy'], false);
