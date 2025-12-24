-- Update product images with high-quality model photography for Zylo brand

-- Update T-Shirts
UPDATE catalog_products 
SET image_url = '/images/premium-crew-neck.jpg' 
WHERE name LIKE '%Premium Cotton Crew Neck%' OR name LIKE '%Core Crew%';

UPDATE catalog_products 
SET image_url = '/images/graphic-print-tee.jpg' 
WHERE name LIKE '%Graphic Print%' OR name LIKE '%Graphic Tee%';

UPDATE catalog_products 
SET image_url = '/images/tshirt-core.jpg' 
WHERE category = 'tshirt' AND image_url IS NULL;

-- Update Jeans
UPDATE catalog_products 
SET image_url = '/images/slim-stretch-jeans.jpg' 
WHERE name LIKE '%Slim%' AND category = 'jeans';

UPDATE catalog_products 
SET image_url = '/images/relaxed-fit-jeans.jpg' 
WHERE name LIKE '%Relaxed%' AND category = 'jeans';

UPDATE catalog_products 
SET image_url = '/images/jeans-slim.jpg' 
WHERE category = 'jeans' AND name LIKE '%Fit%' AND image_url IS NULL;

-- Update Trousers
UPDATE catalog_products 
SET image_url = '/images/formal-trousers.jpg' 
WHERE name LIKE '%Formal%' AND category = 'trousers';

UPDATE catalog_products 
SET image_url = '/images/trousers-formal.jpg' 
WHERE category = 'trousers' AND image_url IS NULL;

-- Update Jackets and Outerwear
UPDATE catalog_products 
SET image_url = '/images/wool-overcoat.jpg' 
WHERE name LIKE '%Overcoat%' OR name LIKE '%Wool%';

UPDATE catalog_products 
SET image_url = '/images/puffer-jacket.jpg' 
WHERE name LIKE '%Puffer%';

UPDATE catalog_products 
SET image_url = '/images/jacket-denim.jpg' 
WHERE category = 'winterwear' AND name LIKE '%Jacket%' AND image_url IS NULL;

-- Update Shirts
UPDATE catalog_products 
SET image_url = '/images/shirt-oxford.jpg' 
WHERE name LIKE '%Oxford%';

UPDATE catalog_products 
SET image_url = '/images/shirt-striped.jpg' 
WHERE name LIKE '%Striped%';

UPDATE catalog_products 
SET image_url = '/images/shirt-chambray.jpg' 
WHERE name LIKE '%Chambray%' OR name LIKE '%Denim%';
