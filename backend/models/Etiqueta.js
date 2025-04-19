const mongoose = require('mongoose');

const etiquetaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Etiqueta', etiquetaSchema);
