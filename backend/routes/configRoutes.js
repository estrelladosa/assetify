const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Modelo de configuración
const Config = mongoose.model('Config', new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tema: {
    type: Number,
    default: 2 // 1=light, 2=dark, 3=superDark
  },
  fondo: {
    type: String,
    default: "fondo1.jpg"
  },
  colorhf: {
    type: String,
    default: "#1a1a1a"
  },
  tamFuente: {
    type: Number,
    default: 18 // tamaño en píxeles
  },
  fuente: {
    type: Number,
    default: 1 // 1=Roboto, 2=Open Sans, etc.
  },
  altoContraste: {
    type: Boolean,
    default: false
  },
  recomendacion: {
    type: [String],
    default: []
  }
}));

// Middleware para verificar token y extraer usuarioId
const verifyToken = async (req, res, next) => {
  try {
    // El middleware auth ya verifica el token y pone el usuario en req.user
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    // Verificar autenticación
    req.user = await auth.verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Obtener configuración del usuario
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    // Verificar que el usuario solo acceda a su propia configuración
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No estás autorizado a acceder a esta configuración' });
    }

    const config = await Config.findOne({ usuarioId: req.params.userId });
    
    if (!config) {
      // Si no existe, crear una configuración predeterminada
      const defaultConfig = new Config({
        usuarioId: req.params.userId,
        tema: 2, // dark
        fondo: "fondo1.jpg",
        colorhf: "#1a1a1a",
        tamFuente: 18, // mediano
        fuente: 1, // Roboto
        altoContraste: false,
        recomendacion: []
      });
      
      await defaultConfig.save();
      return res.json(defaultConfig);
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

// Guardar o actualizar configuración
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { usuarioId, tema, fondo, colorhf, tamFuente, fuente, altoContraste, recomendacion } = req.body;
    
    // Verificar que el usuario solo modifique su propia configuración
    if (usuarioId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No estás autorizado a modificar esta configuración' });
    }
    
    // Validaciones básicas
    if (!tema || !fondo || !colorhf || !tamFuente || fuente === undefined || altoContraste === undefined) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    // Buscar si ya existe configuración para este usuario
    let config = await Config.findOne({ usuarioId });
    
    if (config) {
      // Actualizar configuración existente
      config.tema = tema;
      config.fondo = fondo;
      config.colorhf = colorhf;
      config.tamFuente = tamFuente;
      config.fuente = fuente;
      config.altoContraste = altoContraste;
      config.recomendacion = recomendacion || [];
      
      await config.save();
    } else {
      // Crear nueva configuración
      config = new Config({
        usuarioId,
        tema,
        fondo,
        colorhf,
        tamFuente,
        fuente, 
        altoContraste,
        recomendacion: recomendacion || []
      });
      
      await config.save();
    }
    
    res.status(200).json({ message: 'Configuración guardada correctamente', config });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ error: 'Error al guardar la configuración' });
  }
});

// Verificar estado de autenticación y devolver ID de usuario
router.get('/auth/verify', verifyToken, (req, res) => {
  res.json({ isValid: true, userId: req.user._id });
});

module.exports = router;