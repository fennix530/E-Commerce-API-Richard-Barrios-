import { db } from '../config/firebaseConfig.js';

const COLLECTION = 'productos';

const limpiarProducto = (doc) => {
  const { nombreNormalizado: _, ...data } = doc.data();
  return { id: doc.id, ...data };
};

//Extraer todo los producto. Filtra por categoria, precio minimo y maximo, y paginacion.
export const getProducts = async ({ categoria, precioMin, precioMax, page = 1, limit = 10 }) => {
  let ref = db.collection(COLLECTION);

  if (categoria) ref = ref.where('categoria', '==', categoria);
  if (precioMin) ref = ref.where('precio', '>=', parseFloat(precioMin));
  if (precioMax) ref = ref.where('precio', '<=', parseFloat(precioMax));

  const offset = (page - 1) * limit;
  const snapshot = await ref.offset(offset).limit(parseInt(limit)).get();

  return snapshot.docs.map(limpiarProducto);
};

export const getProductById = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  return doc.exists ? limpiarProducto(doc) : null;
};

export const getByNombreNormalizado = async (nombreNormalizado) => {
  return db.collection(COLLECTION).where('nombreNormalizado', '==', nombreNormalizado).get();
};

//Crea un producto
export const createProduct = async (data) => {
  const nombreNormalizado = data.nombre.trim().toLowerCase();
  const categoria = data.categoria || 'general';

  const productoFinal = {
    ...data,
    nombreNormalizado,
    categoria,
    createdAt: new Date().toISOString()
  };

  const ref = await db.collection(COLLECTION).add(productoFinal);
  const nuevo = await ref.get();
  return limpiarProducto(nuevo);
};

//Actauliza Producto por su ID
export const updateProduct = async (id, data) => {
  await db.collection(COLLECTION).doc(id).update(data);
  const actualizado = await db.collection(COLLECTION).doc(id).get();
  return limpiarProducto(actualizado);
};

// Elimina el producto por ID
export const deleteProduct = async (id) => {
  await db.collection(COLLECTION).doc(id).delete();
};