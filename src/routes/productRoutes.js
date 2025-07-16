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

// Rutas
router.get('/', getAllProducts); // Pública
router.get('/:id', getProductById); // Pública
router.post('/create', auth, createProduct); // Protegida
router.put('/:id', auth, updateProduct); // Protegida
router.delete('/:id', auth, deleteProduct); // Protegida

export default router;

