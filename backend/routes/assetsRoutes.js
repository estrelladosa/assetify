const express = require('express');
const router = express.Router();
const Asset = require('../models/Assets'); 

// Ruta para obtener todos los assets
router.get('/', async (req, res) => {
    try {
        const assets = await Asset.find();  
        res.status(200).json(assets); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

// Ruta para obtener un asset por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;  
    try {
        const asset = await Asset.findById(id); 
        if (!asset) {
            return res.status(404).json({ message: 'Asset no encontrado' }); 
        }
        res.status(200).json(asset); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

module.exports = router;
