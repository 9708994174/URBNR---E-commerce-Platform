-- Fix incomplete RLS policy for orders INSERT
-- The original policy in 001_create_tables.sql is incomplete

-- Drop the incomplete policy if it exists
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Create proper INSERT policy for orders
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Also ensure UPDATE policy exists for orders
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

SELECT 'Orders RLS policies fixed successfully!' as result;


