class Producto {
  constructor({ nombre, precio, categoria }) {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('El nombre es obligatorio y caracteres validos.');
    }

    if (precio === undefined || typeof precio !== 'number' || precio < 0) {
      throw new Error('El precio es obligatorio y debe ser un número positivo.');
    }

    if (categoria && typeof categoria !== 'string') {
      throw new Error('La categoría debe tener, caractere validos.');
    }

    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria || 'general';
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      categoria: this.categoria,
      createdAt: this.createdAt
    };
  }
}

module.exports = Producto;