-- ============================================
-- SET USER AS ADMIN
-- Replace 'your-email@example.com' with your actual email
-- Copy this script and paste into Supabase Dashboard > SQL Editor
-- Then click "Run"
-- ============================================

-- Step 1: Check current role
SELECT id, email, role, full_name
FROM public.profiles
WHERE email = 'kumar799024@gmail.com';

-- Step 2: Update role to admin
-- IMPORTANT: Replace 'your-email@example.com' with your actual email address
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'kumar799024@gmail.com';

-- Step 3: Verify the update
SELECT id, email, role, full_name
FROM public.profiles
WHERE email = 'kumar799024@gmail.com';

-- Step 4: If you want to set admin by user ID instead of email:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = 'your-user-id-here';

-- Done! You should see role = 'admin' in the result

