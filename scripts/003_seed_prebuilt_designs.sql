-- Insert some prebuilt design templates
INSERT INTO public.designs (name, description, category, is_prebuilt, thumbnail_url, design_data)
VALUES
  (
    'Minimalist Logo',
    'Clean and simple logo design perfect for any product',
    'logos',
    true,
    '/placeholder.svg?height=200&width=200',
    '{"type": "template", "elements": [{"type": "text", "content": "Your Logo", "style": "minimalist"}]}'::jsonb
  ),
  (
    'Vintage Typography',
    'Retro-style typography design with classic appeal',
    'typography',
    true,
    '/placeholder.svg?height=200&width=200',
    '{"type": "template", "elements": [{"type": "text", "content": "Vintage Text", "style": "retro"}]}'::jsonb
  ),
  (
    'Abstract Pattern',
    'Modern abstract pattern for contemporary products',
    'patterns',
    true,
    '/placeholder.svg?height=200&width=200',
    '{"type": "template", "elements": [{"type": "pattern", "style": "abstract"}]}'::jsonb
  ),
  (
    'Nature Inspired',
    'Organic designs inspired by nature elements',
    'nature',
    true,
    '/placeholder.svg?height=200&width=200',
    '{"type": "template", "elements": [{"type": "illustration", "theme": "nature"}]}'::jsonb
  ),
  (
    'Geometric Shapes',
    'Bold geometric shapes for modern aesthetics',
    'geometric',
    true,
    '/placeholder.svg?height=200&width=200',
    '{"type": "template", "elements": [{"type": "shapes", "style": "geometric"}]}'::jsonb
  );
