-- Add e-commerce profile fields for shipping and contact information
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);

-- Create index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
