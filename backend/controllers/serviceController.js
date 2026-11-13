const serviceService = require('../services/serviceService');

async function getServices(req, res) {
  try {
    const result = await serviceService.getAllServices();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener los servicios',
      error: error.message
    });
  }
}

async function getService(req, res) {
  try {
    const { id } = req.params;
    const result = await serviceService.getServiceById(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el servicio',
      error: error.message
    });
  }
}

async function createService(req, res) {
  try {
    const { nombre, descripcion, duracionMinutos, precio } = req.body;

    if (!nombre || duracionMinutos === undefined || precio === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre, duración en minutos y precio son obligatorios'
      });
    }

    if (Number(duracionMinutos) < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'La duración mínima debe ser de al menos 10 minutos'
      });
    }

    if (Number(precio) < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El precio no puede ser negativo'
      });
    }

    const result = await serviceService.createService({
      nombre,
      descripcion,
      duracionMinutos: Number(duracionMinutos),
      precio: Number(precio)
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear el servicio',
      error: error.message
    });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracionMinutos, precio } = req.body;

    if (duracionMinutos !== undefined && Number(duracionMinutos) < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'La duración mínima debe ser de al menos 10 minutos'
      });
    }

    if (precio !== undefined && Number(precio) < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El precio no puede ser negativo'
      });
    }

    const result = await serviceService.updateService(id, {
      nombre,
      descripcion,
      duracionMinutos,
      precio
    });

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el servicio',
      error: error.message
    });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const result = await serviceService.deleteService(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el servicio',
      error: error.message
    });
  }
}

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};