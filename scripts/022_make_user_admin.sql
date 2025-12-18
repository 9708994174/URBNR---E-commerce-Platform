-- ============================================
-- MAKE YOURSELF AN ADMIN
-- Copy this script to Supabase SQL Editor
-- Replace YOUR_EMAIL with your actual email
-- Then click "Run"
-- ============================================

-- Option 1: Make specific user admin by email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL@example.com';

-- Option 2: Make ALL users admin (for testing only)
-- UPDATE public.profiles SET role = 'admin';

-- Verify who is admin now
SELECT id, email, full_name, role 
FROM public.profiles 
WHERE role = 'admin';
