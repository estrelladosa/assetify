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
  etiquetas: {
    type: [String],
  },
  categorias: {
    type: [String],
  },
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