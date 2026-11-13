import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { useAuth } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', clave: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const successNotice = location.state?.registeredMessage || '';
  const redirectTo = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/turnos';

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

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login({
        email: formData.email.trim(),
        clave: formData.clave,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="card auth-card">
        <div className="auth-header">
          <h1>Iniciar sesión</h1>
          <p>Accedé con tu cuenta para reservar y gestionar tus turnos.</p>
        </div>

        <Alert type="success" message={successNotice} />
        <Alert type="error" message={apiError} onClose={() => setApiError('')} />

        <form onSubmit={handleSubmit} noValidate className="form-stack">
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-clave">Contraseña</label>
            <input
              id="login-clave"
              name="clave"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={formData.clave}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.clave && <span className="field-error">{errors.clave}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Todavía no tenés cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </section>
    </main>
  );
}
