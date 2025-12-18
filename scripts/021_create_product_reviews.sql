-- ============================================
-- PRODUCT REVIEWS TABLE
-- Copy this ENTIRE script and paste into
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================

-- Step 1: Enable UUID extension
create extension if not exists "uuid-ossp";

-- Step 2: Create product_reviews table
create table if not exists public.product_reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamptz default now()
);

-- Step 3: Create indexes
create index if not exists product_reviews_product_id_idx on public.product_reviews (product_id);
create index if not exists product_reviews_user_id_idx on public.product_reviews (user_id);

-- Step 4: Enable Row Level Security
alter table public.product_reviews enable row level security;

-- Step 5: Drop existing policies (safe to run even if they don't exist)
drop policy if exists "Anyone can read reviews" on public.product_reviews;
drop policy if exists "Users can insert own reviews" on public.product_reviews;
drop policy if exists "Users can update own reviews" on public.product_reviews;
drop policy if exists "Users can delete own reviews" on public.product_reviews;

-- Step 6: Create policies
create policy "Anyone can read reviews" 
  on public.product_reviews 
  for select 
  using (true);

create policy "Users can insert own reviews" 
  on public.product_reviews 
  for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own reviews" 
  on public.product_reviews 
  for update 
  using (auth.uid() = user_id);

create policy "Users can delete own reviews" 
  on public.product_reviews 
  for delete 
  using (auth.uid() = user_id);

-- Step 7: Grant permissions
grant select on public.product_reviews to anon;
grant select, insert, update, delete on public.product_reviews to authenticated;

-- Done! You should see "Success" message
select 'product_reviews table created successfully!' as result;
