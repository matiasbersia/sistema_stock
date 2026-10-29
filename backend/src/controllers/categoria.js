const categoria = require('../models/categoria');


exports.crearCategoria = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  categoria.crearCategoria(nombre, (err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Error del servidor", err });
    }
    res.status(200).json({ msg: "Categoría creada correctamente", results });
  });
};

exports.verCategoria = (req, res) => {
  categoria.verCategoria((err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Error del servidor", err });
    }
    res.status(200).json(results);
  });
};

exports.borrarCategoria = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Falta el id de la categoría" });
  }

  categoria.borrarCategoria(id, (err, results) => {
    if (err) {
      console.error("Error al borrar categoría en DB:", err);
      return res.status(500).json({ msg: "Error del servidor", error: err });
    }

    if (!results || results.affectedRows === 0) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.status(200).json({ msg: "Categoría eliminada correctamente" });
  });
};



exports.actualizarCategoria = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || !id) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  categoria.actualizarCategoria(nombre, id, (err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Error del servidor", err });
    }
    res.status(200).json({ msg: "Categoría actualizada correctamente", results });
  });
};
