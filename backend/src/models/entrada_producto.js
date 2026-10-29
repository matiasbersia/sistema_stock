const bdd = require('../config/bdd');

const entradaProducto = {

    verEntradas: (callback) => {
        bdd.query('SELECT * FROM entrada_producto', callback);
    },

    crearEntrada: (id_producto, cantidad, precio_unitario, fecha, callback) => {
        bdd.query(
            'INSERT INTO entrada_producto (id_producto, cantidad, precio_unitario, fecha) VALUES (?, ?, ?, ?)',
            [id_producto, cantidad, precio_unitario, fecha],
            callback
        );
    },

    obtenerEntradaPorProducto: (id_producto, callback) => {
        bdd.query(
            'SELECT * FROM entrada_producto WHERE id_producto = ?',
            [id_producto],
            callback
        );
    },

    // 🔵 NUEVO: obtener entrada puntual por ID
obtenerEntradaPorId: (id, callback) => {
    bdd.query(
        `SELECT ep.*, p.nombre AS nombre_producto
         FROM entrada_producto ep
         JOIN producto p ON p.id = ep.id_producto
         WHERE ep.id = ?`,
        [id],
        callback
    );
},
obtenerTotalIngresosMes: (callback) => {
    const sql = `
        SELECT SUM(cantidad) AS total
        FROM entrada_producto
        WHERE MONTH(fecha) = MONTH(CURDATE())
          AND YEAR(fecha) = YEAR(CURDATE())
    `;
    bdd.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total || 0); // si no hay registros, devuelve 0
    });
},
obtenerValorIngresosMes: (callback) => {
    const sql = `
        SELECT COALESCE(SUM(cantidad * precio_unitario), 0) AS total
        FROM entrada_producto
        WHERE MONTH(fecha) = MONTH(CURDATE())
          AND YEAR(fecha) = YEAR(CURDATE())
    `;

    bdd.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
    });
}

};

module.exports = entradaProducto;
