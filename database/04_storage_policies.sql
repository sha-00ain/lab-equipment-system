-- ===================================================================
-- Storage RLS policies for the "damage-reports" bucket
-- Run this in the Supabase SQL Editor AFTER creating the bucket
-- (Storage > New bucket > name: damage-reports > Public: ON)
--
-- Why this is needed: making a bucket "Public" only makes files
-- readable by anyone with the URL. Uploading (INSERT) into the
-- bucket is still governed by Row Level Security on storage.objects,
-- so without this policy every upload fails with:
--   "new row violates row-level security policy"
-- ===================================================================

-- Allow any signed-in user to upload files into the damage-reports bucket
create policy "Authenticated users can upload damage report images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'damage-reports');

-- Allow anyone to read/view files in the damage-reports bucket
-- (needed so the <img> tags in the Admin Damage Reports page can load them)
create policy "Public read access to damage report images"
on storage.objects for select
to public
using (bucket_id = 'damage-reports');
