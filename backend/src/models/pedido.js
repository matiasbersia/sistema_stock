const bdd = require('../config/bdd');

const pedido = {

    // Crear pedido
    crearPedido: (fecha, total, callback) => {
        bdd.query(
            'INSERT INTO pedidos (fecha, total) VALUES (?, ?)',
            [fecha, total],
            callback
        );
    },

    // Guardar productos u otros productos en producto_pedido
    crearProductoPedido: (id_pedido, numero_id, tabla, cantidad, precio_total, callback) => {
        bdd.query(
            `INSERT INTO producto_pedido 
                (id_pedido, numero_id, tabla, cantidad, precio_total)
             VALUES (?, ?, ?, ?, ?)`,
            [id_pedido, numero_id, tabla, cantidad, precio_total],
            callback
        );
    },

    // Ver productos de un pedido
    verProductoPedido: (id_pedido, callback) => {
        bdd.query(
            `SELECT * FROM producto_pedido WHERE id_pedido = ?`,
            [id_pedido],
            callback
        );
    },

    // Obtener info de un otro_producto
    verOtroProductoPorId: (id, callback) => {
        bdd.query(
            `SELECT * FROM otro_producto WHERE id = ?`,
            [id],
            callback
        );
    },
    // Cantidad de ventas del mes
obtenerCantidadVentasMes: (callback) => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM pedidos
        WHERE MONTH(fecha) = MONTH(CURDATE())
          AND YEAR(fecha) = YEAR(CURDATE())
    `;

    bdd.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
    });
},

// Valor total de las ventas del mes
obtenerTotalVentasMes: (callback) => {
    const sql = `
        SELECT COALESCE(SUM(total), 0) AS total
        FROM pedidos
        WHERE MONTH(fecha) = MONTH(CURDATE())
          AND YEAR(fecha) = YEAR(CURDATE())
    `;

    bdd.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
    });
},

    // Ver pedido por ID con detalle
    verPedidoPorId: (id, callback) => {
        const sql = `
            SELECT 
                p.id AS id_pedido,
                p.fecha,
                p.total,

                pp.numero_id,
                pp.tabla,
                pp.cantidad,
                pp.precio_total,

                prod.nombre AS nombre_producto,
                op.nombre AS nombre_otro_producto,
                op.caracteristica,
                op.descripcion

            FROM pedidos p
            LEFT JOIN producto_pedido pp ON pp.id_pedido = p.id
            LEFT JOIN producto prod ON (pp.tabla = 'producto' AND prod.id = pp.numero_id)
            LEFT JOIN otro_producto op ON (pp.tabla = 'otro_producto' AND op.id = pp.numero_id)
            WHERE p.id = ?;
        `;
        bdd.query(sql, [id], callback);
    }

};

module.exports = pedido;
