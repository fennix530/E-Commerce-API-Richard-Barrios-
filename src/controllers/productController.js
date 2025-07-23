import * as firestoreService from '../services/firestoreService.js';
import Producto from '../models/product.js';

// Obtener productos con filtros y paginación
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, precioMin, precioMax } = req.query;

    console.time('⏱Firestore consulta');
    let products = await firestoreService.getProducts(); // Limita a 10 desde el service
    console.timeEnd(' Firestore consulta');

    // Filtros opcionales
    const filtros = [];
    if (categoria) filtros.push(p => p.categoria === categoria);
    if (precioMin) filtros.push(p => p.precio >= parseFloat(precioMin));
    if (precioMax) filtros.push(p => p.precio <= parseFloat(precioMax));

    // Aplicar filtros encadenados
    if (filtros.length) {
      products = products.filter(p => filtros.every(f => f(p)));
    }

    // Paginación
    const inicio = (page - 1) * limit;
    const paginados = products.slice(inicio, inicio + parseInt(limit));

    res.status(200).json(paginados);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener por ID
export const getProductById = async (req, res) => {
  try {
    const producto = await firestoreService.getProductById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    }

    const producto = new Producto(req.body);
    const existentes = await firestoreService.getByNombreNormalizado(producto.nombreNormalizado);
    if (!existentes.empty) {
      return res.status(400).json({ error: `Ya existe "${producto.nombre}"` });
    }

    const creado = await firestoreService.createProduct(producto.toJSON());
    res.status(201).json(creado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: 'Error al crear producto' });
  }
};

// Actualizar
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const actual = await firestoreService.getProductById(id);
    if (!actual) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let nombreNormalizado = actual.nombre.trim().toLowerCase();

    if (req.body.nombre && req.body.nombre.trim().toLowerCase() !== nombreNormalizado) {
      nombreNormalizado = req.body.nombre.trim().toLowerCase();
      const duplicados = await firestoreService.getByNombreNormalizado(nombreNormalizado);
      const yaExiste = duplicados.docs.some(d => d.id !== id);
      if (yaExiste) {
        return res.status(400).json({ error: `Ya existe "${req.body.nombre}"` });
      }
    }

    const actualizado = await firestoreService.updateProduct(id, {
      ...actual,
      ...req.body,
      nombreNormalizado,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar
export const deleteProduct = async (req, res) => {
  try {
    await firestoreService.deleteProduct(req.params.id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};