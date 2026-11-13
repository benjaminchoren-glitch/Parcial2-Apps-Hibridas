const Appointment = require('../models/appointmentModel');
const Service = require('../models/serviceModel');

// Convierte "HH:MM" a minutos desde medianoche (ej: "07:30" -> 450)
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convierte minutos a "HH:MM" (ej: 450 -> "07:30")
function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Rango completo del día para evitar problemas de zona horaria con Date en Mongo
function getDayRange(fechaStr) {
  const dateOnly = new Date(fechaStr).toISOString().split('T')[0];
  const start = new Date(`${dateOnly}T00:00:00.000Z`);
  const end = new Date(`${dateOnly}T23:59:59.999Z`);
  return { start, end };
}

// Verifica si un rango [reqStart, reqEnd) entra en el horario laboral
function isWithinWorkingHours(reqStart, reqEnd) {
  const morningStart = 7 * 60;   // 07:00 (420)
  const morningEnd = 12 * 60;    // 12:00 (720)
  const afternoonStart = 14 * 60; // 14:00 (840)
  const afternoonEnd = 20 * 60;   // 20:00 (1200)

  const fitsMorning = reqStart >= morningStart && reqEnd <= morningEnd;
  const fitsAfternoon = reqStart >= afternoonStart && reqEnd <= afternoonEnd;

  return fitsMorning || fitsAfternoon;
}

async function getAvailableSlots(fecha, servicioId) {
  const service = await Service.findById(servicioId);
  if (!service) {
    return { status: 'error', message: 'Servicio no encontrado' };
  }

  const duration = service.duracionMinutos;
  const { start, end } = getDayRange(fecha);

  const existingAppointments = await Appointment.find({
    fecha: { $gte: start, $lte: end },
    estado: { $ne: 'cancelado' }
  }).populate('servicio', 'duracionMinutos');

  const occupiedRanges = existingAppointments
    .filter((app) => app.servicio)
    .map((app) => {
      const appStart = timeToMinutes(app.hora);
      const appEnd = appStart + app.servicio.duracionMinutos;
      return { start: appStart, end: appEnd };
    });

  const blocks = [
    { start: 7 * 60, end: 12 * 60 },   // 07:00 a 12:00
    { start: 14 * 60, end: 20 * 60 }   // 14:00 a 20:00
  ];

  const stepMinutes = 30;
  const availableSlots = [];

  for (const block of blocks) {
    for (let slotStart = block.start; slotStart + duration <= block.end; slotStart += stepMinutes) {
      const slotEnd = slotStart + duration;

      const hasOverlap = occupiedRanges.some(
        (occ) => slotStart < occ.end && slotEnd > occ.start
      );

      if (!hasOverlap) {
        availableSlots.push(minutesToTime(slotStart));
      }
    }
  }

  return { status: 'ok', data: availableSlots };
}

async function getAllAppointments(user) {
  const filter = user.rol === 'admin' ? {} : { cliente: user.sub };

  const appointments = await Appointment.find(filter)
    .populate('cliente', 'nombre email')
    .populate('servicio', 'nombre duracionMinutos precio')
    .sort({ fecha: 1, hora: 1 });

  return { status: 'ok', data: appointments };
}

async function getAppointmentById(id) {
  const appointment = await Appointment.findById(id)
    .populate('cliente', 'nombre email')
    .populate('servicio', 'nombre duracionMinutos precio');

  if (!appointment) {
    return { status: 'error', message: 'Turno no encontrado' };
  }

  return { status: 'ok', data: appointment };
}

async function createAppointment(appointmentData) {
  const { servicio, fecha, hora } = appointmentData;

  const serviceDoc = await Service.findById(servicio);
  if (!serviceDoc) {
    return { status: 'error', message: 'El servicio seleccionado no existe' };
  }

  const reqStart = timeToMinutes(hora);
  const reqEnd = reqStart + serviceDoc.duracionMinutos;

  if (!isWithinWorkingHours(reqStart, reqEnd)) {
    return {
      status: 'error',
      message: 'El horario elegido está fuera de atención (07:00-12:00 / 14:00-20:00) o excede el cierre por la duración del servicio'
    };
  }

  const { start, end } = getDayRange(fecha);
  const existingAppointments = await Appointment.find({
    fecha: { $gte: start, $lte: end },
    estado: { $ne: 'cancelado' }
  }).populate('servicio', 'duracionMinutos');

  const hasOverlap = existingAppointments.some((app) => {
    if (!app.servicio) return false;
    const existStart = timeToMinutes(app.hora);
    const existEnd = existStart + app.servicio.duracionMinutos;
    return reqStart < existEnd && reqEnd > existStart;
  });

  if (hasOverlap) {
    return {
      status: 'error',
      message: 'Ese horario se superpone con otro turno ya reservado'
    };
  }

  const newAppointment = await Appointment.create(appointmentData);
  const populated = await Appointment.findById(newAppointment._id)
    .populate('cliente', 'nombre email')
    .populate('servicio', 'nombre duracionMinutos precio');

  return { status: 'ok', data: populated };
}

async function updateAppointment(id, updateData) {
  const updated = await Appointment.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('cliente', 'nombre email')
    .populate('servicio', 'nombre duracionMinutos precio');

  if (!updated) {
    return { status: 'error', message: 'Turno no encontrado' };
  }

  return { status: 'ok', data: updated };
}

async function deleteAppointment(id) {
  const deleted = await Appointment.findByIdAndDelete(id);
  if (!deleted) {
    return { status: 'error', message: 'Turno no encontrado' };
  }
  return { status: 'ok', message: 'Turno eliminado correctamente' };
}

module.exports = {
  getAvailableSlots,
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};