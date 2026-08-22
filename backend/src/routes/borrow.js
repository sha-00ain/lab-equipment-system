const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { requireAuth, requireRole } = require('../middleware/auth');

// POST /api/borrow  — student/faculty creates a borrow request
router.post('/', requireAuth, async (req, res) => {
  const { equipment_id, quantity, purpose, due_date } = req.body;

  if (!equipment_id || !due_date) {
    return res.status(400).json({ error: 'equipment_id and due_date are required' });
  }

  const qty = quantity || 1;

  const { data: equipment, error: eqError } = await supabase
    .from('equipment')
    .select('available_quantity')
    .eq('id', equipment_id)
    .single();

  if (eqError || !equipment) return res.status(404).json({ error: 'Equipment not found' });
  if (equipment.available_quantity < qty) {
    return res.status(400).json({ error: 'Not enough units available right now' });
  }

  const { data, error } = await supabase
    .from('borrow_requests')
    .insert({
      equipment_id,
      user_id: req.user.id,
      quantity: qty,
      purpose,
      due_date,
      status: 'pending'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/borrow/my  — logged-in user's own requests
router.get('/my', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('borrow_requests')
    .select('*, equipment(name, category, image_url)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/borrow  — staff/admin sees all requests (optional ?status=)
router.get('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  let query = supabase
    .from('borrow_requests')
    .select('*, equipment(name, category), profiles!borrow_requests_user_id_fkey(full_name, student_id, department)')
    .order('created_at', { ascending: false });

  if (req.query.status) query = query.eq('status', req.query.status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/borrow/:id/approve  — staff/admin approves & issues equipment
router.patch('/:id/approve', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { data: request, error: reqError } = await supabase
    .from('borrow_requests')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (reqError || !request) return res.status(404).json({ error: 'Request not found' });
  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'Only pending requests can be approved' });
  }

  const { data: equipment, error: eqError } = await supabase
    .from('equipment')
    .select('available_quantity')
    .eq('id', request.equipment_id)
    .single();

  if (eqError || equipment.available_quantity < request.quantity) {
    return res.status(400).json({ error: 'Not enough units available to approve this request' });
  }

  const { error: updateEqError } = await supabase
    .from('equipment')
    .update({ available_quantity: equipment.available_quantity - request.quantity })
    .eq('id', request.equipment_id);

  if (updateEqError) return res.status(500).json({ error: updateEqError.message });

  const { data, error } = await supabase
    .from('borrow_requests')
    .update({
      status: 'issued',
      approved_by: req.user.id,
      approved_at: new Date().toISOString(),
      issued_at: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /api/borrow/:id/reject  — staff/admin rejects a request
router.patch('/:id/reject', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('borrow_requests')
    .update({ status: 'rejected', approved_by: req.user.id, approved_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(400).json({ error: 'Only pending requests can be rejected' });
  res.json(data);
});

module.exports = router;
