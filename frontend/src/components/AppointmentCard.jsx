import { APPOINTMENT_STATUS_LABELS, formatDate, formatPrice } from '../utils/formatters';

export function AppointmentCard({
  appointment,
  isAdmin,
  onChangeStatus,
  onDelete,
  busyId,
}) {
  const isBusy = busyId === appointment._id;
  const status = appointment.estado || 'pendiente';
  const service = appointment.servicio;
  const client = appointment.cliente;

  return (
    <article className="card appointment-card">
      <div className="appointment-header">
        <div>
          <h3 className="card-title">{service?.nombre || 'Servicio no disponible'}</h3>
          <p className="appointment-datetime">
            <span>{formatDate(appointment.fecha)}</span>
            <span aria-hidden="true">·</span>
            <span>{appointment.hora} hs</span>
          </p>
        </div>

        <span className={`status-badge status-${status}`}>
          {APPOINTMENT_STATUS_LABELS[status] || status}
        </span>
      </div>

      <div className="appointment-meta">
        {service && (
          <div className="meta-item">
            <span className="meta-label">Detalle</span>
            <span>
              {service.duracionMinutos} min · {formatPrice(service.precio)}
            </span>
          </div>
        )}

        {client && (
          <div className="meta-item">
            <span className="meta-label">Cliente</span>
            <span>
              {client.nombre} ({client.email})
            </span>
          </div>
        )}

        {appointment.observaciones && (
          <div className="meta-item">
            <span className="meta-label">Observaciones</span>
            <span>{appointment.observaciones}</span>
          </div>
        )}
      </div>

      <div className="appointment-actions">
        {isAdmin ? (
          <>
            {status !== 'confirmado' && (
              <button
                type="button"
                className="btn btn-success-ghost btn-sm"
                onClick={() => onChangeStatus(appointment._id, 'confirmado')}
                disabled={isBusy}
              >
                Confirmar
              </button>
            )}
            {status !== 'cancelado' && (
              <button
                type="button"
                className="btn btn-warning-ghost btn-sm"
                onClick={() => onChangeStatus(appointment._id, 'cancelado')}
                disabled={isBusy}
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger-ghost btn-sm"
              onClick={() => onDelete(appointment)}
              disabled={isBusy}
            >
              {isBusy ? 'Procesando...' : 'Eliminar'}
            </button>
          </>
        ) : (
          status !== 'cancelado' && (
            <button
              type="button"
              className="btn btn-danger-ghost btn-sm"
              onClick={() => onChangeStatus(appointment._id, 'cancelado')}
              disabled={isBusy}
            >
              {isBusy ? 'Cancelando...' : 'Cancelar turno'}
            </button>
          )
        )}
      </div>
    </article>
  );
}
