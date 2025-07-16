class Producto {
  constructor({ nombre, categoria, precio }) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      categoria: this.categoria,
      precio: this.precio
    };
  }
}

export default Producto;