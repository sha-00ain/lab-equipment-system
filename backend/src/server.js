require('dotenv').config();
const express = require('express');
const cors = require('cors');

const equipmentRoutes = require('./routes/equipment');
const borrowRoutes = require('./routes/borrow');
const returnsRoutes = require('./routes/returns');
const damageRoutes = require('./routes/damage');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// --- CORS ---
// Reflects whatever origin the request came from, so a mismatched or
// unset CLIENT_ORIGIN env var never silently blocks the frontend with a
// browser-side "Failed to fetch" error. Safe here because this API does
// not use cookies and every route already checks the user's Supabase
// JWT + role, so origin restriction is not the security boundary.
app.use(cors({ origin: true }));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'lab-equipment-backend' });
});

app.use('/api/equipment', equipmentRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/damage-reports', damageRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Lab Equipment backend running on port ${PORT}`);
});
