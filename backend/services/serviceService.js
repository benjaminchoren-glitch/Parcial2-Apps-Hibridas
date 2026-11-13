const Service = require('../models/serviceModel');

async function getAllServices() {
  const services = await Service.find().sort({ createdAt: -1 });
  return { status: 'ok', data: services };
}

async function getServiceById(id) {
  const service = await Service.findById(id);
  if (!service) {
    return { status: 'error', message: 'Servicio no encontrado' };
  }
  return { status: 'ok', data: service };
}

async function createService(serviceData) {
  const newService = await Service.create(serviceData);
  return { status: 'ok', data: newService };
}

async function updateService(id, updateData) {
  const updatedService = await Service.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    return { status: 'error', message: 'Servicio no encontrado' };
  }

  return { status: 'ok', data: updatedService };
}

async function deleteService(id) {
  const deletedService = await Service.findByIdAndDelete(id);
  if (!deletedService) {
    return { status: 'error', message: 'Servicio no encontrado' };
  }
  return { status: 'ok', message: 'Servicio eliminado correctamente' };
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};