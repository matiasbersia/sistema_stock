const express = require('express');
const router = express.Router();

const otroProductoController = require('../../controllers/otro_producto');

router.post('/', otroProductoController.crearOtroProducto);
router.get('/', otroProductoController.verOtroProducto);
router.delete('/:id', otroProductoController.borrarOtroProducto);
router.put('/:id', otroProductoController.actualizarOtroProducto);

module.exports = router;
