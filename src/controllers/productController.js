import * as firestoreService from '../services/firestoreService.js';
import Producto from '../models/product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, precioMin, precioMax } = req.query;
    let products = await firestoreService.getProducts();

    if (categoria) products = products.filter(p => p.categoria === categoria);
    if (precioMin) products = products.filter(p => p.precio >= parseFloat(precioMin));
    if (precioMax) products = products.filter(p => p.precio <= parseFloat(precioMax));

    const paginados = products.slice((page - 1) * limit, page * limit);
    res.status(200).json(paginados);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const producto = await firestoreService.getProductById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: error.message || 'Error al obtener producto por ID' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productoConValores = {
      nombre: req.body.nombre || 'Producto sin nombre',
      categoria: req.body.categoria || 'Sin especificar',
      precio: req.body.precio ?? 0
    };

    const producto = new Producto(productoConValores);
    const creado = await firestoreService.createProduct(producto.toJSON());
    res.status(201).json(creado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: error.message || 'Error al crear producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productoExistente = await firestoreService.getProductById(id);
    if (!productoExistente) return res.status(404).json({ error: 'Producto no encontrado' });

    const nombreNormalizado = req.body.nombre
      ? req.body.nombre.trim().toLowerCase()
      : productoExistente.nombre.trim().toLowerCase();

    const productoActualizado = {
      ...productoExistente,
      ...req.body,
      nombreNormalizado,
      updatedAt: new Date().toISOString()
    };

    const actualizado = await firestoreService.updateProduct(id, productoActualizado);
    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await firestoreService.deleteProduct(req.params.id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar producto' });
  }
};