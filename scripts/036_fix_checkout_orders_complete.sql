-- ============================================
-- COMPLETE FIX FOR CHECKOUT ORDER CREATION
-- ============================================
-- This script fixes all issues preventing order creation from cart checkout

-- Step 1: Make product_id nullable (required for catalog product orders)
ALTER TABLE public.orders 
ALTER COLUMN product_id DROP NOT NULL;

-- Step 2: Ensure RLS policies are correct for orders
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Create INSERT policy
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create UPDATE policy
CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 3: Ensure all required columns exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS catalog_product_id UUID REFERENCES public.catalog_products(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_info JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'product';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Step 4: Verify the changes
SELECT 
  'product_id is nullable: ' || (is_nullable = 'YES')::text as product_id_status,
  'catalog_product_id exists: ' || EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'catalog_product_id'
  )::text as catalog_product_id_status
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'product_id';

-- Step 5: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

SELECT 'Checkout order creation fixes applied successfully!' as result;


