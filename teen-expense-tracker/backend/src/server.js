const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 TeenTrack API Server               ║
  ║   Environment: ${config.nodeEnv.padEnd(24)}║
  ║   Port: ${String(PORT).padEnd(32)}║
  ║   URL: http://localhost:${String(PORT).padEnd(17)}║
  ╚══════════════════════════════════════════╝
  `);
});
