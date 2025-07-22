import express from 'express';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/auth.routes.js';
import db from './config/firebase.js';

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Rutas principales
app.use('/productos', productRoutes);
app.use('/auth', authRoutes);

// 🧪 Ruta de prueba de Firestore
app.get('/firebase-test', async (req, res) => {
  try {
    const snapshot = await db.collection('test').limit(1).get();
    res.send(`📦 Firestore respondió con ${snapshot.size} documentos`);
  } catch (err) {
    console.error("❌ Error en Firestore:", err);
    res.status(500).send("Error al conectar con Firestore");
  }
});

// ❌ Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;