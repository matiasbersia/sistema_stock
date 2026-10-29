const historialPrecios = require('../models/historial_precios');

exports.obtenerHistorial = (req, res) => {
  historialPrecios.obtenerHistorial((error, historial) => {
    if (error) return res.status(500).json({ error: 'Error al obtener historial' });
    res.json(historial);
  });
};

exports.obtenerHistorialPorProducto = (req, res) => {
  const { producto_id } = req.params;

  if (!producto_id) return res.status(400).json({ error: 'Falta el ID del producto' });

  historialPrecios.obtenerHistorialPorProducto(producto_id, (error, historial) => {
    if (error) return res.status(500).json({ error: 'Error al obtener historial' });
    res.json(historial);
  });
};
