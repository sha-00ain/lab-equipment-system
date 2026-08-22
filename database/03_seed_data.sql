-- ===================================================================
-- Optional sample data — run AFTER you have created at least one
-- admin user through the app (Sign Up), then run 01 and 02 above.
-- Replace nothing here; this only inserts equipment, which has no
-- dependency on a specific user id except created_by (nullable-safe).
-- ===================================================================

insert into equipment (name, category, description, total_quantity, available_quantity, condition, location)
values
  ('Digital Oscilloscope', 'Electronics', 'GW Instek 2-channel digital oscilloscope', 5, 5, 'good', 'Electronics Lab - Rack A'),
  ('Arduino Uno Kit', 'Electronics', 'Arduino Uno R3 starter kit with sensors', 20, 20, 'good', 'Electronics Lab - Shelf B'),
  ('Digital Multimeter', 'Electronics', 'Standard handheld digital multimeter', 15, 15, 'good', 'Electronics Lab - Drawer 3'),
  ('DSLR Camera', 'Media', 'Canon EOS 1500D with kit lens', 3, 3, 'good', 'Media Lab - Cabinet 1'),
  ('Tripod Stand', 'Media', 'Adjustable aluminum tripod', 6, 6, 'good', 'Media Lab - Cabinet 1'),
  ('Soldering Iron Kit', 'Electronics', 'Temperature-controlled soldering station', 10, 10, 'fair', 'Electronics Lab - Rack C'),
  ('3D Printer', 'Prototyping', 'Creality Ender 3 FDM printer', 4, 4, 'good', 'Prototyping Lab'),
  ('VR Headset', 'Computing', 'Meta Quest 2 standalone VR headset', 5, 5, 'good', 'Computer Lab - Locker 2')
on conflict do nothing;
