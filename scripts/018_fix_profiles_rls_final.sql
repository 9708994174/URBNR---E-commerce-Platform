-- Drop the incorrect RLS policy that queries auth.users directly
DROP POLICY IF EXISTS "Users can insert their own profile with email check" ON public.profiles;

-- Recreate the correct INSERT policy that only checks auth.uid()
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Make sure all other policies are correct (these should already exist)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
