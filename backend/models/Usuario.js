const mongoose = require('mongoose');

// Definir el esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre_usuario: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  pais: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pais',
  },
  descripcion: {
    type: String,
  },
  estilo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estilo',
  },
  seguidores: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Usuario',
  },
  seguidos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Usuario',
  },
  guardados: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Asset',
  },
});

module.exports = mongoose.model('Usuario', usuarioSchema);
