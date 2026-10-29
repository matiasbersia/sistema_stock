const pedido = require('../models/pedido');
const producto = require('../models/producto');
const historialStock = require('../models/historial_movimientos_stock');
const otroProducto = require('../models/otro_producto');

// ================================
// VER TODOS LOS PEDIDOS
// ================================
exports.verPedido = (req, res) => {
    pedido.verPedido((err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener pedidos", err });
        res.status(200).json(results);
    });
};

// ================================
// CREAR VENTA
// ================================
exports.crearVenta = (req, res) => {
    const { fecha, total, productos = [], otros_productos = [] } = req.body;

    console.log("[START] crearVenta");
    console.log("[INFO] Datos recibidos:", { fecha, total, productos, otros_productos });

    if (!total || (!productos.length && !otros_productos.length)) {
        console.log("[ERROR] Faltan datos de la venta");
        return res.status(400).json({ msg: "Faltan datos de la venta" });
    }

    const fechaPedido = fecha || new Date();
    console.log("[INFO] Fecha del pedido:", fechaPedido);

    pedido.crearPedido(fechaPedido, total, async (err, resultPedido) => {
        if (err) {
            console.error("[ERROR] No se pudo crear pedido:", err);
            return res.status(500).json({ msg: "Error al crear pedido", err });
        }

        const id_pedido = resultPedido.insertId;
        console.log("[INFO] Pedido creado con ID:", id_pedido);

        const guardados = [];

        const crearProductoPedidoAsync = (id_pedido, numero_id, tabla, cantidad, precio_total) => {
            return new Promise((resolve, reject) => {
                pedido.crearProductoPedido(id_pedido, numero_id, tabla, cantidad, precio_total, (err2) => {
                    if (err2) return reject(err2);
                    resolve();
                });
            });
        };

        try {
            // 1️⃣ Procesar productos normales
            for (const p of productos) {
                if (!p.id) continue;
                const cantidad = Number(p.cantidad) || 0;
                const precio = Number(p.precio_unitario || p.precio_actual || p.precio) || 0;
                const precio_total = cantidad * precio;

                await crearProductoPedidoAsync(id_pedido, p.id, 'producto', cantidad, precio_total);

                await new Promise((resolve, reject) =>
                    producto.restarStock(p.codigo, cantidad, (err3) => err3 ? reject(err3) : resolve())
                );

                guardados.push({
                    tabla: 'producto',
                    id: p.id,
                    nombre: p.nombre,
                    cantidad,
                    precio_total
                });
            }

            // 2️⃣ Procesar otros productos (crear en DB y luego en producto_pedido)
            for (const op of otros_productos) {
                // Crear el otro producto en DB y obtener su id
                const nuevoOtroId = await new Promise((resolve, reject) => {
                    otroProducto.crearOtroProducto(
                        op.nombre,
                        op.caracteristica ?? '',
                        op.descripcion ?? '',
                        op.precio,
                        (err, result) => err ? reject(err) : resolve(result.insertId)
                    );
                });

                const cantidad = Number(op.cantidad) || 1;
                const precio_total = cantidad * Number(op.precio) || 0;

                // Insertar en producto_pedido
                await crearProductoPedidoAsync(id_pedido, nuevoOtroId, 'otro_producto', cantidad, precio_total);

                // Traer datos completos del otro producto para guardarlos en el log
                const datosOtro = await new Promise((resolve, reject) => {
                    pedido.verOtroProductoPorId(nuevoOtroId, (err, results) => err ? reject(err) : resolve(results[0] || {}));
                });

                guardados.push({
                    tabla: 'otro_producto',
                    id: nuevoOtroId,
                    nombre: datosOtro.nombre || '',
                    caracteristica: datosOtro.caracteristica || '',
                    descripcion: datosOtro.descripcion || '',
                    cantidad,
                    precio_total
                });
            }

            // 3️⃣ Registrar historial de stock
            historialStock.crearHistorialMovimientosStock(
                id_pedido,
                null,
                'salida',
                new Date(),
                (err4) => { if (err4) console.error("[ERROR] Error historial_stock:", err4); }
            );

            console.log("[SUCCESS] Venta completada, productos guardados:", guardados);
            res.status(201).json({
                msg: "Venta registrada correctamente",
                id_pedido,
                productos_guardados: guardados
            });

        } catch (error) {
            console.error("[ERROR] Error guardando productos:", error);
            res.status(500).json({ msg: "Error guardando productos del pedido", error });
        }
    });
};


// ================================
// VER PEDIDO POR ID
// ================================
exports.verPedidoPorId = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Falta el ID del pedido" });

    pedido.verPedidoPorId(id, (err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener pedido por ID", err });
        if (results.length === 0) return res.status(404).json({ msg: "No existe un pedido con ese ID" });
        res.status(200).json(results);
    });
};


// ================================
// VER PEDIDO POR ID
// ================================
exports.verPedidoPorId = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: "Falta el ID del pedido" });
    }

    pedido.verPedidoPorId(id, (err, results) => {
        if (err) {
            console.error("Error al obtener pedido por ID:", err);
            return res.status(500).json({ msg: "Error al obtener pedido por ID", err });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: "No existe un pedido con ese ID" });
        }

        res.status(200).json(results);
    });
};
// Cantidad de ventas del mes
exports.verCantidadVentasMes = (req, res) => {
    pedido.obtenerCantidadVentasMes((err, total) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener las ventas del mes'
            });
        }

        res.json({ total });
    });
};

// Valor total de las ventas del mes
exports.verTotalVentasMes = (req, res) => {
    pedido.obtenerTotalVentasMes((err, total) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener el valor de las ventas del mes'
            });
        }

        res.json({ total });
    });
};
