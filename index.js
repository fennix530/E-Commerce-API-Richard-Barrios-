import serverless from 'serverless-http';
import app from './src/app.js';

console.log("index.js cargado en Vercel");
export default serverless(app);