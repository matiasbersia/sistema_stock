const bdd = require('../config/bdd');

const historialMovimientosStock = {

verHistorialMovimientosStock: (callback) => {
    bdd.query(
        `SELECT 
            historial_movimientos_stock.*,
            producto.nombre
        FROM historial_movimientos_stock
        LEFT JOIN entrada_producto
            ON historial_movimientos_stock.id_entrada_producto = entrada_producto.id
        LEFT JOIN producto
            ON entrada_producto.id_producto = producto.id
        ORDER BY historial_movimientos_stock.fecha DESC`,
        callback
    );
},


    crearHistorialMovimientosStock: (id_pedido, id_entrada_producto, estado, fecha, callback) => {
        bdd.query(
            'INSERT INTO historial_movimientos_stock (id_pedido, id_entrada_producto, estado, fecha) VALUES (?, ?, ?, ?)',
            [id_pedido, id_entrada_producto, estado, fecha],
            callback
        );
    },

verCantidadMovimientosMes: (callback) => {
    bdd.query(
        `
        SELECT COUNT(*) AS cantidad
        FROM historial_movimientos_stock
        WHERE MONTH(fecha) = MONTH(CURDATE())
        AND YEAR(fecha) = YEAR(CURDATE())
        `,
        callback
    );
}};


module.exports = historialMovimientosStock;
