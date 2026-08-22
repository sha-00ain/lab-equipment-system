const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn(
    '[WARN] SUPABASE_URL or SUPABASE_SERVICE_KEY is missing. ' +
    'Copy .env.example to .env and fill in your Supabase project credentials.'
  );
}

// The service key bypasses Row Level Security, so it must ONLY be used
// on the backend, never exposed to the frontend/browser.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

module.exports = supabase;
