const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');


// Middleware para recibir JSON
app.use(express.json());

// Permite solicitudes desde cualquier origen
app.use(cors()); 

// Rutas protegidas y públicas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Servidor activo
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});