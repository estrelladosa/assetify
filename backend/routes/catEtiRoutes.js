const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const Etiqueta = require('../models/Etiqueta');

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/etiquetas', async (req, res) => {
  try {
    const etiquetas = await Etiqueta.find();
    res.json(etiquetas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
