const appointmentService = require('../services/appointmentService');

async function getAvailableSlots(req, res) {
  try {
    const { fecha, servicio } = req.query;

    if (!fecha || !servicio) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe indicar fecha y servicio para consultar horarios disponibles'
      });
    }

    const result = await appointmentService.getAvailableSlots(fecha, servicio);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al consultar disponibilidad',
      error: error.message
    });
  }
}

async function getAppointments(req, res) {
  try {
    const result = await appointmentService.getAllAppointments(req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener los turnos',
      error: error.message
    });
  }
}

async function getAppointment(req, res) {
  try {
    const { id } = req.params;
    const result = await appointmentService.getAppointmentById(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el turno',
      error: error.message
    });
  }
}

async function createAppointment(req, res) {
  try {
    const { servicio, fecha, hora, observaciones } = req.body;

    if (!servicio || !fecha || !hora) {
      return res.status(400).json({
        status: 'error',
        message: 'Servicio, fecha y hora son obligatorios'
      });
    }

    const result = await appointmentService.createAppointment({
      cliente: req.user.sub,
      servicio,
      fecha,
      hora,
      observaciones: observaciones || ''
    });

    if (result.status === 'error') {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al reservar el turno',
      error: error.message
    });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { fecha, hora, estado, observaciones } = req.body;

    const validStates = ['pendiente', 'confirmado', 'cancelado'];
    if (estado && !validStates.includes(estado)) {
      return res.status(400).json({
        status: 'error',
        message: 'Estado inválido. Valores permitidos: pendiente, confirmado, cancelado'
      });
    }

    const updateData = {};
    if (fecha) updateData.fecha = fecha;
    if (hora) updateData.hora = hora;
    if (estado) updateData.estado = estado;
    if (observaciones !== undefined) updateData.observaciones = observaciones;

    const result = await appointmentService.updateAppointment(id, updateData);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el turno',
      error: error.message
    });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const result = await appointmentService.deleteAppointment(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el turno',
      error: error.message
    });
  }
}

module.exports = {
  getAvailableSlots,
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
};