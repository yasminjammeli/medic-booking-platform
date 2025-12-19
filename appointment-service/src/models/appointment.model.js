const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
},{ timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
 