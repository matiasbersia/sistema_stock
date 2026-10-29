const historialSistema = require('../models/historial_sistema');

exports.verHistorialSistema = (req, res) => {
    historialSistema.verHistorialSistema((err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener historial", err });
        res.status(200).json(results);
    });
};

exports.crearHistorialSistema = (req, res) => {
    const { accion, descripcion, fecha } = req.body;

    if (!accion || !descripcion || !fecha) {
        return res.status(400).json({ msg: "Faltan datos (accion, descripcion o fecha)" });
    }

    historialSistema.crearHistorialSistema(accion, descripcion, fecha, (err, results) => {
        if (err) return res.status(500).json({ msg: "Error al crear historial", err });
        res.status(200).json({ msg: "Historial creado correctamente", results });
    });
};
