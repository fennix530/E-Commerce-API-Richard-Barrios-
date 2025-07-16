import db from '../config/firebase.js';
const collection = db.collection('productos');

// Obtener todos los productos
export const getProducts = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    delete data.nombreNormalizado;
    return { id: doc.id, ...data };
  });
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  delete data.nombreNormalizado;
  return { id: doc.id, ...data };
};

// Buscar producto por nombre normalizado (validación de duplicado)
export const getByNombreNormalizado = async (nombreNormalizado) => {
  if (typeof nombreNormalizado !== 'string') {
    throw new Error('Por favor ingresá un nombre válido para el producto.');
  }
  return await collection.where('nombreNormalizado', '==', nombreNormalizado).get();
};

// Crear producto con validación
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
    updatedAt: new Date().toISOString()
  };

  const docRef = await collection.add(productoConExtra);
  const nuevo = await docRef.get();
  const data = nuevo.data();
  delete data.nombreNormalizado;
  return { id: nuevo.id, ...data };
};

// Actualizar producto con protección contra duplicado
export const updateProduct = async (id, datosActualizados) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) throw new Error('Producto no encontrado');

  const original = doc.data();
  delete original.updatedAt;

  let nombreNormalizado = original.nombre.trim().toLowerCase();

  if (datosActualizados.nombre && datosActualizados.nombre.trim().toLowerCase() !== nombreNormalizado) {
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

// Eliminar producto
export const deleteProduct = async (id) => {
  await collection.doc(id).delete();
  return { mensaje: 'Producto eliminado correctamente' };
};