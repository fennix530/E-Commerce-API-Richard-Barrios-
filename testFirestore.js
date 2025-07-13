const db = require('./src/config/firebase'); // ajustá si tu path es distinto

async function test() {
  try {
    const producto = {
      nombre: 'Campera Test',
      precio: 199,
      categoria: 'test',
      createdAt: new Date().toISOString()
    };

    const ref = await db.collection('productos').add(producto);
    console.log('✅ Producto creado con ID:', ref.id);
  } catch (error) {
    console.error('🚨 Error al guardar en Firestore:', error.message);
  }
}

test();