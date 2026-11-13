import { apiRequest } from './apiClient';

/**
 * Obtiene el listado de turnos del usuario autenticado (o todos si es admin).
 */
export async function getAppointments() {
  const response = await apiRequest('/turnos', { method: 'GET' });
  return response.data || [];
}

/**
 * Obtiene los horarios disponibles para una fecha y servicio determinados.
 */
export async function getAvailableSlots(fecha, servicioId) {
  const params = new URLSearchParams({ fecha, servicio: servicioId });
  const response = await apiRequest(`/turnos/disponibles?${params.toString()}`, {
    method: 'GET',
  });
  return response.data || [];
}

/**
 * Crea un nuevo turno para el usuario logueado.
 */
export async function createAppointment({ servicio, fecha, hora, observaciones }) {
  const response = await apiRequest('/turnos', {
    method: 'POST',
    body: JSON.stringify({ servicio, fecha, hora, observaciones }),
  });
  return response.data;
}

/**
 * Actualiza un turno (por ejemplo, cambiar estado a pendiente, confirmado o cancelado).
 */
export async function updateAppointment(id, updateData) {
  const response = await apiRequest(`/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
  return response.data;
}

/**
 * Elimina un turno por ID.
 */
export async function deleteAppointment(id) {
  return apiRequest(`/turnos/${id}`, {
    method: 'DELETE',
  });
}
