const express = require('express');
const router = express.Router();

const productoController = require('../../controllers/producto');


router.post('/', productoController.crearProducto);
router.get('/', productoController.verProducto);
router.get('/buscar', productoController.buscarProductos);
router.get('/sin-stock', productoController.verProductoSinStock);

router.get('/:codigo', productoController.verProductoCodigo);
router.delete('/:codigo', productoController.borrarProducto);
router.put('/:codigo', productoController.actualizarProducto);



module.exports = router;
