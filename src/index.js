const express = require('express');
const app = express();

// Importar rutas
const productRoutes = require('./routes/productRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas bajo el prefijo /api/productos
app.use('/api/productos', productRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
