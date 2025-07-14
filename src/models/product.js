class Producto {
  constructor({ nombre, precio, categoria, createdAt, updatedAt }) {
    // Validaciones
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria || 'general';
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      categoria: this.categoria,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Producto;