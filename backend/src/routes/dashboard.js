const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/dashboard/stats  — staff/admin summary numbers for the dashboard
router.get('/stats', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const [equipmentCount, pendingBorrows, issuedBorrows, pendingDamage] = await Promise.all([
    supabase.from('equipment').select('id', { count: 'exact', head: true }),
    supabase.from('borrow_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('borrow_requests').select('id', { count: 'exact', head: true }).eq('status', 'issued'),
    supabase.from('damage_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending')
  ]);

  const { data: topBorrowed } = await supabase
    .from('borrow_requests')
    .select('equipment_id, equipment(name)')
    .limit(200);

  const counts = {};
  (topBorrowed || []).forEach((r) => {
    const name = r.equipment?.name || 'Unknown';
    counts[name] = (counts[name] || 0) + 1;
  });
  const mostBorrowed = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  res.json({
    total_equipment: equipmentCount.count || 0,
    pending_borrow_requests: pendingBorrows.count || 0,
    currently_issued: issuedBorrows.count || 0,
    pending_damage_reports: pendingDamage.count || 0,
    most_borrowed: mostBorrowed
  });
});

module.exports = router;
