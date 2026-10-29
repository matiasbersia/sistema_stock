
const express = require('express');
const router = express.Router();

const pedidoController = require('../../controllers/pedido');

// Crear venta
router.post('/', pedidoController.crearVenta);

// Historial de pedidos
router.get('/historial-venta', pedidoController.verPedido);

// Estadísticas del mes
router.get('/ventas_mes', pedidoController.verCantidadVentasMes);
router.get('/ventas_mes_valor', pedidoController.verTotalVentasMes);

// Ver pedido por ID (siempre al final)
router.get('/:id', pedidoController.verPedidoPorId);

module.exports = router;

