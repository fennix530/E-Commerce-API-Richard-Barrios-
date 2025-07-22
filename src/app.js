import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/auth.routes.js';
import db from './config/firebase.js'; // Asegurate que esta ruta sea correcta

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Rutas principales
app.use('/productos', productRoutes);
app.use('/auth', authRoutes);

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('🔥 Backend Express desde Vercel');
});

// ✅ Ruta rápida para confirmar que el servidor responde
app.get('/ping', (req, res) => {
  res.send('Ping');
});

// ✅ Ruta de prueba para Vercel
app.get('/vercel-test', (req, res) => {
  console.log('🎯 /vercel-test invocada');
  res.send('✅ Vercel + Firebase funcionando');
});

// ✅ Ruta de prueba para Firestore (opcional)
app.get('/firebase-test', async (req, res) => {
  try {
    const snapshot = await db.collection('test').limit(1).get();
    res.send(`✅ Firestore respondió con ${snapshot.size} documentos`);
  } catch (error) {
    console.error('❌ Error en Firebase:', error);
    res.status(500).send('Error al conectar con Firestore');
  }
});

// ❌ Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;