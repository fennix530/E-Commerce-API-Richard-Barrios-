import serverless from 'serverless-http';
import app from '../src/app.js';

console.log('Handler ejecutado');

// Vercel requiere un export default
export default serverless(app);