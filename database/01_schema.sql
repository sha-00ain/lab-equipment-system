-- ===================================================================
-- University Lab Equipment Management System
-- Database Schema (PostgreSQL / Supabase)
-- Run this file first in the Supabase SQL Editor
-- ===================================================================

create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------
-- PROFILES  (extends Supabase auth.users with app-specific fields)
-- -------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'faculty', 'staff', 'admin')),
  student_id text,
  department text,
  phone text,
  created_at timestamptz default now()
);

-- Automatically create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------------
-- EQUIPMENT  (inventory)
-- -------------------------------------------------------------------
create table if not exists equipment (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  total_quantity int not null default 1 check (total_quantity >= 0),
  available_quantity int not null default 1 check (available_quantity >= 0),
  condition text not null default 'good' check (condition in ('good', 'fair', 'damaged', 'under_repair')),
  location text,
  image_url text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------------
-- BORROW REQUESTS
-- -------------------------------------------------------------------
create table if not exists borrow_requests (
  id uuid primary key default uuid_generate_v4(),
  equipment_id uuid not null references equipment(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  purpose text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'issued', 'returned', 'cancelled')),
  request_date timestamptz default now(),
  due_date date,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  issued_at timestamptz,
  created_at timestamptz default now()
);

-- -------------------------------------------------------------------
-- RETURNS
-- -------------------------------------------------------------------
create table if not exists returns (
  id uuid primary key default uuid_generate_v4(),
  borrow_request_id uuid not null references borrow_requests(id) on delete cascade,
  returned_date timestamptz default now(),
  condition_on_return text not null default 'good' check (condition_on_return in ('good', 'fair', 'damaged')),
  notes text,
  received_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- -------------------------------------------------------------------
-- DAMAGE REPORTS
-- -------------------------------------------------------------------
create table if not exists damage_reports (
  id uuid primary key default uuid_generate_v4(),
  equipment_id uuid not null references equipment(id) on delete cascade,
  borrow_request_id uuid references borrow_requests(id),
  reported_by uuid not null references profiles(id),
  description text not null,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'under_repair', 'resolved')),
  repair_cost numeric(10,2),
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------------
-- Helpful indexes
-- -------------------------------------------------------------------
create index if not exists idx_borrow_user on borrow_requests(user_id);
create index if not exists idx_borrow_equipment on borrow_requests(equipment_id);
create index if not exists idx_borrow_status on borrow_requests(status);
create index if not exists idx_damage_equipment on damage_reports(equipment_id);
create index if not exists idx_damage_status on damage_reports(status);
