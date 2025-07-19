import serverless from 'serverless-http';
import app from './app.js'; // ✅ usa './app.js' porque está en la raíz

export const handler = serverless(app);