const express = require('express');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
  
  router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;
  
    try {
      // Buscar al usuario por correo
      const usuario = await Usuario.findOne({ correo });
  
      if (!usuario) {
        return res.status(400).json({ error: 'Correo incorrecto' });
      }
  
    // Comparar la contraseña ingresada con la almacenada en la base de datos (sin hashear)
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
  
      // Generar un token JWT
      const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo }, // Payload
        process.env.JWT_SECRET || 'secreto', // Clave secreta
        { expiresIn: '1h' } // Tiempo de expiración
      );
  
      // Responder con el token y un mensaje de éxito
      res.json({ message: 'Inicio de sesión correcto', token });
    } catch (err) {
      res.status(500).json({ error: 'Error del servidor' });
    }
  });

module.exports = router;