import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProducts);         // Obtener todos los productos
router.get('/:id', getProductById);      // Obtener producto por ID

// Rutas protegidas
router.post('/create', auth, createProduct);     // Crear producto
router.put('/:id', auth, updateProduct);         // Actualizar producto
router.delete('/:id', auth, deleteProduct);      // Eliminar producto

export default router;