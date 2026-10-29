const bdd = require('../config/bdd');


const categoria = {

    verCategoria: (callback) => {
        bdd.query(
            'select * from categoria',callback);
    },
    crearCategoria: (nombre, callback) => {
        bdd.query(
            'INSERT INTO categoria (nombre) VALUES (?)',
            [nombre],callback);
    },
    borrarCategoria: (id, callback) => {
        bdd.query(
            'DELETE FROM categoria WHERE id = ? ',
            [id],callback);
    },
    actualizarCategoria: (nombre,id, callback) => {
        bdd.query(
            'UPDATE categoria SET nombre = ? WHERE id = ? ',
            [nombre,id],callback);
    }
    

}



module.exports = categoria;
