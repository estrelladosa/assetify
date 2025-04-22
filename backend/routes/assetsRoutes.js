const express = require('express');
const router = express.Router();
const Assets = require('../models/Assets'); 
const Etiqueta = require('../models/Etiqueta');
const Categoria = require('../models/Categoria');

// Ruta para obtener todos los assets
router.get('/', async (req, res) => {
    try {
        const assets = await Assets.find();  
        res.status(200).json(assets); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

router.get('/search', async (req, res) => {
  const {nombre} = req.query;
  try {
      console.log("Término de búsqueda:", nombre);
      
      // Validar que el término no esté vacío
      if (!nombre || nombre.trim() === '') {
          return res.status(400).json({ message: "El término de búsqueda no puede estar vacío" });
      }
      
      // Escapar caracteres especiales de regex si es necesario
      const terminoBusqueda = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const assets = await Assets.find({ nombre: { $regex: terminoBusqueda, $options: 'i' } });
      console.log("Resultados encontrados:", assets.length);
      
      res.status(200).json(assets); 
  } catch (error) {
      console.error("Error en búsqueda:", error);
      res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener un asset por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;  
    try {
        const asset = await Assets.findById(id); 
        if (!asset) {
            return res.status(404).json({ message: 'Asset no encontrado' }); 
        }
        res.status(200).json(asset); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

// Obtener las etiquetas de un asset
router.get('/:assetId/tags', async (req, res) => {
    const { assetId } = req.params;
  
    try {
      const asset = await Assets.findById(assetId).populate('etiquetas');
  
      if (!asset) {
        return res.status(404).json({ message: 'Asset no encontrado' });
      }
  
      //res.status(200).json(asset.etiquetas); // o asset.etiquetas.map(tag => tag.nombre)
      res.status(200).json(asset.etiquetas.map(etiqueta => etiqueta.nombre)); //para obtener solo el nombre
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener etiquetas', error: error.message });
    }
  });

// Obtener las categorías de un asset
router.get('/:assetId/categorias', async (req, res) => {
    const { assetId } = req.params;
  
    try {
      const asset = await Assets.findById(assetId).populate('categorias');
  
      if (!asset) {
        return res.status(404).json({ message: 'Asset no encontrado' });
      }
  
      //res.status(200).json(asset.categorias); // o asset.categorias.map(cat => cat.nombre)
      res.status(200).json(asset.categorias.map(cat => cat.nombre)); // recoger solo el nombre
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener categorías',
        error: error.message
      });
    }
  });

// Obtener los assets que ha creado un usuario
router.get('/usuario/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Buscar assets por el ObjectId del usuario
      const assets = await Assets.find({ usuario: userId });
  
      if (assets.length === 0) {
        return res.status(404).json({ message: 'No se encontraron assets para este usuario' });
      }
  
      res.status(200).json(assets);
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener los assets del usuario',
        error: error.message
      });
    }
  });


// Ruta para obtener todos los assets
router.get('/', async (req, res) => {
  try {
    const assets = await Assets.find().populate('usuario', 'nombre');
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;