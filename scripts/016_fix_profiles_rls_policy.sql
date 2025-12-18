-- Fix RLS policy for profiles to allow INSERT with email matching auth
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new policy that allows insertion when user_id matches auth.uid()
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
