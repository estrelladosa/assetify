const express = require('express');
const router = express.Router();
const Assets = require('../models/Assets'); 
const Etiqueta = require('../models/Etiqueta');
const Categoria = require('../models/Categoria');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');


// Ruta para obtener todos los assets
router.get('/', async (req, res) => {
    try {
        const assets = await Assets.find().populate('usuario', 'nombre_usuario');  
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
      
      const assets = await Assets.find({ nombre: { $regex: terminoBusqueda, $options: 'i' } }).populate('usuario', 'nombre_usuario');
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
  
      // if (assets.length === 0) {
      //   return res.status(404).json({ message: 'No se encontraron assets para este usuario' });
      // }
  
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

// subir un asset 
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      usuario,
      imagenes,
      archivos,
      formato,
      etiquetas,
      categorias
    } = req.body;

    const nuevoAsset = new Assets({
      nombre,
      descripcion,
      usuario,
      imagenes,
      archivos,
      formato,
      etiquetas,
      categorias,
      likes: [],
      fecha: new Date(),
      descargas: 0
    });

    const assetGuardado = await nuevoAsset.save();
    res.status(201).json(assetGuardado);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un asset por su ID, si pertenece al usuario (No lo he probado
// porque se necesita un middleware para comrpobar que realmente es del usuario)
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Assets.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' });
    }

    // // Asegurarse de que el asset pertenece al usuario autenticado
    // if (asset.usuario.toString() !== req.usuario.id) {
    //   return res.status(403).json({ message: 'No tienes permiso para eliminar este asset' });
    // }

    await Assets.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Asset eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener comentarios de un asset por su ID 
router.get('/comentarios/:assetId', async (req, res) => {
  try {
    const comentarios = await Comentario.find({ asset: req.params.assetId })
      .populate('usuario', 'nombre_usuario'); // Opcional: para traer el nombre del usuario que comentó

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// publicar un comentario
router.post('/comentarios', async (req, res) => {
  try {
    const { usuario, asset, comentario } = req.body;

    const nuevoComentario = new Comentario({
      usuario,
      asset,
      comentario
    });

    const comentarioGuardado = await nuevoComentario.save();
    res.status(201).json(comentarioGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// actualizar lista de likes de un asset
router.put('/:assetId/likes/:userId', async (req, res) => {
  const { assetId, userId } = req.params;

  try {
    const asset = await Assets.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset no encontrado' });

    const usuarioExiste = await Usuario.findById(userId);
    if (!usuarioExiste) return res.status(404).json({ message: 'Usuario no encontrado' });

    const yaDioLike = asset.likes.includes(userId);
    let assetActualizado;

    if (yaDioLike) {
      assetActualizado = await Assets.findByIdAndUpdate(
        assetId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      assetActualizado = await Assets.findByIdAndUpdate(
        assetId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    res.status(200).json(assetActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
