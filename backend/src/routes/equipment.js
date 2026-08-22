const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/equipment  — list all equipment, optional search/category filter
router.get('/', requireAuth, async (req, res) => {
  const { search, category } = req.query;
  let query = supabase.from('equipment').select('*').order('name', { ascending: true });

  if (search) query = query.ilike('name', `%${search}%`);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/equipment/:id
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Equipment not found' });
  res.json(data);
});

// POST /api/equipment  — staff/admin only
router.post('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { name, category, description, total_quantity, condition, location, image_url } = req.body;

  if (!name || !category || !total_quantity) {
    return res.status(400).json({ error: 'name, category and total_quantity are required' });
  }

  const { data, error } = await supabase
    .from('equipment')
    .insert({
      name,
      category,
      description,
      total_quantity,
      available_quantity: total_quantity,
      condition: condition || 'good',
      location,
      image_url,
      created_by: req.user.id
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/equipment/:id  — staff/admin only
router.put('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const updates = { ...req.body, updated_at: new Date().toISOString() };
  delete updates.id;

  const { data, error } = await supabase
    .from('equipment')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/equipment/:id  — staff/admin only
router.delete('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { error } = await supabase.from('equipment').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Equipment deleted' });
});

module.exports = router;
