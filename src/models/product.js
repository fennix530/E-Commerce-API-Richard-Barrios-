export default class Producto {
  constructor({ nombre, precio, categoria }) {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('El nombre es obligatorio y debe ser texto');
    }
    if (typeof precio === 'undefined') {
      throw new Error('El precio es obligatorio');
    }

    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria || 'Sin especificar';
    this.nombreNormalizado = nombre.trim().toLowerCase();
  }

  toJSON() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      categoria: this.categoria,
      nombreNormalizado: this.nombreNormalizado
    };
  }
}