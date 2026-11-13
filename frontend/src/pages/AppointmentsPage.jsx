import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentForm } from '../components/AppointmentForm';
import { useAuth } from '../hooks/useAuth';
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from '../services/appointmentService';
import { getServices } from '../services/serviceService';

const STATUS_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'cancelado', label: 'Cancelados' },
];

export function AppointmentsPage() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('servicio') || '';

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [appointmentsData, servicesData] = await Promise.all([
        getAppointments(),
        getServices(),
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los turnos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'todos') return appointments;
    return appointments.filter((item) => item.estado === statusFilter);
  }, [appointments, statusFilter]);

  async function handleCreateAppointment(payload) {
    setSubmitting(true);
    setFeedback('');
    setError('');
    try {
      const created = await createAppointment(payload);
      setAppointments((prev) => [created, ...prev]);
      setFeedback('Turno reservado correctamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleChangeStatus(id, estado) {
    setBusyId(id);
    setError('');
    setFeedback('');
    try {
      const updated = await updateAppointment(id, { estado });
      setAppointments((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      setSlotsRefreshKey((prev) => prev + 1);
      setFeedback(`El turno pasó a estado "${estado}".`);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado del turno.');
    } finally {
      setBusyId('');
    }
  }

  async function handleDeleteAppointment(appointment) {
    const confirmed = window.confirm(
      '¿Seguro que querés eliminar este turno de forma permanente?'
    );
    if (!confirmed) return;

    setBusyId(appointment._id);
    setError('');
    setFeedback('');
    try {
      await deleteAppointment(appointment._id);
      setAppointments((prev) => prev.filter((item) => item._id !== appointment._id));
      setSlotsRefreshKey((prev) => prev + 1);
      setFeedback('Turno eliminado correctamente.');
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el turno.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <main className="container page-content">
      <section className="page-header">
        <div>
          <h1>{isAdmin ? 'Gestión de Turnos' : 'Mis Turnos'}</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Administrá las reservas de todos los clientes: confirmá, cancelá o eliminá turnos.'
              : 'Reservá un nuevo horario o consultá el estado de tus próximos turnos.'}
          </p>
        </div>
      </section>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={feedback} onClose={() => setFeedback('')} />

      <div className="appointments-layout">
        <aside className="appointments-sidebar">
          <AppointmentForm
            services={services}
            preselectedServiceId={preselectedServiceId}
            onSubmit={handleCreateAppointment}
            submitting={submitting}
            refreshTrigger={slotsRefreshKey}
          />
        </aside>

        <section className="appointments-list-section" aria-label="Listado de turnos">
          <div className="filter-tabs" role="tablist" aria-label="Filtrar por estado">
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.key}
                className={`filter-tab ${statusFilter === tab.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">Cargando turnos...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-state">
              {appointments.length === 0
                ? 'Todavía no hay turnos registrados.'
                : 'No hay turnos con el estado seleccionado.'}
            </div>
          ) : (
            <div className="appointments-stack">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  isAdmin={isAdmin}
                  onChangeStatus={handleChangeStatus}
                  onDelete={handleDeleteAppointment}
                  busyId={busyId}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
