import db from '../config/firebase.js';
const collection = db.collection('productos');

export const getProducts = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    delete data.nombreNormalizado;
    return { id: doc.id, ...data };
  });
};

export const getProductById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  delete data.nombreNormalizado;
  return { id: doc.id, ...data };
};

export const createProduct = async (producto) => {
  if (!producto.nombre || typeof producto.precio === 'undefined') {
    throw new Error('Faltan campos obligatorios');
  }

  const nombreNormalizado = producto.nombre.trim().toLowerCase();
  const existentes = await collection
    .where('nombreNormalizado', '==', nombreNormalizado)
    .get();

  if (!existentes.empty) {
    throw new Error(`Ya existe un producto con el nombre "${producto.nombre}".`);
  }

  const productoConExtra = {
    ...producto,
    categoria: producto.categoria || 'Sin especificar',
    nombreNormalizado,
    updatedAt: new Date().toISOString()
  };

  const docRef = await collection.add(productoConExtra);
  const nuevo = await docRef.get();
  const data = nuevo.data();
  delete data.nombreNormalizado;
  return { id: nuevo.id, ...data };
};

export const updateProduct = async (id, datosActualizados) => {
  const doc = await collection.doc(id).get();
  const original = doc.exists ? doc.data() : {};
  delete original.updatedAt;

  const nombreNormalizado = datosActualizados.nombre
    ? datosActualizados.nombre.trim().toLowerCase()
    : original.nombre?.trim().toLowerCase() || '';

  const datosFinales = {
    ...original,
    ...datosActualizados,
    categoria: datosActualizados.categoria || original.categoria || 'Sin especificar',
    nombreNormalizado,
    updatedAt: new Date().toISOString()
  };

  await collection.doc(id).set(datosFinales, { merge: true });
  const actualizado = await collection.doc(id).get();
  const data = actualizado.data();
  delete data.nombreNormalizado;
  return { id: actualizado.id, ...data };
};

export const deleteProduct = async (id) => {
  await collection.doc(id).delete();
  return { mensaje: 'Producto eliminado correctamente' };
};