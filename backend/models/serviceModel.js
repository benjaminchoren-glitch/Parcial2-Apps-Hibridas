const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  duracionMinutos: {
    type: Number,
    required: [true, 'La duración estimada es obligatoria'],
    min: 10
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);