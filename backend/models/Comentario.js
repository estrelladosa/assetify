const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  comentario: { type: String, required: true }
});

module.exports = mongoose.model('Comentario', comentarioSchema);
