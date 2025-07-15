const db = require('../config/firebase');
const collection = db.collection('productos');

// Obtener todos los productos
exports.getProducts = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    delete data.nombreNormalizado;
    return { id: doc.id, ...data };
  });
};

// Obtener producto por ID
exports.getProductById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  delete data.nombreNormalizado;
  return { id: doc.id, ...data };
};

// Crear producto evitando duplicados por nombre normalizado
exports.createProduct = async (producto) => {
  const nombreNormalizado = producto.nombre.trim().toLowerCase();
  const existentes = await collection.where('nombreNormalizado', '==', nombreNormalizado).get();

  if (!existentes.empty) {
    throw new Error(`Ya existe un producto con el nombre "${producto.nombre}".`);
  }

  const productoConExtra = {
    ...producto,
    nombreNormalizado,
    updatedAt: new Date().toISOString()
  };

  const docRef = await collection.add(productoConExtra);
  const nuevo = await docRef.get();
  const data = nuevo.data();
  delete data.nombreNormalizado;
  return { id: nuevo.id, ...data };
};

// Actualizar el producto
exports.updateProduct = async (id, datosActualizados) => {
  const doc = await collection.doc(id).get();
  const original = doc.exists ? doc.data() : {};

  // Evitar que el updatedAt viejo se mezcle
  delete original.updatedAt;

  const nombreNormalizado = datosActualizados.nombre
    ? datosActualizados.nombre.trim().toLowerCase()
    : original.nombre ? original.nombre.trim().toLowerCase() : '';

  const datosFinales = {
    ...original,
    ...datosActualizados,
    nombreNormalizado,
    updatedAt: new Date().toISOString()
  };

  await collection.doc(id).set(datosFinales, { merge: true });

  const actualizado = await collection.doc(id).get();
  const data = actualizado.data();
  delete data.nombreNormalizado;
  return { id: actualizado.id, ...data };
};

// Eliminar producto por ID
exports.deleteProduct = async (id) => {
  await collection.doc(id).delete();
  return { mensaje: 'Producto eliminado correctamente' };
};