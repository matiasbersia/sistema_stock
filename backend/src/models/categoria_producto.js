const bdd = require('../config/bdd');

const categoria_producto = {

  borrarPorProducto: (id_producto, callback) => {
    bdd.query(
      'DELETE FROM categoria_producto WHERE id_producto = ?',
      [id_producto],
      callback
    );
  },

insertarMultiples: (id_producto, categorias, callback) => {
  if (!categorias || categorias.length === 0) {
    return callback(null);
  }

  // Ahora accedemos solo al 'id' de cada categoría
  const valores = categorias.map(categoria => [id_producto, categoria.id]);

  console.log("Valores a insertar:", valores);  // Log para verificar los valores antes de insertar

  bdd.query(
    'INSERT INTO categoria_producto (id_producto, id_categoria) VALUES ?',
    [valores],
    callback
  );
},

  obtenerPorProducto: (id_producto, callback) => {
    bdd.query(
      `SELECT c.id, c.nombre
       FROM categoria_producto
       JOIN categoria c ON c.id = categoria_producto.id_categoria
       WHERE categoria_producto.id_producto = ?`,
      [id_producto],
      callback
    );
  }

};

module.exports = categoria_producto;
