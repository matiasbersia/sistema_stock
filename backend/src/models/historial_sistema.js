const bdd = require('../config/bdd');

const historialSistema = {

    verHistorialSistema: (callback) => {
        bdd.query('SELECT * FROM historial_sistema ORDER BY fecha DESC', callback);
    },

    crearHistorialSistema: (accion, descripcion, fecha, callback) => {
        bdd.query(
            'INSERT INTO historial_sistema (accion, descripcion, fecha) VALUES (?, ?, ?)',
            [accion, descripcion, fecha],
            callback
        );
    }

};

module.exports = historialSistema;
