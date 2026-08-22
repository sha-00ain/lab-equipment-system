const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { requireAuth, requireRole } = require('../middleware/auth');

// POST /api/damage-reports  — any authenticated user reports damage
// image_url should already point to a file uploaded to Supabase Storage
// (the frontend uploads the image directly to Storage and passes the URL here)
router.post('/', requireAuth, async (req, res) => {
  const { equipment_id, borrow_request_id, description, image_url } = req.body;

  if (!equipment_id || !description) {
    return res.status(400).json({ error: 'equipment_id and description are required' });
  }

  const { data, error } = await supabase
    .from('damage_reports')
    .insert({
      equipment_id,
      borrow_request_id: borrow_request_id || null,
      reported_by: req.user.id,
      description,
      image_url
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/damage-reports/my
router.get('/my', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('damage_reports')
    .select('*, equipment(name, category)')
    .eq('reported_by', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/damage-reports  — staff/admin sees all reports (optional ?status=)
router.get('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  let query = supabase
    .from('damage_reports')
    .select('*, equipment(name, category), profiles!damage_reports_reported_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (req.query.status) query = query.eq('status', req.query.status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/damage-reports/:id  — staff/admin updates status / repair cost
router.patch('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { status, repair_cost } = req.body;
  const updates = { updated_at: new Date().toISOString() };

  if (status) {
    updates.status = status;
    if (status === 'resolved') updates.resolved_at = new Date().toISOString();
  }
  if (repair_cost !== undefined) updates.repair_cost = repair_cost;

  const { data, error } = await supabase
    .from('damage_reports')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // If resolved, mark the equipment condition back to good
  if (status === 'resolved' && data) {
    await supabase.from('equipment').update({ condition: 'good' }).eq('id', data.equipment_id);
  }
  // If under repair, flag the equipment condition
  if (status === 'under_repair' && data) {
    await supabase.from('equipment').update({ condition: 'under_repair' }).eq('id', data.equipment_id);
  }

  res.json(data);
});

module.exports = router;
