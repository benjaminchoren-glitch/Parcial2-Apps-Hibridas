const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El cliente es obligatorio']
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'El servicio es obligatorio']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del turno es obligatoria']
  },
  hora: {
    type: String,
    required: [true, 'La franja horaria es obligatoria'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'],
    default: 'pendiente'
  },
  observaciones: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);