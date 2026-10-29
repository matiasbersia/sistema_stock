const express = require('express');
const router = express.Router();

const categoriaController  = require('../../controllers/categoria');

router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.verCategoria);
router.delete('/:id', categoriaController.borrarCategoria);
router.put('/:id', categoriaController.actualizarCategoria);

module.exports = router;
