const express = require('express');
const router = express.Router();

const historialPreciosController = require('../../controllers/historial_precios');

router.get('/', historialPreciosController.obtenerHistorial);
router.get('/:producto_id', historialPreciosController.obtenerHistorialPorProducto);

module.exports = router;
