const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

export const TOKEN_STORAGE_KEY = 'peluqueria_token';
export const USER_STORAGE_KEY = 'peluqueria_user';

/**
 * Realiza peticiones HTTP con fetch nativo hacia la API del backend.
 * Adjunta automáticamente el token JWT si existe en localStorage y
 * normaliza los errores bajo el contrato { status: 'error', message }.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté activo.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.status === 'error') {
    const error = new Error(payload?.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return payload;
}
