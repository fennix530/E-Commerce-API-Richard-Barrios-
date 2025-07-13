const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');


router.get('/', productController.getAllProducts); // Pública

router.get('/:id', productController.getProductById); //Pública

router.post('/', auth, productController.createProduct); // Protegida

router.put('/:id', auth, productController.updateProduct); // Protegida

router.delete('/:id',auth, productController.deleteProduct); // Protegida


module.exports = router;
