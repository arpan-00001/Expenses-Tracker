const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'teentrack-jwt-super-secret-development-key-32chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  cors: {
    origin: process.env.FRONTEND_URL 
      ? (process.env.FRONTEND_URL.includes(',') 
          ? process.env.FRONTEND_URL.split(',').map(s => s.trim()) 
          : process.env.FRONTEND_URL)
      : 'http://localhost:5173',
  },
  
  bcrypt: {
    saltRounds: 12,
  },

  currency: {
    code: 'INR',
    symbol: '₹',
  },
};

// Check if using real Supabase or local development database
const isSupabaseConfigured = 
  process.env.SUPABASE_URL && 
  process.env.SUPABASE_SERVICE_ROLE_KEY && 
  !process.env.SUPABASE_URL.includes('your-project') &&
  process.env.SUPABASE_URL !== 'local';

config.isLocalDb = !isSupabaseConfigured;

module.exports = config;
