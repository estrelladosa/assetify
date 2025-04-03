const express = require('express');
const Usuario = require('../models/Usuario');
const Asset = require('../models/Assets');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
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

  // Ruta para obtener los assets guardados por un usuario
  router.get('/:userId/guardados', async (req, res) => {
    const { userId } = req.params; // Obtiene el ID del usuario desde los parámetros de la ruta

    try {
        // Buscar al usuario en la base de datos usando el userId
        const usuario = await Usuario.findById(userId).populate('guardados'); 

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' }); // Si no se encuentra el usuario, devolver 404
        }

        // Los assets guardados están en el array `guardados` del usuario
        // Si guardados contiene IDs de assets, `populate` los convierte en documentos completos
        res.status(200).json(usuario.guardados); // Devuelve los assets guardados en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // En caso de error en la consulta
    }
  });

  router.put('/:userId/guardados/:assetId', async (req, res) => {
    const { userId, assetId } = req.params; // Obtener el userId y assetId desde los parámetros de la URL
    console.log(`userId: ${userId}, assetId: ${assetId}`);
    try {
        // Verifica si el usuario existe
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verifica si el asset existe
        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset no encontrado' });
        }

        
        // Usamos $addToSet para evitar duplicados en el array 'guardados'
        const updatedUser = await Usuario.findByIdAndUpdate(
            userId,
            { $addToSet: { guardados: assetId } }, // Añadir el asset al array 'guardados'
            { new: true } // Esto devolverá el documento actualizado
        );

        // Responder con el usuario actualizado
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });


module.exports = router;