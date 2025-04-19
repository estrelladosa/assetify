const express = require('express');
const router = express.Router();
const Asset = require('../models/Assets'); 
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
      const asset = await Asset.findById(assetId).populate('etiquetas');
  
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
      const asset = await Asset.findById(assetId).populate('categorias');
  
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
      const assets = await Asset.find({ usuario: userId });
  
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
  
  
module.exports = router;
