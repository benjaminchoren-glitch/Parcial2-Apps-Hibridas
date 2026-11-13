const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateLoginForm({ email, clave }) {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Ingresá un formato de email válido.';
  }

  if (!clave) {
    errors.clave = 'La contraseña es obligatoria.';
  }

  return errors;
}

export function validateRegisterForm({ nombre, email, clave, rol }) {
  const errors = {};
  if (!nombre.trim() || nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Ingresá un formato de email válido.';
  }

  if (!clave || clave.length < 6) {
    errors.clave = 'La contraseña debe tener al menos 6 caracteres.';
  }

  if (!['cliente', 'admin'].includes(rol)) {
    errors.rol = 'Seleccioná un rol válido.';
  }

  return errors;
}

export function validateServiceForm({ nombre, duracionMinutos, precio }) {
  const errors = {};
  if (!nombre.trim()) {
    errors.nombre = 'El nombre del servicio es obligatorio.';
  }

  const duration = Number(duracionMinutos);
  if (duracionMinutos === '' || Number.isNaN(duration) || duration < 10) {
    errors.duracionMinutos = 'La duración mínima debe ser de al menos 10 minutos.';
  }

  const price = Number(precio);
  if (precio === '' || Number.isNaN(price) || price < 0) {
    errors.precio = 'El precio debe ser un número mayor o igual a 0.';
  }

  return errors;
}

export function validateAppointmentForm({ servicio, fecha, hora }) {
  const errors = {};
  if (!servicio) {
    errors.servicio = 'Seleccioná un servicio del catálogo.';
  }

  if (!fecha) {
    errors.fecha = 'Seleccioná una fecha para el turno.';
  } else if (fecha < getTodayISO()) {
    errors.fecha = 'La fecha del turno no puede ser anterior a hoy.';
  }

  if (!hora) {
    errors.hora = 'Seleccioná un horario para el turno.';
  }

  return errors;
}
