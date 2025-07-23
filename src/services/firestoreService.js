import db from '../config/firebase.js';

// Obtener todos los productos (limitado a 10 para evitar timeout)
export const getProducts = async () => {
  console.log('🔍 Iniciando consulta de productos');
  const snapshot = await db.collection('productos').limit(10).get();
  console.log(`📦 Firestore respondió con ${snapshot.size} documentos`);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    delete data.nombreNormalizado;
    return { id: doc.id, ...data };
  });
};

export const getProductById = async (id) => {
  const doc = await db.collection('productos').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  delete data.nombreNormalizado;
  return { id: doc.id, ...data };
};

export const getByNombreNormalizado = async (nombreNormalizado) => {
  if (typeof nombreNormalizado !== 'string') {
    throw new Error('Por favor ingresá un nombre válido para el producto.');
  }
  return await db
    .collection('productos')
    .where('nombreNormalizado', '==', nombreNormalizado)
    .get();
};

export const createProduct = async (producto) => {
  if (!producto.nombre || typeof producto.precio === 'undefined') {
    throw new Error('Faltan campos obligatorios');
  }

  const nombreNormalizado = producto.nombre.trim().toLowerCase();
  const existentes = await getByNombreNormalizado(nombreNormalizado);
  if (!existentes.empty) {
    throw new Error(`Ya existe un producto con el nombre "${producto.nombre}".`);
  }

  const productoConExtra = {
    ...producto,
    categoria: producto.categoria || 'Sin especificar',
    nombreNormalizado,
    updatedAt: new Date().toISOString(),
  };

  const docRef = await db.collection('productos').add(productoConExtra);
  const nuevo = await docRef.get();
  const data = nuevo.data();
  delete data.nombreNormalizado;
  return { id: nuevo.id, ...data };
};

export const updateProduct = async (id, datosActualizados) => {
  const doc = await db.collection('productos').doc(id).get();
  if (!doc.exists) throw new Error('Producto no encontrado');

  const original = doc.data();
  delete original.updatedAt;

  let nombreNormalizado = original.nombre.trim().toLowerCase();

  if (
    datosActualizados.nombre &&
    datosActualizados.nombre.trim().toLowerCase() !== nombreNormalizado
  ) {
    nombreNormalizado = datosActualizados.nombre.trim().toLowerCase();
    const duplicados = await getByNombreNormalizado(nombreNormalizado);
    const yaExiste = duplicados.docs.some(d => d.id !== id);
    if (yaExiste) {
      throw new Error(`Ya existe un producto con el nombre "${datosActualizados.nombre}".`);
    }
  }

  const datosFinales = {
    ...original,
    ...datosActualizados,
    categoria:
      datosActualizados.categoria || original.categoria || 'Sin especificar',
    nombreNormalizado,
    updatedAt: new Date().toISOString(),
  };

  await db.collection('productos').doc(id).set(datosFinales, { merge: true });
  const actualizado = await db.collection('productos').doc(id).get();
  const data = actualizado.data();
  delete data.nombreNormalizado;
  return { id: actualizado.id, ...data };
};

export const deleteProduct = async (id) => {
  await db.collection('productos').doc(id).delete();
  return { mensaje: 'Producto eliminado correctamente' };
};