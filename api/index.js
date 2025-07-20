import serverless from 'serverless-http';
import app from '../src/app.js';

console.log('Handler ejecutado');

export default serverless(app);