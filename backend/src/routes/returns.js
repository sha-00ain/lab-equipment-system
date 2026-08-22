const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { requireAuth, requireRole } = require('../middleware/auth');

// POST /api/returns  — staff/admin confirms equipment has been returned
router.post('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { borrow_request_id, condition_on_return, notes } = req.body;

  if (!borrow_request_id) {
    return res.status(400).json({ error: 'borrow_request_id is required' });
  }

  const { data: request, error: reqError } = await supabase
    .from('borrow_requests')
    .select('*')
    .eq('id', borrow_request_id)
    .single();

  if (reqError || !request) return res.status(404).json({ error: 'Borrow request not found' });
  if (request.status !== 'issued') {
    return res.status(400).json({ error: 'Only issued (currently borrowed) items can be returned' });
  }

  const { data: returnRecord, error: returnError } = await supabase
    .from('returns')
    .insert({
      borrow_request_id,
      condition_on_return: condition_on_return || 'good',
      notes,
      received_by: req.user.id
    })
    .select()
    .single();

  if (returnError) return res.status(500).json({ error: returnError.message });

  await supabase
    .from('borrow_requests')
    .update({ status: 'returned' })
    .eq('id', borrow_request_id);

  const { data: equipment } = await supabase
    .from('equipment')
    .select('available_quantity')
    .eq('id', request.equipment_id)
    .single();

  if (equipment) {
    const updates = { available_quantity: equipment.available_quantity + request.quantity };
    if (condition_on_return === 'damaged') updates.condition = 'damaged';
    await supabase.from('equipment').update(updates).eq('id', request.equipment_id);
  }

  res.status(201).json(returnRecord);
});

// GET /api/returns  — staff/admin views return history
router.get('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('returns')
    .select('*, borrow_requests(equipment_id, user_id, quantity, equipment(name), profiles!borrow_requests_user_id_fkey(full_name))')
    .order('returned_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
