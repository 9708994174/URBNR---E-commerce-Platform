-- Add more design templates with better visuals and variety
INSERT INTO public.designs (name, description, category, is_prebuilt, thumbnail_url, design_data)
VALUES
  (
    'Athletic Performance',
    'Bold athletic design for high-performance gear',
    'sports',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "athletic", "colors": ["#000000", "#FF0000"]}]}'::jsonb
  ),
  (
    'Urban Streetwear',
    'Modern street-style graphics for contemporary fashion',
    'urban',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "urban", "style": "street"}]}'::jsonb
  ),
  (
    'Retro 90s Wave',
    'Nostalgic 90s-inspired wave patterns and colors',
    'retro',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "waves", "era": "90s"}]}'::jsonb
  ),
  (
    'Mountain Adventure',
    'Outdoor-inspired mountain and nature graphics',
    'nature',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "mountains", "style": "adventure"}]}'::jsonb
  ),
  (
    'Tech Circuit',
    'Futuristic circuit board and technology patterns',
    'tech',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "circuit", "theme": "technology"}]}'::jsonb
  ),
  (
    'Tropical Paradise',
    'Vibrant tropical leaves and summer vibes',
    'nature',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "tropical", "colors": ["#00A86B", "#FFD700"]}]}'::jsonb
  ),
  (
    'Speed Demon',
    'Fast-paced racing stripes and motion blur effects',
    'sports',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "racing", "effect": "motion"}]}'::jsonb
  ),
  (
    'Neon Glow',
    'Electric neon lights and cyberpunk aesthetics',
    'urban',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "neon", "colors": ["#FF00FF", "#00FFFF"]}]}'::jsonb
  ),
  (
    'Classic Varsity',
    'Traditional varsity letter and collegiate style',
    'classic',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "text", "content": "VARSITY", "style": "collegiate"}]}'::jsonb
  ),
  (
    'Galaxy Space',
    'Cosmic nebula and starry night patterns',
    'space',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "galaxy", "theme": "space"}]}'::jsonb
  ),
  (
    'Camouflage Pro',
    'Military-inspired camo patterns in various colors',
    'military',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "camo", "variant": "military"}]}'::jsonb
  ),
  (
    'Zen Garden',
    'Peaceful minimalist zen and meditation themes',
    'minimal',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "zen", "style": "minimal"}]}'::jsonb
  ),
  (
    'Grunge Texture',
    'Distressed and weathered grunge aesthetic',
    'grunge',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "texture", "style": "grunge", "effect": "distressed"}]}'::jsonb
  ),
  (
    'Animal Print',
    'Wild animal patterns - leopard, zebra, tiger',
    'animal',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "pattern", "style": "animal", "variant": "leopard"}]}'::jsonb
  ),
  (
    'Flame Heat',
    'Dynamic fire and flame graphics',
    'sports',
    true,
    '/placeholder.svg?height=300&width=300',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "flames", "colors": ["#FF4500", "#FFA500"]}]}'::jsonb
  );
