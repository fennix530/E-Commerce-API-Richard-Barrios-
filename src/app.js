import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas activas
app.use('/productos', productRoutes);
app.use('/auth', authRoutes);

// Ruta raíz Vercel
app.get('/', (req, res) => {
  res.send('API de Ecommerce funcionando correctamente');
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;