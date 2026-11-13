import { apiRequest } from './apiClient';

/**
 * Obtiene el catálogo público de servicios.
 */
export async function getServices() {
  const response = await apiRequest('/servicios', { method: 'GET' });
  return response.data || [];
}

/**
 * Crea un nuevo servicio (requiere rol admin).
 */
export async function createService(serviceData) {
  const response = await apiRequest('/servicios', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
  return response.data;
}

/**
 * Actualiza un servicio existente (requiere rol admin).
 */
export async function updateService(id, serviceData) {
  const response = await apiRequest(`/servicios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
  return response.data;
}

/**
 * Elimina un servicio por ID (requiere rol admin).
 */
export async function deleteService(id) {
  return apiRequest(`/servicios/${id}`, {
    method: 'DELETE',
  });
}
