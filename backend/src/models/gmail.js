const bdd = require('../config/bdd');

const Gmail = {
    obtenerActivo: (callback) => {
        bdd.query('SELECT * FROM gmail LIMIT 1', callback);
    }
};

module.exports = Gmail;
