const jsonService = require('../services/jsonService');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await jsonService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error interno al obtener productos:', error); 
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const idNum = parseInt(req.params.id);

    if (isNaN(idNum)) {
      return res.status(400).json({ error: 'ID inválido. Debe ser numérico.' });
    }

    const productos = await jsonService.getProducts();
    const producto = productos.find(p => p.id === idNum);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
};



exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre y precio' });
    }

    const nuevoProducto = await jsonService.addProduct({ nombre, precio });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Faltan datos en el cuerpo de la solicitud' });
    }

    const { nombre, precio } = req.body;

    const productos = await jsonService.getProducts();
    const index = productos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = {
      ...productos[index],
      nombre: nombre ?? productos[index].nombre,
      precio: precio ?? productos[index].precio,
    };

    await jsonService.writeProducts(productos);
    res.status(200).json(productos[index]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

exports.partialUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const productos = await jsonService.getProducts();
    const index = productos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = {
      ...productos[index],
      ...updates
    };

    await jsonService.writeProducts(productos);
    res.status(200).json(productos[index]);
  } catch (error) {
    console.error('Error en PATCH:', error);
    res.status(500).json({ error: 'Error al actualizar parcialmente el producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productos = await jsonService.getProducts();
    const nuevoArray = productos.filter(p => p.id !== parseInt(id));

    if (productos.length === nuevoArray.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    

    await jsonService.writeProducts(nuevoArray);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
