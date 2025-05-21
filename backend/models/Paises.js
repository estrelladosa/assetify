const mongoose = require('mongoose');
const paisSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Pais', paisSchema);