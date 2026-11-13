import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/servicios" className="brand">
          <span>
            Peluqueria tu Momento
            <small className="brand-sub">Reserva de turnos</small>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Navegación principal">
          <NavLink
            to="/servicios"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Servicios
          </NavLink>
          <NavLink
            to="/turnos"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Turnos
          </NavLink>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-pill">
                <span className="user-name">{user?.nombre}</span>
                <span className={`role-badge role-${user?.rol}`}>{user?.rol}</span>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className="btn btn-primary btn-sm">
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
