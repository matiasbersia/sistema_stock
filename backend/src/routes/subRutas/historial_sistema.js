const express = require('express');
const router = express.Router();

const historialSistemaController = require('../../controllers/historial_sistema');

router.get('/', historialSistemaController.verHistorialSistema);
router.post('/', historialSistemaController.crearHistorialSistema);

module.exports = router;
