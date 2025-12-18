-- ============================================
-- ALLOW USERS TO UPDATE THEIR OWN ROLE
-- This script allows users to update their own role to 'admin'
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Create a function that allows users to set their own role to admin
CREATE OR REPLACE FUNCTION public.set_own_admin_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = auth.uid();
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.set_own_admin_role() TO authenticated;

-- Step 3: Update RLS policy to allow users to update their own role
-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policy that allows role updates
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 4: Alternative - Create a simpler function that just sets admin role
CREATE OR REPLACE FUNCTION public.make_me_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN 'Error: Not authenticated';
  END IF;
  
  -- Update or insert profile with admin role
  INSERT INTO public.profiles (id, email, role)
  SELECT user_id, email, 'admin'
  FROM auth.users
  WHERE id = user_id
  ON CONFLICT (id) 
  DO UPDATE SET role = 'admin';
  
  RETURN 'Success: You are now an admin!';
END;
$$;

-- Step 5: Grant execute permission
GRANT EXECUTE ON FUNCTION public.make_me_admin() TO authenticated;

-- Done! Users can now:
-- 1. Call SELECT make_me_admin(); to set themselves as admin
-- 2. Or use the web interface at /admin/setup
-- 3. Or directly update: UPDATE profiles SET role = 'admin' WHERE id = auth.uid();

SELECT 'Role update functions created successfully!' as result;

