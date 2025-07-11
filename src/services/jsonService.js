const fs = require('fs').promises;
const path = require('path');

// Ruta al archivo productos.json
const filePath = path.join(__dirname, '../productos.json');
console.log('Ruta del archivo:', filePath);

// Leer todos los productos
exports.getProducts = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer productos:', error);
    return [];
  }
};

// Escribir el array de productos completo
exports.writeProducts = async (productos) => {
  await fs.writeFile(filePath, JSON.stringify(productos, null, 2));
};

// Agregar un nuevo producto con ID autoincremental
exports.addProduct = async (productData) => {
  const products = await exports.getProducts();

  const lastId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newProduct = {
    id: lastId + 1,
    ...productData
  };

  products.push(newProduct);
  await exports.writeProducts(products);
  return newProduct;
};

// Actualizar parcialmente un producto (PATCH)
exports.updateProductById = async (id, updates) => {
  const products = await exports.getProducts();
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    throw new Error('Producto no encontrado');
  }

  products[index] = {
    ...products[index],
    ...updates
  };

  await exports.writeProducts(products);
  return products[index];
};

// Eliminar producto por ID
exports.deleteProductById = async (id) => {
  const products = await exports.getProducts();
  const filtered = products.filter(p => p.id !== parseInt(id));

  if (filtered.length === products.length) {
    throw new Error('Producto no encontrado');
  }

  await exports.writeProducts(filtered);
  return true;
};