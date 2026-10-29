const producto = require('../models/producto');
const categoriaProducto = require('../models/categoria_producto');
const historialPrecios = require('../models/historial_precios');
const historialStock = require('../models/historial_movimientos_stock');
const historial_sistema = require('../models/historial_sistema');
const entradaProducto = require('../models/entrada_producto'); // 🔥 IMPORTANTE!!


const productoController = {

  // --- VER TODOS LOS PRODUCTOS ---
  verProducto: (req, res) => {
    producto.verproducto((err, resultado) => {
      if (err) return res.status(500).json({ error: 'Error al obtener productos', err });
      res.json(resultado);
    });
  },

  // --- VER PRODUCTO POR CÓDIGO ---
  verProductoCodigo: (req, res) => {
    const { codigo } = req.params;

    producto.verproductoCodigo(codigo, (err, resultado) => {
      if (err) return res.status(500).json({ error: 'Error al buscar producto por código', err });
      if (!resultado) return res.status(404).json({ mensaje: 'No existe un producto con ese código' });

      res.json(resultado);
    });
  },
 restarStock: (req, res) => {
    const codigo = req.params.codigo;
    const { cantidad } = req.body;

    if (!codigo || !cantidad) {
      return res.status(400).json({ msg: "Faltan datos" });
    }

    producto.restarStock(codigo, cantidad, (err) => {
      if (err) return res.status(500).json({ msg: "Error al restar stock", err });

      historial_sistema.crearHistorialSistema(
        "VENTA",
        `Se restaron ${cantidad} unidades del producto ${codigo}`,
        new Date(),
        () => {}
      );

      res.json({ msg: "Stock restado correctamente" });
    });
  }

,
  

  // --- CREAR O ACTUALIZAR PRODUCTO ---


  crearProducto: (req, res) => {

    console.log("🟦 [REQ BODY RECIBIDO]", req.body);

    let { 
      codigo, 
      nombre = null, 
      marca = null, 
      precio_actual = null, 
      stock = 0, 
      categorias = [], 
      vencimiento = null 
    } = req.body;

    console.log("🟦 [VALORES PROCESADOS]", {
      codigo, nombre, marca, precio_actual, stock, categorias, vencimiento
    });

    categorias = Array.isArray(categorias) ? categorias : [categorias];

    if (!codigo) return res.status(400).json({ error: 'El código es obligatorio' });

    console.log("🔵 Buscando producto existente:", codigo);

    producto.verproductoCodigo(codigo, (err, prodExistente) => {
      console.log("🔵 Resultado verproductoCodigo:", err, prodExistente);

      if (err) 
        return res.status(500).json({ error: 'Error al verificar producto existente', err });

      const precio_anterior = prodExistente?.precio_actual ?? null;

      console.log("🟩 Precio anterior:", precio_anterior);

      producto.crearproducto(
        codigo,
        nombre,
        marca,
        precio_actual,
        stock,
        categorias,
        vencimiento,
        (err, resultado) => {

          console.log("🟦 crearproducto() ejecutado:", err, resultado);

          if (err) 
            return res.status(500).json({ error: 'Error al crear/actualizar producto', err });

          const { id_producto, esNuevo } = resultado;

          console.log("🟢 ID PRODUCTO:", id_producto, " | ¿Es nuevo?:", esNuevo);

          // --------------------------------------------
          // 1. Historial de precios
          // --------------------------------------------
          if (precio_actual != null && precio_actual !== precio_anterior) {
            console.log("🟦 Registrando historial de precio...");

            historialPrecios.registrarPrecio(
              id_producto,
              precio_anterior,
              precio_actual,
              (err3) => console.log("🟦 Resultado historialPrecios:", err3)
            );
          }

          // --------------------------------------------
          // 2. Registrar entrada si stock > 0
          // --------------------------------------------
          console.log("🟨 STOCK recibido:", stock);

          if (stock > 0) {
            console.log("🟨 Ejecutando entradaProducto.crearEntrada...");

            entradaProducto.crearEntrada(
              id_producto,
              stock,
              precio_actual,
              new Date(),
              (err4, resultEntrada) => {

                console.log("🟨 Resultado entradaProducto:", err4, resultEntrada);

                if (err4) {
                  console.error("❌ Error guardando entrada_producto:", err4);
                } else {
                  const idEntrada = resultEntrada.insertId;

                  console.log("🟨 ID ENTRADA generado:", idEntrada);

                  historialStock.crearHistorialMovimientosStock(
                    null,
                    idEntrada,
                    'entrada',
                    new Date(),
                    (err5) => console.log("🟥 Resultado historialStock:", err5)
                  );
                }
              }
            );
          } else {
            console.log("🟡 Stock es 0, no se registra entrada");
          }

          // --------------------------------------------
          // 3. Historial del sistema
          // --------------------------------------------
          const accionHistorial = esNuevo ? 'CREAR PRODUCTO' : 'ACTUALIZAR PRODUCTO';
          const mensajeHistorial = esNuevo ? `Producto ${codigo} creado` : `Producto ${codigo} actualizado`;

          console.log("🟩 Registrando historial del sistema...");

          historial_sistema.crearHistorialSistema(
            accionHistorial,
            mensajeHistorial,
            new Date(),
            (err6) => {
              console.log("🟩 Resultado historial del sistema:", err6);

              if (err6) 
                return res.status(500).json({ error: 'Error al guardar historial del sistema', err: err6 });

              console.log("✅ Todo OK. Enviando respuesta al front.");

              res.status(201).json({
                mensaje: 'Producto creado/actualizado correctamente',
                codigo,
                esNuevo,
                categorias
              });
            }
          );
        }
      );
    });
  }


,

  // --- BORRAR PRODUCTO (DESACTIVAR) ---
  borrarProducto: (req, res) => {
    const codigo = String(req.params.codigo);

    producto.borrarproducto(codigo, (err) => {
      if (err) return res.status(500).json({ error: 'Error al borrar producto', err });

      historial_sistema.crearHistorialSistema(
        "BORRAR PRODUCTO",
        `Se desactivó el producto (Código ${codigo})`,
        new Date(),
        () => {}
      );

      res.json({ mensaje: 'Producto desactivado correctamente' });
    });
  },

  // --- ACTUALIZAR PRODUCTO ---
  actualizarProducto: (req, res) => {
    const codigo = req.params.codigo;
    const {
      nombre = null,
      marca = null,
      precio_actual = null,
      stock = null,
      categorias = [],
      vencimiento = null
    } = req.body;

    producto.actualizarproducto(
      codigo,
      nombre,
      marca,
      precio_actual,
      stock,
      categorias,
      vencimiento,
      (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar producto', err });

        // --- Registrar historial de precios si cambia ---
        if (precio_actual != null) {
          producto.verproductoCodigo(codigo, (err2, prodActual) => {
            if (err2) return console.error('Error al obtener producto para historial:', err2);

            const precio_anterior = prodActual?.precio_actual ?? precio_actual;

            historialPrecios.registrarPrecio(
              prodActual.id,
              precio_anterior,
              precio_actual,
              (err3) => {
                if (err3) console.error('Error al registrar historial de precios:', err3);
                else console.log(`Historial de precio registrado para producto ${prodActual.id}: ${precio_anterior} -> ${precio_actual}`);
              }
            );
          });
        }

        historial_sistema.crearHistorialSistema(
          "ACTUALIZAR PRODUCTO",
          `Se actualizó ${nombre} (código ${codigo}), stock ${stock}, precio ${precio_actual}`,
          new Date(),
          () => {}
        );

        res.json({ mensaje: 'Producto actualizado correctamente' });
      }
    );
  },

  // --- BUSCAR PRODUCTOS CON FILTROS ---
  buscarProductos: (req, res) => {
    const { nombre = null, marca = null, idCategoria = null } = req.query;

    const filtros = {
      nombre,
      marca,
      idCategoria: idCategoria ? parseInt(idCategoria) : null
    };

    producto.buscarProductos(filtros, (err, resultados) => {
      if (err) return res.status(500).json({ error: 'Error al buscar productos', err });
      if (!resultados || resultados.length === 0) return res.status(404).json({ mensaje: 'No se encontraron productos con esos filtros' });

      res.json(resultados);
    });
  },

    obtenerProductosSinStock: (callback) => {
    producto.obtenerProductosSinStock(callback);
  },

  verProductoSinStock: (req, res) => {
    producto.obtenerProductosSinStock((err, resultados) => {
      if (err) return res.status(500).json({ error: 'Error al obtener productos sin stock', err });
      if (!resultados || resultados.length === 0) return res.status(404).json({ mensaje: 'No hay productos sin stock' });
      res.json(resultados);
    });
  },
  // --- CANTIDAD DE PRODUCTOS ACTIVOS ---
verCantidadActivos: (req, res) => {
    producto.obtenerCantidadActivos((err, cantidad) => {
        if (err) return res.status(500).json({ error: 'Error al obtener cantidad de productos activos', err });
        res.json({ cantidad }); // devuelve { cantidad: 123 }
    });
},
verValorTotalStock: (req, res) => {
  producto.obtenerValorTotalStock((err, total) => {
    if (err) return res.status(500).json({ error: 'Error al calcular valor total del stock', err });
    res.json({ total }); // devuelve { total: 12345.67 }
  });
}


};



module.exports = productoController;
