const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre_usuario: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
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

usuarioSchema.pre('save', async function(next) {
  if (this.isModified('contraseña')) {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
  }
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);