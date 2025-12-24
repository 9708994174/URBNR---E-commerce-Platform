-- Update catalog products with real image URLs from public folder

-- T-Shirts
UPDATE catalog_products SET image_url = '/products/puma-tshirt-classic.jpg' WHERE name = 'Classic Cotton Tee';
UPDATE catalog_products SET image_url = '/products/puma-tshirt-performance.jpg' WHERE name = 'Performance Training Tee';
UPDATE catalog_products SET image_url = '/products/puma-tshirt-graphic.jpg' WHERE name = 'Graphic Logo Tee';
UPDATE catalog_products SET image_url = '/products/puma-tshirt-classic.jpg' WHERE name = 'Essential V-Neck Tee';
UPDATE catalog_products SET image_url = '/products/puma-tshirt-performance.jpg' WHERE name = 'DryCELL Athletic Tee';

-- Shoes
UPDATE catalog_products SET image_url = '/products/puma-shoes-suede.jpg' WHERE name = 'Suede Classic XXI';
UPDATE catalog_products SET image_url = '/products/puma-rs-x-running-shoes-red-and-black.jpg' WHERE name = 'RS-X Reinvention';
UPDATE catalog_products SET image_url = '/products/puma-shoes-running.jpg' WHERE name = 'Velocity Nitro 2';
UPDATE catalog_products SET image_url = '/products/puma-shoes-casual.jpg' WHERE name = 'Cali Court Classic';
UPDATE catalog_products SET image_url = '/products/puma-shoes-suede.jpg' WHERE name = 'Clyde All-Pro';

-- Jeans
UPDATE catalog_products SET image_url = '/products/puma-jeans-denim.jpg' WHERE name = 'Athletic Fit Denim';
UPDATE catalog_products SET image_url = '/products/puma-jeans-casual.jpg' WHERE name = 'Stretch Comfort Jeans';
UPDATE catalog_products SET image_url = '/products/puma-jeans-denim.jpg' WHERE name = 'Classic Straight Jeans';
UPDATE catalog_products SET image_url = '/products/puma-jeans-casual.jpg' WHERE name = 'Tapered Fit Denim';
UPDATE catalog_products SET image_url = '/products/puma-jeans-denim.jpg' WHERE name = 'Premium Selvedge Jeans';
