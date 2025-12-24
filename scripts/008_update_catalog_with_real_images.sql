-- Update catalog products with real product images
UPDATE catalog_products SET image_url = '/products/classic-black-tshirt.jpg' 
WHERE name = 'Classic Cotton Tee' AND category = 'tshirt';

UPDATE catalog_products SET image_url = '/products/performance-red-tshirt.jpg' 
WHERE name = 'Performance Training Tee' AND category = 'tshirt';

UPDATE catalog_products SET image_url = '/products/graphic-white-tshirt.jpg' 
WHERE name = 'Graphic Street Tee' AND category = 'tshirt';

UPDATE catalog_products SET image_url = '/products/running-shoes-black.jpg' 
WHERE name = 'Runner Suede Classic' AND category = 'shoes';

UPDATE catalog_products SET image_url = '/products/running-shoes-red.jpg' 
WHERE name = 'RS-X Performance' AND category = 'shoes';

UPDATE catalog_products SET image_url = '/products/casual-sneakers-white.jpg' 
WHERE name = 'Court Classic Sneaker' AND category = 'shoes';

UPDATE catalog_products SET image_url = '/products/slim-fit-jeans-blue.jpg' 
WHERE name = 'Slim Fit Denim' AND category = 'jeans';

UPDATE catalog_products SET image_url = '/products/straight-jeans-black.jpg' 
WHERE name = 'Straight Leg Jeans' AND category = 'jeans';

UPDATE catalog_products SET image_url = '/products/distressed-jeans-light.jpg' 
WHERE name = 'Distressed Classic Jeans' AND category = 'jeans';
