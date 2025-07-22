import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/productos', productRoutes);

app.get('/', (req, res) => {
  res.send('🔥 Backend Express desde Vercel');
});

app.get('/ping', (req, res) => {
  res.send('Ping');
});

app.use('/auth', authRoutes);

// Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;