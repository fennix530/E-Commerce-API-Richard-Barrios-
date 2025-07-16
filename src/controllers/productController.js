import * as firestoreService from '../services/firestoreService.js';
import Producto from '../models/product.js';

// Obtiene todos los productos con filtros y paginación
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

// Obtiene un producto por ID
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

// Crea un producto
export const createProduct = async (req, res) => {
  try {
    // Validación previa del campo "nombre"
    if (!req.body.nombre || typeof req.body.nombre !== 'string') {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio y debe ser texto' });
    }

    // Instancia del producto con validaciones internas
    const producto = new Producto(req.body);

    // Validación de nombre duplicado
    const existentes = await firestoreService.getByNombreNormalizado(producto.nombreNormalizado);
    if (!existentes.empty) {
      return res.status(400).json({ error: `Ya existe un producto con el nombre "${producto.nombre}".` });
    }

    // Guardado en Firestore
    const creado = await firestoreService.createProduct(producto.toJSON());
    res.status(201).json(creado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: error.message || 'Error al crear producto' });
  }
};

// Actualiza un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productoExistente = await firestoreService.getProductById(id);
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let nombreNormalizado = productoExistente.nombre.trim().toLowerCase();

    // Validar si el nombre fue modificado
    if (req.body.nombre && req.body.nombre.trim().toLowerCase() !== nombreNormalizado) {
      nombreNormalizado = req.body.nombre.trim().toLowerCase();

      const duplicados = await firestoreService.getByNombreNormalizado(nombreNormalizado);
      const yaExiste = duplicados.docs.some(d => d.id !== id);

      if (yaExiste) {
        return res.status(400).json({ error: `Ya existe un producto con el nombre "${req.body.nombre}".` });
      }
    }

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

// Elimina un producto
export const deleteProduct = async (req, res) => {
  try {
    await firestoreService.deleteProduct(req.params.id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar producto' });
  }
};
