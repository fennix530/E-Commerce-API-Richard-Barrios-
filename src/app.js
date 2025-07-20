import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('🔥 Backend Express vivo desde Vercel');
});

app.get('/ping', (req, res) => {
  res.send('Pong ');
});

app.use('/auth', authRoutes);
app.use('/productos', productRoutes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores internos
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;