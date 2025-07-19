import serverless from 'serverless-http';
import app from '../src/app.js'; // Ajustá el path si tu app está en src/

export const handler = serverless(app);