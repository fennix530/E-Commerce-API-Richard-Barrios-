import * as ProductModel from '../models/productModel.js';

//Muestra todo los pruductos
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.getProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

//Muestra un producto por ID
export const getProductById = async (req, res) => {
  try {
    const producto = await ProductModel.getProductById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

//Crea un producto
export const createProduct = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    }

    // Valida si ya existe en la BD
    const nombreNormalizado = nombre.trim().toLowerCase();
    const existentes = await ProductModel.getByNombreNormalizado(nombreNormalizado);
    if (!existentes.empty) {
      return res.status(400).json({ error: `Ya existe "${nombre}"` });
    }

    // El modelo se encargará de normalizar, categorizar y limpiar
    const creado = await ProductModel.createProduct(req.body);
    res.status(201).json(creado);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(400).json({ error: 'Error al crear producto' });
  }
};

//Actauliza Producto por su ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const actual = await ProductModel.getProductById(id);
    if (!actual) return res.status(404).json({ error: 'Producto no encontrado' });

    const datosFinales = {
      ...actual,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Verifica si le cambia el nombre y si ya existe en la BD
    if (req.body.nombre) {
      const nuevoNombre = req.body.nombre.trim().toLowerCase();
      if (nuevoNombre !== actual.nombre.trim().toLowerCase()) {
        const duplicados = await ProductModel.getByNombreNormalizado(nuevoNombre);
        const yaExiste = duplicados.docs.some(d => d.id !== id);
        if (yaExiste) {
          return res.status(400).json({ error: `Ya existe "${req.body.nombre}"` });
        }
        datosFinales.nombreNormalizado = nuevoNombre;
      }
    }

    datosFinales.categoria = req.body.categoria || actual.categoria || 'General';

    // Eliminamos los campos con undefined para evitar errores en Firestore
    Object.keys(datosFinales).forEach(key => {
      if (datosFinales[key] === undefined) {
        delete datosFinales[key];
      }
    });

    const actualizado = await ProductModel.updateProduct(id, datosFinales);
    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Detalle del error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Elimina el producto por ID
export const deleteProduct = async (req, res) => {
  try {
    await ProductModel.deleteProduct(req.params.id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};