import { apiRequest } from './apiClient';

/**
 * Inicia sesión con email y clave.
 * Devuelve { status: 'ok', token, user }.
 */
export async function loginUser({ email, clave }) {
  return apiRequest('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, clave }),
  });
}

/**
 * Registra un nuevo usuario (cliente o admin).
 * Devuelve { status: 'ok', data }.
 */
export async function registerUser({ nombre, email, clave, rol }) {
  return apiRequest('/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, clave, rol }),
  });
}
