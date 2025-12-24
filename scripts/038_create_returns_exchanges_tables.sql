-- ============================================
-- CREATE RETURNS AND EXCHANGES TABLES
-- ============================================
-- This script creates the order_returns and order_exchanges tables
-- if they don't already exist

-- Step 1: Create order_returns table
CREATE TABLE IF NOT EXISTS public.order_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled')),
  refund_status TEXT DEFAULT 'pending' CHECK (refund_status IN ('pending', 'processing', 'completed', 'failed')),
  refund_amount DECIMAL(10, 2),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Step 2: Create order_exchanges table
CREATE TABLE IF NOT EXISTS public.order_exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  requested_product_id UUID REFERENCES public.catalog_products(id),
  requested_size TEXT,
  requested_color TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS order_returns_order_id_idx ON public.order_returns(order_id);
CREATE INDEX IF NOT EXISTS order_returns_user_id_idx ON public.order_returns(user_id);
CREATE INDEX IF NOT EXISTS order_exchanges_order_id_idx ON public.order_exchanges(order_id);
CREATE INDEX IF NOT EXISTS order_exchanges_user_id_idx ON public.order_exchanges(user_id);

-- Step 4: Enable RLS
ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_exchanges ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies for order_returns
DROP POLICY IF EXISTS "Users can view their own returns" ON public.order_returns;
CREATE POLICY "Users can view their own returns" ON public.order_returns
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own returns" ON public.order_returns;
CREATE POLICY "Users can create their own returns" ON public.order_returns
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_returns.order_id AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all returns" ON public.order_returns;
CREATE POLICY "Admins can view all returns" ON public.order_returns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update returns" ON public.order_returns;
CREATE POLICY "Admins can update returns" ON public.order_returns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Step 6: Create RLS Policies for order_exchanges
DROP POLICY IF EXISTS "Users can view their own exchanges" ON public.order_exchanges;
CREATE POLICY "Users can view their own exchanges" ON public.order_exchanges
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own exchanges" ON public.order_exchanges;
CREATE POLICY "Users can create their own exchanges" ON public.order_exchanges
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_exchanges.order_id AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all exchanges" ON public.order_exchanges;
CREATE POLICY "Admins can view all exchanges" ON public.order_exchanges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update exchanges" ON public.order_exchanges;
CREATE POLICY "Admins can update exchanges" ON public.order_exchanges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Step 7: Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.order_returns TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.order_exchanges TO authenticated;

-- Step 8: Verify tables were created
SELECT 
  'order_returns table created: ' || EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'order_returns'
  )::text as order_returns_status,
  'order_exchanges table created: ' || EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'order_exchanges'
  )::text as order_exchanges_status;

SELECT 'Returns and exchanges tables created successfully!' as result;


