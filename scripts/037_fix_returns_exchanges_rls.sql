-- ============================================
-- FIX RLS POLICIES FOR RETURNS AND EXCHANGES
-- ============================================
-- This ensures users can properly insert return/exchange requests

-- Step 1: Verify tables exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_returns') THEN
    RAISE EXCEPTION 'order_returns table does not exist. Please run scripts/029_add_orders_shipping_returns.sql first.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_exchanges') THEN
    RAISE EXCEPTION 'order_exchanges table does not exist. Please run scripts/029_add_orders_shipping_returns.sql first.';
  END IF;
END $$;

-- Step 2: Drop existing policies if they exist (to recreate them properly)
DROP POLICY IF EXISTS "Users can create their own returns" ON public.order_returns;
DROP POLICY IF EXISTS "Users can create their own exchanges" ON public.order_exchanges;

-- Step 3: Create INSERT policies for returns
CREATE POLICY "Users can create their own returns" ON public.order_returns
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_returns.order_id AND orders.user_id = auth.uid()
    )
  );

-- Step 4: Create INSERT policies for exchanges
CREATE POLICY "Users can create their own exchanges" ON public.order_exchanges
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_exchanges.order_id AND orders.user_id = auth.uid()
    )
  );

-- Step 5: Ensure RLS is enabled
ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_exchanges ENABLE ROW LEVEL SECURITY;

-- Step 6: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.order_returns TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.order_exchanges TO authenticated;

-- Step 7: Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('order_returns', 'order_exchanges')
ORDER BY tablename, policyname;

SELECT 'Returns and exchanges RLS policies fixed successfully!' as result;


