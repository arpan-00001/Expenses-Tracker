const config = require('./index');

let supabaseClient;

if (config.isLocalDb) {
  console.log('📦 TeenTrack: Running with local persistent development database.');
  console.log('   Demo Account: demo@teentrack.app / TestPass123');
  supabaseClient = require('./localStore');
} else {
  const { createClient } = require('@supabase/supabase-js');
  console.log('☁️  TeenTrack: Connected to Supabase at', config.supabase.url);
  supabaseClient = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

module.exports = supabaseClient;
