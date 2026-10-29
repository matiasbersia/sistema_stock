const otroProducto = require('../models/otro_producto');

// =========================
// VER TODOS
// =========================
exports.verOtroProducto = (req, res) => {

    console.log("📥 [otroProducto] GET -> solicitando lista completa");

    otroProducto.verOtroProducto((err, results) => {
        if (err) {
            console.log("❌ Error al obtener:", err);
            return res.status(500).json({ msg: "Error al obtener los datos", err });
        }

        console.log("📤 [otroProducto] GET -> respuesta enviada:", results);
        res.status(200).json(results);
    });
};

// =========================
// CREAR
// =========================
exports.crearOtroProducto = (req, res) => {
    const { nombre, caracteristica, descripcion, precio } = req.body;

    console.log("📥 [otroProducto] POST -> body recibido:", req.body);

    // Validación
    if (!nombre || precio === undefined || precio === null || precio === "") {
        console.log("⚠️ Faltan datos obligatorios");
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    console.log("➡️ [otroProducto] Llamando al modelo con:", {
        nombre,
        caracteristica: caracteristica || "",
        descripcion: descripcion || "",
        precio
    });

    otroProducto.crearOtroProducto(
        nombre,
        caracteristica || "",
        descripcion || "",
        precio,
        (err, results) => {
            if (err) {
                console.log("❌ Error al crear:", err);
                return res.status(500).json({ msg: "Error al crear el registro", err });
            }

            console.log("📤 [otroProducto] POST -> creado correctamente:", results);

            res.status(200).json({
                msg: "otroProducto creado correctamente",
                results
            });
        }
    );
};

// =========================
// BORRAR
// =========================
exports.borrarOtroProducto = (req, res) => {
    const { id } = req.params;

    console.log(`📥 [otroProducto] DELETE -> id recibido: ${id}`);

    otroProducto.borrarOtroProducto(id, (err, results) => {
        if (err) {
            console.log("❌ Error al borrar:", err);
            return res.status(500).json({ msg: "Error al borrar", err });
        }

        console.log(`📤 [otroProducto] DELETE -> id ${id} borrado`);
        res.status(200).json({ msg: "otroProducto borrado correctamente" });
    });
};

// =========================
// ACTUALIZAR
// =========================
exports.actualizarOtroProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, caracteristica, descripcion, precio } = req.body;

    console.log(`📥 [otroProducto] PUT -> id ${id}, body:`, req.body);

    if (!nombre || precio === undefined) {
        console.log("⚠️ Datos incompletos al actualizar");
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    console.log("➡️ [otroProducto] Llamando al modelo con:", {
        nombre,
        caracteristica,
        descripcion,
        precio,
        id
    });

    otroProducto.actualizarOtroProducto(
        nombre,
        caracteristica,
        descripcion,
        precio,
        id,
        (err, results) => {
            if (err) {
                console.log("❌ Error al actualizar:", err);
                return res.status(500).json({ msg: "Error al actualizar", err });
            }

            console.log(`📤 [otroProducto] PUT -> actualizado correctamente id ${id}`);
            res.status(200).json({ msg: "otroProducto actualizado correctamente" });
        }
    );
};
