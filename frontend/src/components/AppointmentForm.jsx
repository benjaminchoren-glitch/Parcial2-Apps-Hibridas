import { useCallback, useEffect, useState } from 'react';
import { getAvailableSlots } from '../services/appointmentService';
import { formatPrice } from '../utils/formatters';
import { getTodayISO, validateAppointmentForm } from '../utils/validators';
import { Alert } from './Alert';

export function AppointmentForm({
  services,
  preselectedServiceId,
  onSubmit,
  submitting,
  refreshTrigger = 0,
}) {
  const [formData, setFormData] = useState({
    servicio: preselectedServiceId || '',
    fecha: getTodayISO(),
    hora: '',
    observaciones: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({
        ...prev,
        servicio: preselectedServiceId,
        hora: '',
      }));
    }
  }, [preselectedServiceId]);

  const fetchSlots = useCallback(async (fecha, servicio) => {
    if (!fecha || !servicio || fecha < getTodayISO()) {
      setAvailableSlots([]);
      setSlotsError('');
      return;
    }

    setLoadingSlots(true);
    setSlotsError('');
    try {
      const slots = await getAvailableSlots(fecha, servicio);
      setAvailableSlots(slots);
    } catch (err) {
      setAvailableSlots([]);
      setSlotsError(err.message || 'No se pudieron consultar los horarios disponibles.');
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!formData.fecha || !formData.servicio || formData.fecha < getTodayISO()) {
        setAvailableSlots([]);
        setSlotsError('');
        return;
      }

      setLoadingSlots(true);
      setSlotsError('');
      try {
        const slots = await getAvailableSlots(formData.fecha, formData.servicio);
        if (active) {
          setAvailableSlots(slots);
        }
      } catch (err) {
        if (active) {
          setAvailableSlots([]);
          setSlotsError(err.message || 'No se pudieron consultar los horarios disponibles.');
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [formData.fecha, formData.servicio, refreshTrigger]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'servicio' || name === 'fecha') {
        next.hora = '';
      }
      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'servicio' || name === 'fecha' ? { hora: '' } : {}),
    }));
  }

  function handleSelectSlot(slot) {
    setFormData((prev) => ({ ...prev, hora: slot }));
    if (errors.hora) {
      setErrors((prev) => ({ ...prev, hora: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const validationErrors = validateAppointmentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({
        servicio: formData.servicio,
        fecha: formData.fecha,
        hora: formData.hora,
        observaciones: formData.observaciones.trim(),
      });
      setFormData((prev) => ({
        ...prev,
        hora: '',
        observaciones: '',
      }));
      await fetchSlots(formData.fecha, formData.servicio);
    } catch (err) {
      setSubmitError(err.message || 'No se pudo reservar el turno.');
    }
  }

  const hasSelection = Boolean(formData.servicio && formData.fecha);
  const noSlotsAvailable =
    hasSelection && !loadingSlots && !slotsError && availableSlots.length === 0;

  return (
    <section className="card form-panel">
      <h2 className="panel-title">Reservar un nuevo turno</h2>
      <p className="panel-subtitle">
        Elegí el servicio, la fecha y uno de los horarios disponibles.
      </p>

      <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />

      <form onSubmit={handleSubmit} noValidate className="form-stack">
        <div className="form-group">
          <label htmlFor="turno-servicio">Servicio *</label>
          <select
            id="turno-servicio"
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            disabled={submitting || services.length === 0}
          >
            <option value="">
              {services.length === 0 ? 'No hay servicios disponibles' : 'Seleccioná un servicio...'}
            </option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.nombre} — {service.duracionMinutos} min ({formatPrice(service.precio)})
              </option>
            ))}
          </select>
          {errors.servicio && <span className="field-error">{errors.servicio}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="turno-fecha">Fecha *</label>
          <input
            id="turno-fecha"
            name="fecha"
            type="date"
            min={getTodayISO()}
            value={formData.fecha}
            onChange={handleChange}
            disabled={submitting}
          />
          {errors.fecha && <span className="field-error">{errors.fecha}</span>}
        </div>

        <div className="form-group">
          <label>Horarios disponibles *</label>
          {!hasSelection ? (
            <p className="slots-hint">
              Seleccioná un servicio y una fecha para ver los horarios libres.
            </p>
          ) : loadingSlots ? (
            <p className="slots-hint">Consultando horarios disponibles...</p>
          ) : slotsError ? (
            <Alert type="error" message={slotsError} />
          ) : noSlotsAvailable ? (
            <div className="slots-empty" role="status">
              No hay turnos libres en esa fecha para el servicio elegido. Probá con otro día.
            </div>
          ) : (
            <div className="slots-grid" role="group" aria-label="Horarios disponibles">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`slot-btn ${formData.hora === slot ? 'active' : ''}`}
                  aria-pressed={formData.hora === slot}
                  onClick={() => handleSelectSlot(slot)}
                  disabled={submitting}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
          {errors.hora && <span className="field-error">{errors.hora}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="turno-observaciones">Observaciones (opcional)</label>
          <textarea
            id="turno-observaciones"
            name="observaciones"
            rows={2}
            placeholder="Ej: Preferencia de estilista, aclaraciones sobre el cabello..."
            value={formData.observaciones}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting || loadingSlots || services.length === 0 || noSlotsAvailable}
        >
          {submitting ? 'Reservando...' : 'Confirmar reserva'}
        </button>
      </form>
    </section>
  );
}
