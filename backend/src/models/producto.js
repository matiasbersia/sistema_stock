const bdd = require('../config/bdd');
const categoriaProducto = require('./categoria_producto');



const producto = {

    verproducto: (callback) => {
    bdd.query(
        'SELECT * FROM producto WHERE activo = 1',
        callback
    );
},

verproductoCodigo: (codigo, callback) => {
    bdd.query(
        `SELECT 
        p.id,
            p.codigo, 
            p.nombre, 
            p.marca, 
            p.precio_actual, 
            p.stock, 
            p.vencimiento, 
            c.id AS categoria_id, 
            c.nombre AS categoria_nombre
        FROM producto p
        LEFT JOIN categoria_producto cp ON p.id = cp.id_producto
        LEFT JOIN categoria c ON cp.id_categoria = c.id
        WHERE p.codigo = ? AND p.activo = 1`,
        [codigo],
        (error, results) => {
            if (error) return callback(error, null);

            // Si no hay resultados, devolvemos null
            if (results.length === 0) {
                return callback(null, null);  // Producto no encontrado
            }

            // Procesamos los resultados y agrupamos las categorías
            const producto = results.reduce((acc, row) => {
                if (!acc) {
                    acc = {
                        id: row.id, 
                        codigo: row.codigo,
                        nombre: row.nombre || undefined,
                        marca: row.marca || undefined,
                        precio_actual: row.precio_actual || undefined,
                        stock: row.stock || undefined,
                        vencimiento: row.vencimiento ? row.vencimiento.toISOString().split('T')[0] : undefined,
                        categorias: []
                    };
                }

                // Si hay categoría asociada, la agregamos
                if (row.categoria_id && row.categoria_nombre) {
                    acc.categorias.push({
                        id: row.categoria_id,
                        nombre: row.categoria_nombre
                    });
                }

                return acc;
            }, null);

            // Si no se encontró un producto, devolvemos null
            callback(null, producto || null);
        }
    );
},
restarStock: (codigo, cantidad, callback) => {
    bdd.query(
        `UPDATE producto 
         SET stock = stock - ? 
         WHERE codigo = ? AND activo = 1`,
        [cantidad, codigo],
        callback
    );
}

,
crearproducto: (
  codigo,
  nombre,
  marca,
  precio_actual,
  stock,
  categorias,
  vencimiento,
  callback
) => {
  categorias = categorias ? (Array.isArray(categorias) ? categorias : [categorias]) : [];

  bdd.query(
    `INSERT INTO producto (
        codigo,
        nombre,
        marca,
        precio_actual,
        stock,
        vencimiento,
        activo
     )
     VALUES (?, ?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
        activo = 1,
        stock = stock + IFNULL(VALUES(stock), 0),
        precio_actual = VALUES(precio_actual),
        nombre = VALUES(nombre),
        marca = VALUES(marca),
        vencimiento = VALUES(vencimiento);`,
    [codigo, nombre, marca, precio_actual, stock ?? 0, vencimiento],
    (err, resultadoProducto) => {
      if (err) return callback(err);

      const esNuevo = resultadoProducto.insertId !== 0;

      const obtenerIdProducto = (cb) => {
        if (esNuevo) return cb(null, resultadoProducto.insertId);

        bdd.query(
          'SELECT id FROM producto WHERE codigo = ?',
          [codigo],
          (err, rows) => {
            if (err) return cb(err);
            cb(null, rows[0].id);
          }
        );
      };

      obtenerIdProducto((err, id_producto) => {
        if (err) return callback(err);

        categoriaProducto.borrarPorProducto(id_producto, (err) => {
          if (err) return callback(err);

          categoriaProducto.insertarMultiples(id_producto, categorias, (err) => {
            if (err) return callback(err);

            callback(null, {
              id_producto,
              esNuevo
            });
          });
        });
      });
    }
  );
},




borrarproducto: (codigo, callback) => {
    bdd.query(
        'UPDATE producto SET activo = 0 WHERE codigo = ?',
        [codigo],
        callback
    );
},


    actualizarproducto: (codigo, nombre, marca, precio_actual, stock, id_categoria, vencimiento, callback) => {
        bdd.query(
            'UPDATE producto SET nombre = ?, marca = ?, precio_actual = ?, stock = ?, id_categoria = ?, vencimiento = ? WHERE codigo = ?',
            [nombre, marca, precio_actual, stock, id_categoria, vencimiento,codigo],callback);
    }
    ,
buscarProductos: (filtros, callback) => {
    const { nombre, marca, idCategoria } = filtros;

    // Base de la query
    let sql = `
        SELECT DISTINCT
            p.id,
            p.codigo,
            p.nombre,
            p.marca,
            p.precio_actual,
            p.stock,
            p.vencimiento,
            c.id AS categoria_id,
            c.nombre AS categoria_nombre
        FROM producto p
        LEFT JOIN categoria_producto cp ON cp.id_producto = p.id
        LEFT JOIN categoria c ON cp.id_categoria = c.id
        WHERE p.activo = 1
    `;

    const params = [];

    // Filtros dinámicos
    if (nombre) {
        sql += ` AND p.nombre LIKE ?`;
        params.push(`%${nombre}%`);
    }

    if (marca) {
        sql += ` AND p.marca LIKE ?`;
        params.push(`%${marca}%`);
    }

    if (idCategoria) {
        sql += ` AND c.id = ?`;
        params.push(idCategoria);
    }

    bdd.query(sql, params, (err, results) => {
        if (err) return callback(err);

        // Agrupar categorías por producto
        const productosMap = {};

        results.forEach(row => {
            if (!productosMap[row.id]) {
                productosMap[row.id] = {
                    id: row.id,
                    codigo: row.codigo,
                    nombre: row.nombre,
                    marca: row.marca,
                    precio_actual: row.precio_actual,
                    stock: row.stock,
                    vencimiento: row.vencimiento ? row.vencimiento.toISOString().split('T')[0] : undefined,
                    categorias: []
                };
            }

            if (row.categoria_id && row.categoria_nombre) {
                productosMap[row.id].categorias.push({
                    id: row.categoria_id,
                    nombre: row.categoria_nombre
                });
            }
        });

        callback(null, Object.values(productosMap));
    });
},

// Devuelve todos los productos cuyo stock es 0 o menor
    obtenerProductosSinStock: (callback) => {
        const sql = 'SELECT * FROM producto WHERE stock <= 0 AND activo = 1';
        bdd.query(sql, callback);
    },
    obtenerCantidadActivos: (callback) => {
    const sql = 'SELECT COUNT(*) AS cantidad FROM producto WHERE activo = 1';
    bdd.query(sql, (err, results) => {
        if (err) return callback(err);
        // results[0].cantidad contendrá el número de productos activos
        callback(null, results[0].cantidad);
    });
},
obtenerValorTotalStock: (callback) => {
  const sql = 'SELECT SUM(precio_actual * stock) AS total_stock FROM producto WHERE activo = 1';
  bdd.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].total_stock);
  });
},

}

module.exports = producto;
