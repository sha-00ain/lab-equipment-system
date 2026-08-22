-- ===================================================================
-- Row Level Security (RLS) Policies
-- Run this AFTER 01_schema.sql
-- Roles used: student, faculty, staff, admin
-- "staff" and "admin" are treated as the managing roles.
-- ===================================================================

alter table profiles enable row level security;
alter table equipment enable row level security;
alter table borrow_requests enable row level security;
alter table returns enable row level security;
alter table damage_reports enable row level security;

-- Helper: check if current user is staff/admin
create or replace function public.is_manager()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$ language sql security definer stable;

-- -------------------------------------------------------------------
-- PROFILES
-- -------------------------------------------------------------------
create policy "profiles_select_own_or_manager"
  on profiles for select
  using (auth.uid() = id or public.is_manager());

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- -------------------------------------------------------------------
-- EQUIPMENT  (everyone logged in can view, only staff/admin can manage)
-- -------------------------------------------------------------------
create policy "equipment_select_all"
  on equipment for select
  using (auth.role() = 'authenticated');

create policy "equipment_insert_manager"
  on equipment for insert
  with check (public.is_manager());

create policy "equipment_update_manager"
  on equipment for update
  using (public.is_manager());

create policy "equipment_delete_manager"
  on equipment for delete
  using (public.is_manager());

-- -------------------------------------------------------------------
-- BORROW REQUESTS
-- -------------------------------------------------------------------
create policy "borrow_select_own_or_manager"
  on borrow_requests for select
  using (auth.uid() = user_id or public.is_manager());

create policy "borrow_insert_own"
  on borrow_requests for insert
  with check (auth.uid() = user_id);

create policy "borrow_update_own_or_manager"
  on borrow_requests for update
  using (auth.uid() = user_id or public.is_manager());

-- -------------------------------------------------------------------
-- RETURNS  (managers only)
-- -------------------------------------------------------------------
create policy "returns_select_manager_or_owner"
  on returns for select
  using (
    public.is_manager()
    or exists (
      select 1 from borrow_requests br
      where br.id = returns.borrow_request_id and br.user_id = auth.uid()
    )
  );

create policy "returns_insert_manager"
  on returns for insert
  with check (public.is_manager());

-- -------------------------------------------------------------------
-- DAMAGE REPORTS
-- -------------------------------------------------------------------
create policy "damage_select_own_or_manager"
  on damage_reports for select
  using (auth.uid() = reported_by or public.is_manager());

create policy "damage_insert_own"
  on damage_reports for insert
  with check (auth.uid() = reported_by);

create policy "damage_update_manager"
  on damage_reports for update
  using (public.is_manager());
