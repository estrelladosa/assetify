const express = require('express');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre_usuario, correo, contraseña, pais, descripcion, estilo, seguidores, seguidos, guardados } = req.body;
  
    // Validación sencilla de campos obligatorios
    if (!nombre_usuario || !correo || !contraseña) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
  
    const usuario = new Usuario({
      nombre_usuario,
      correo,
      contraseña, // La contraseña ya se ha hasheado antes de ser guardada en el modelo
      pais,
      descripcion,
      estilo,
      seguidores,
      seguidos,
      guardados,
    });
  
    try {
      const nuevoUsuario = await usuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

module.exports = router;
