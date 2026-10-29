
const express = require('express');
const router = express.Router();

const entradaController = require('../../controllers/entrada_producto');

router.post('/', entradaController.crearEntrada);

router.get('/ingresos_mes', entradaController.verTotalIngresosMes);

router.get('/ingresos_mes_valor', entradaController.verValorIngresosMes);

// Dejar siempre al final la ruta dinámica
router.get('/:id', entradaController.obtenerEntradaPorId);

module.exports = router;
