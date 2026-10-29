const historialMovimientosStock = require('../models/historial_movimientos_stock');

exports.verHistorialMovimientosStock = (req, res) => {
  historialMovimientosStock.verHistorialMovimientosStock((error, movimientos) => {
    if (error) return res.status(500).json({ error: 'Error al obtener movimientos' });
    res.json(movimientos);
  });
};

exports.crearHistorialMovimientosStock = (req, res) => {
  const { id_pedido, id_entrada_producto, estado, fecha } = req.body;

  if (!estado) return res.status(400).json({ error: 'Datos incompletos' });

  historialMovimientosStock.crearHistorialMovimientosStock(
    id_pedido ?? null,
    id_entrada_producto ?? null,
    estado,
    fecha ?? new Date(),
    (error) => {
      if (error) return res.status(500).json({ error: 'Error al registrar movimiento' });
      res.json({ mensaje: 'Movimiento registrado correctamente' });
    }
  );

};

exports.verCantidadMovimientosMes = (req, res) => {
  historialMovimientosStock.verCantidadMovimientosMes((error, resultados) => {
    if (error) return res.status(500).json({ error: 'Error al obtener la cantidad de movimientos' });
    
    // resultados[0].cantidad viene de la query COUNT(*)
    res.json({ cantidad: resultados[0].cantidad });
  });
};