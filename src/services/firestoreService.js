const db = require('../config/firebase');
const collection = db.collection('productos');

// Obtener todos los productos con limpieza interna
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

// Crear producto evitando duplicados por nombre (normalizado)
exports.createProduct = async (producto) => {
  const nombreNormalizado = producto.nombre.trim().toLowerCase();
  const existentes = await collection.where('nombreNormalizado', '==', nombreNormalizado).get();
  if (!existentes.empty) {
    throw new Error(`Ya existe un producto con el nombre "${producto.nombre}".`);
  }

  const productoConExtra = {
    ...producto,
    nombreNormalizado
  };

  const docRef = await collection.add(productoConExtra);
  const nuevo = await docRef.get();
  const data = nuevo.data();
  delete data.nombreNormalizado;
  return { id: nuevo.id, ...data };
};

// Actualizar producto completamente
exports.updateProduct = async (id, datosActualizados) => {
  const nombreNormalizado = datosActualizados.nombre.trim().toLowerCase();
  datosActualizados.updatedAt = new Date().toISOString();
  datosActualizados.nombreNormalizado = nombreNormalizado;

  await collection.doc(id).set(datosActualizados, { merge: false });
  const actualizado = await collection.doc(id).get();
  const data = actualizado.data();
  delete data.nombreNormalizado;
  return { id: actualizado.id, ...data };
};

// Actualizar parcialmente
exports.partialUpdateProduct = async (id, updates) => {
  updates.updatedAt = new Date().toISOString();
  if (updates.nombre) {
    updates.nombreNormalizado = updates.nombre.trim().toLowerCase();
  }

  await collection.doc(id).update(updates);
  const actualizado = await collection.doc(id).get();
  const data = actualizado.data();
  delete data.nombreNormalizado;
  return { id: actualizado.id, ...data };
};

// Eliminar producto
exports.deleteProduct = async (id) => {
  await collection.doc(id).delete();
  return { mensaje: 'Producto eliminado correctamente' };
};