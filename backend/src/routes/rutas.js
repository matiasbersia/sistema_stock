const express = require('express');
const router = express.Router();


const categoriaRouter = require('./subRutas/categorias');
router.use('/categorias', categoriaRouter);

const productoRouter = require('./subRutas/productos');
router.use('/productos', productoRouter);

const otroProductoRouter = require('./subRutas/otro_producto');
router.use('/otro_producto', otroProductoRouter);

const pedidosRouter = require('./subRutas/pedidos');
router.use('/pedido', pedidosRouter);



const historialSistemaRouter = require('./subRutas/historial_sistema');
router.use('/historial_sistema', historialSistemaRouter);

const historialMovimientosStockRouter = require('./subRutas/historial_movimientos_stock');
router.use('/historial_movimientos_stock', historialMovimientosStockRouter);

const historialPreciosRouter = require('./subRutas/historial_precios');
router.use('/historial_precios', historialPreciosRouter);

const entradaProductoRouter = require('./subRutas/entrada_producto');
router.use('/entrada_producto', entradaProductoRouter);



const correoController = require('../controllers/resend');
router.get('/notificar-sin-stock', correoController.notificarSinStock);

const productoController = require('../controllers/producto');
router.get('/productos_cantidad', productoController.verCantidadActivos);

router.get('/productos_valor_total', productoController.verValorTotalStock);


module.exports = router;
