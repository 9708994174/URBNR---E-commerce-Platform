-- Update design templates with actual thumbnail images
-- Fixed PostgreSQL syntax - using subquery instead of LIMIT in UPDATE

UPDATE designs 
SET thumbnail_url = '/designs/geometric-abstract-template.jpg' 
WHERE id IN (
  SELECT id FROM designs 
  WHERE is_prebuilt = true AND category = 'geometric' 
  LIMIT 3
);

UPDATE designs 
SET thumbnail_url = '/designs/typography-bold-template.jpg' 
WHERE id IN (
  SELECT id FROM designs 
  WHERE is_prebuilt = true AND category = 'typography' 
  LIMIT 3
);

UPDATE designs 
SET thumbnail_url = '/designs/nature-mountain-template.jpg' 
WHERE id IN (
  SELECT id FROM designs 
  WHERE is_prebuilt = true AND category = 'nature' 
  LIMIT 3
);
