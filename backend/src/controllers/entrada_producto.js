const entradaProducto = require('../models/entrada_producto');

exports.verEntradas = (req, res) => {
    entradaProducto.verEntradas((err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener entradas", err });
        res.status(200).json(results);
    });
};

exports.crearEntrada = (req, res) => {
    const { id_producto, cantidad, precio_unitario, fecha } = req.body;

    if (!id_producto || !cantidad || !precio_unitario || !fecha) {
        return res.status(400).json({ msg: "Faltan datos (id_producto, cantidad, total o fecha)" });
    }

    entradaProducto.crearEntrada(id_producto, cantidad, precio_unitario, fecha, (err, results) => {
        if (err) return res.status(500).json({ msg: "Error al crear entrada", err });
        res.status(200).json({ msg: "Entrada creada correctamente", results });
    });
};

exports.obtenerEntradaPorProducto = (req, res) => {
    const { id_producto } = req.params;

    if (!id_producto) {
        return res.status(400).json({ msg: "Falta el ID del producto" });
    }

    entradaProducto.obtenerEntradaPorProducto(id_producto, (err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener entrada", err });
        res.status(200).json(results);
    });
};


exports.obtenerEntradaPorId = (req, res) => {
    const { id } = req.params;

    entradaProducto.obtenerEntradaPorId(id, (err, resultado) => {
        if (err) {
            console.error("❌ Error al obtener entrada:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ error: "Entrada no encontrada" });
        }

        // Ya viene con nombre_producto desde el JOIN
        res.json(resultado[0]);
    });

    
};
exports.verTotalIngresosMes = (req, res) => {
    entradaProducto.obtenerTotalIngresosMes((err, total) => {
        if (err) return res.status(500).json({ error: 'Error al obtener total de ingresos del mes', err });
        res.json({ total });
    });
};

exports.verValorIngresosMes = (req, res) => {
    entradaProducto.obtenerValorIngresosMes((err, total) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener el valor de los ingresos del mes'
            });
        }

        res.json({ total });
    });
};