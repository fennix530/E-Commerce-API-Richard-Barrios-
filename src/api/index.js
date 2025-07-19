import serverless from 'serverless-http';
import app from '../src/app.js';

export default function handler(req, res) {
  res.send('Servidor vivo desde Vercel ✅');
}

export const handler = serverless(app);

