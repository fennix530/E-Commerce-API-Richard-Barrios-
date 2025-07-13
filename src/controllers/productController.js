const firestoreService = require('../services/firestoreService');
const Producto = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, precioMin, precioMax } = req.query;
    let products = await firestoreService.getProducts();

    if (categoria) {
      products = products.filter(p => p.categoria === categoria);
    }
    if (precioMin) {
      products = products.filter(p => p.precio >= parseFloat(precioMin));
    }
    if (precioMax) {
      products = products.filter(p => p.precio <= parseFloat(precioMax));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginados = products.slice(startIndex, endIndex);

    res.status(200).json(paginados);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await firestoreService.getProductById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: error.message || 'Error al obtener producto por ID' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    const creado = await firestoreService.createProduct(producto.toJSON());
    res.status(201).json(creado);
  } catch (error) {
    console.error('🔥 Error al crear producto:', error);
    res.status(400).json({ error: error.message || 'Error al crear producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = new Producto(req.body);
    const actualizado = await firestoreService.updateProduct(id, productoActualizado.toJSON());
    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar producto' });
  }
};

exports.partialUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    const actualizado = await firestoreService.partialUpdateProduct(id, updates);
    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar parcialmente:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar parcialmente' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await firestoreService.deleteProduct(id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar producto' });
  }
};