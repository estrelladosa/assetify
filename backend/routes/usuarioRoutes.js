const express = require('express');
const Usuario = require('../models/Usuario');
const Asset = require('../models/Assets');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');

const router = express.Router();

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
    const { nombre_usuario, correo, contraseña, pais, descripcion, estilo, seguidores, seguidos, guardados,foto } = req.body;
  
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
      foto,
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
      res.json({ message: 'Inicio de sesión correcto', token,  userId: usuario._id, });
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

  // Si el asset ya estaba guardado en la lista del usuario, lo elimina, sino, lo guarda
  router.put('/:userId/guardados/:assetId', async (req, res) => {
    const { userId, assetId } = req.params;
  
    try {
      const usuario = await Usuario.findById(userId);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      const asset = await Asset.findById(assetId);
      if (!asset) return res.status(404).json({ message: 'Asset no encontrado' });
  
      const yaGuardado = usuario.guardados.includes(assetId);
      let updatedUser;
  
      if (yaGuardado) {
        // Si ya está guardado, lo quitamos
        updatedUser = await Usuario.findByIdAndUpdate(
          userId,
          { $pull: { guardados: assetId } },
          { new: true }
        );
      } else {
        // Si no está, lo añadimos
        updatedUser = await Usuario.findByIdAndUpdate(
          userId,
          { $addToSet: { guardados: assetId } },
          { new: true }
        );
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  //actualizar lista de seguidos de un usuario
  router.put('/:userId/seguidos/:seguidoId', async (req, res) => {
    const { userId, seguidoId } = req.params;
  
    try {
      const usuario = await Usuario.findById(userId);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      const seguidoExiste = await Usuario.findById(seguidoId);
      if (!seguidoExiste) return res.status(404).json({ message: 'Usuario a seguir no encontrado' });
  
      const yaSigue = usuario.seguidos.includes(seguidoId);
      let usuarioActualizado;
  
      if (yaSigue) {
        usuarioActualizado = await Usuario.findByIdAndUpdate(
          userId,
          { $pull: { seguidos: seguidoId } },
          { new: true }
        );
      } else {
        usuarioActualizado = await Usuario.findByIdAndUpdate(
          userId,
          { $addToSet: { seguidos: seguidoId } },
          { new: true }
        );
      }
  
      res.status(200).json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Actualizar lista de seguidores de un usuario
router.put('/:userId/seguidores/:seguidorId', async (req, res) => {
  const { userId, seguidorId } = req.params;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const seguidorExiste = await Usuario.findById(seguidorId);
    if (!seguidorExiste) return res.status(404).json({ message: 'Usuario seguidor no encontrado' });

    const yaEsSeguidor = usuario.seguidores.includes(seguidorId);
    let usuarioActualizado;

    if (yaEsSeguidor) {
      // Si ya es seguidor, lo quitamos
      usuarioActualizado = await Usuario.findByIdAndUpdate(
        userId,
        { $pull: { seguidores: seguidorId } },
        { new: true }
      );
    } else {
      // Si no es seguidor, lo añadimos
      usuarioActualizado = await Usuario.findByIdAndUpdate(
        userId,
        { $addToSet: { seguidores: seguidorId } },
        { new: true }
      );
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar información de un usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre_usuario, correo, pais, foto } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre_usuario, correo, pais, foto },
      { new: true }
    );
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cambiar contraseña de usuario
router.put('/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verifica la contraseña actual
    const esCorrecta = await bcrypt.compare(currentPassword, usuario.contraseña);
    if (!esCorrecta) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

    // Hashea la nueva contraseña y guarda
    usuario.contraseña = newPassword;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;