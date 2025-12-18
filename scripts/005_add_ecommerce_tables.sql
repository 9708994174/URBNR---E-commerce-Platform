-- Add e-commerce tables for cart, wishlist, and catalog products

-- Create catalog_products table for PUMA men's products
CREATE TABLE IF NOT EXISTS public.catalog_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('tshirt', 'shoes', 'jeans')),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  sizes TEXT[], -- Available sizes: ['S', 'M', 'L', 'XL', 'XXL'] or ['6', '7', '8', '9', '10', '11', '12']
  colors TEXT[], -- Available colors
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Update orders table to support catalog products
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS catalog_product_id UUID REFERENCES public.catalog_products(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Enable RLS
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for catalog_products (public read)
CREATE POLICY "Anyone can view catalog products" ON public.catalog_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage catalog products" ON public.catalog_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for wishlist
CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Seed some PUMA men's products
INSERT INTO public.catalog_products (name, description, category, price, stock_quantity, image_url, sizes, colors, is_featured) VALUES
  ('PUMA Classic Logo Tee', 'Comfortable cotton t-shirt with iconic PUMA logo. Perfect for everyday wear.', 'tshirt', 29.99, 100, '/products/puma-tshirt-classic.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Red'], true),
  ('PUMA Performance Training Tee', 'Moisture-wicking performance tee designed for intense workouts.', 'tshirt', 34.99, 80, '/products/puma-tshirt-performance.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Grey', 'Blue'], true),
  ('PUMA Graphic Print Tee', 'Bold graphic design for a modern streetwear look.', 'tshirt', 32.99, 90, '/products/puma-tshirt-graphic.jpg', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Green'], false),
  ('PUMA Suede Classic Sneakers', 'Iconic PUMA Suede sneakers with timeless style.', 'shoes', 89.99, 60, '/products/puma-shoes-suede.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'Navy', 'Grey', 'Olive'], true),
  ('PUMA RS-X Running Shoes', 'High-performance running shoes with excellent cushioning.', 'shoes', 119.99, 50, '/products/puma-shoes-rsx.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Blue', 'Red'], true),
  ('PUMA Future Rider Sneakers', 'Retro-inspired sneakers with modern comfort technology.', 'shoes', 94.99, 70, '/products/puma-shoes-rider.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Grey', 'Navy'], false),
  ('PUMA Essentials Slim Fit Jeans', 'Classic slim fit jeans with stretch for ultimate comfort.', 'jeans', 79.99, 75, '/products/puma-jeans-slim.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Black', 'Light Blue'], true),
  ('PUMA Athletic Tapered Jeans', 'Modern tapered fit jeans designed for active lifestyles.', 'jeans', 84.99, 65, '/products/puma-jeans-tapered.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Black'], false),
  ('PUMA Straight Leg Denim', 'Comfortable straight leg jeans for everyday wear.', 'jeans', 74.99, 85, '/products/puma-jeans-straight.jpg', ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Dark Blue', 'Light Blue', 'Black'], false);
