const express = require('express');
const router = express.Router();

const historialMovimientosStockController = require('../../controllers/historial_movimientos_stock');

router.get('/', historialMovimientosStockController.verHistorialMovimientosStock);
router.post('/', historialMovimientosStockController.crearHistorialMovimientosStock);
router.get('/cantidad', historialMovimientosStockController.verCantidadMovimientosMes);

module.exports = router;
