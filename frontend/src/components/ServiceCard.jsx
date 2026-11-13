import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';

export function ServiceCard({ service, isAdmin, onEdit, onDelete, deletingId }) {
  const isDeleting = deletingId === service._id;

  return (
    <article className="card service-card">
      <div className="service-card-top">
        <span className="duration-chip">{service.duracionMinutos} min</span>
        <span className="price-tag">{formatPrice(service.precio)}</span>
      </div>

      <h3 className="card-title">{service.nombre}</h3>
      <p className="card-description">
        {service.descripcion?.trim() || 'Atención personalizada en nuestro salón.'}
      </p>

      <div className="card-footer">
        <Link to={`/turnos?servicio=${service._id}`} className="btn btn-secondary btn-sm">
          Reservar turno
        </Link>

        {isAdmin && (
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(service)}
              disabled={isDeleting}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-danger-ghost btn-sm"
              onClick={() => onDelete(service)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
