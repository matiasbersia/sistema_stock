const Gmail = require('../models/gmail');
const enviarCorreo = require('../service/resend');
const producto = require('../models/producto');

exports.notificarSinStock = (req, res) => {
    // 1. Obtener el Gmail activo
    Gmail.obtenerActivo((err, results) => {
        if (err) return res.status(500).json({ msg: "Error al obtener Gmail" });

        if (!results.length) {
            return res.status(400).json({ msg: "No hay Gmail configurado en la base de datos" });
        }

        const destino = results[0].gmail;

        // 2. Obtener productos sin stock
        producto.obtenerProductosSinStock((err, productos) => {
            if (err) return res.status(500).json({ msg: "Error al obtener productos sin stock" });

            if (!productos || productos.length === 0) {
                return res.status(404).json({ msg: "No hay productos sin stock" });
            }

            // 3. Lista detallada
            const lista = productos
                .map(p => `• Código: ${p.codigo}   | Nombre: ${p.nombre}   | Marca: ${p.marca}`)
                .join('\n');

            // 4. Cuerpo del correo
            const texto = `Hola,

Se detectaron productos que actualmente no poseen stock. A continuación se detalla la información correspondiente:

${lista}

Saludos,
Sistema de Gestión de Stock`;

            // 5. Enviar correo
            enviarCorreo(destino, "Aviso de productos sin stock", texto)
                .then(() => res.json({ msg: "Correo enviado correctamente" }))
                .catch(() => res.status(500).json({ msg: "Error al enviar correo" }));
        });
    });
};
