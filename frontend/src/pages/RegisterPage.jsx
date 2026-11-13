import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { useAuth } from '../hooks/useAuth';
import { validateRegisterForm } from '../utils/validators';

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    clave: '',
    rol: 'cliente',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/turnos" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError('');

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        clave: formData.clave,
        rol: formData.rol,
      });
      navigate('/login', {
        replace: true,
        state: {
          registeredMessage: 'Cuenta creada con éxito. Ya podés iniciar sesión.',
        },
      });
    } catch (err) {
      setApiError(err.message || 'No se pudo completar el registro.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="card auth-card">
        <div className="auth-header">
          <h1>Crear cuenta</h1>
          <p>Registrate para reservar turnos y consultar tu historial.</p>
        </div>

        <Alert type="error" message={apiError} onClose={() => setApiError('')} />

        <form onSubmit={handleSubmit} noValidate className="form-stack">
          <div className="form-group">
            <label htmlFor="reg-nombre">Nombre completo</label>
            <input
              id="reg-nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              placeholder="Ej: Sofía Martínez"
              value={formData.nombre}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="sofia@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-clave">Contraseña</label>
            <input
              id="reg-clave"
              name="clave"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={formData.clave}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.clave && <span className="field-error">{errors.clave}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-rol">Tipo de cuenta</label>
            <select
              id="reg-rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && <span className="field-error">{errors.rol}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </section>
    </main>
  );
}
