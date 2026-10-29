const bdd = require('../config/bdd');

const otroProducto = {

    verOtroProducto: (callback) => {
        bdd.query('SELECT * FROM otro_producto', callback);
    },

    crearOtroProducto: (nombre, caracteristica, descripcion, precio, callback) => {
    bdd.query(
        'INSERT INTO otro_producto (nombre, caracteristica, descripcion, precio) VALUES (?, ?, ?, ?)',
        [nombre, caracteristica, descripcion, precio],
        callback
    );
},

    borrarOtroProducto: (id, callback) => {
        bdd.query(
            'DELETE FROM otro_producto WHERE id = ?',
            [id],
            callback
        );
    },

    actualizarOtroProducto: (nombre, caracteristica, descripcion, id, callback) => {
        bdd.query(
            'UPDATE otro_producto SET nombre = ?, caracteristica = ?, descripcion = ? WHERE id = ?',
            [nombre, caracteristica, descripcion, id],
            callback
        );
    }

};

module.exports = otroProducto;
