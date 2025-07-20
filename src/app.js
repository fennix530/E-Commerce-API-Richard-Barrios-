import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.send('🔥 Backend Express vivo desde Vercel');
});

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/productos', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.get('/ping', (req, res) => {
  res.send('Pong ✅');
});

export default app;