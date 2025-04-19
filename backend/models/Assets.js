const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  imagenes: {
    type: [String],
  },
  archivos: {
    type: [String],
  },
  formato: {
    type: String,
  },
  etiquetas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etiqueta'
  }],
  categorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria'
  }],  
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Usuario',
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  descargas: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Asset', assetSchema);