import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/auth.routes.js';
import db from './config/firebase.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// 🔗 Rutas principales
app.use('/productos', productRoutes);
app.use('/auth', authRoutes);

// 🧪 Ruta de prueba general
app.get('/vercel-test', (req, res) => {
  console.log('🎯 /vercel-test invocada');
  res.send('✅ Vercel + Firebase funcionando');
});

// 🔍 Ruta de test para Firestore
app.get('/firebase-test', async (req, res) => {
  console.log('🔍 Test Firestore iniciado');
  try {
    const snapshot = await db.collection('test').limit(1).get();
    const data = snapshot.docs.map(doc => doc.data());
    console.log('📦 Documentos obtenidos:', data.length);
    res.send(`📦 Firestore respondió con ${snapshot.size} documentos: ${JSON.stringify(data)}`);
  } catch (err) {
    console.error('❌ Error en Firestore:', err.message);
    res.status(500).send('⚠️ Falló la conexión con Firestore');
  }
});

// ❌ Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;