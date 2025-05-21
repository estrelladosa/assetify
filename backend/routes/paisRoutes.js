// backend/routes/paisRoutes.js
const express = require('express');
const router = express.Router();
const Pais = require('../models/Paises');

router.get('/paises', async (req, res) => {
  try {
    const paises = await Pais.find();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;