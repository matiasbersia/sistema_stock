const bdd = require('../config/bdd');
const historialPrecios = {
    registrarPrecio: (id_producto, precio_anterior, precio_nuevo, callback) => {
        const fecha = new Date();
        bdd.query(
            'INSERT INTO historial_precios (id_producto, precio_anterior, precio_nuevo, fecha) VALUES (?, ?, ?, ?)',
            [id_producto, precio_anterior, precio_nuevo, fecha],
            callback
        );
    },

    obtenerHistorial: (callback) => {
        bdd.query(
            `SELECT historial_precios.*, producto.codigo, producto.nombre
             FROM historial_precios
             JOIN producto ON historial_precios.id_producto = producto.id
             ORDER BY historial_precios.fecha DESC`,
            callback
        );
    },

    obtenerHistorialPorProducto: (id_producto, callback) => {
        bdd.query(
            'SELECT * FROM historial_precios WHERE id_producto = ?',
            [id_producto],
            callback
        );
    }
};

module.exports = historialPrecios;
