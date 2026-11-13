import { useEffect, useState } from 'react';
import { validateServiceForm } from '../utils/validators';
import { Alert } from './Alert';

const INITIAL_STATE = {
  nombre: '',
  descripcion: '',
  duracionMinutos: '30',
  precio: '',
};

export function ServiceFormModal({ isOpen, initialService, onClose, onSubmit, submitting }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialService) {
      setFormData({
        nombre: initialService.nombre || '',
        descripcion: initialService.descripcion || '',
        duracionMinutos: String(initialService.duracionMinutos ?? 30),
        precio: String(initialService.precio ?? ''),
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
    setSubmitError('');
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const validationErrors = validateServiceForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        duracionMinutos: Number(formData.duracionMinutos),
        precio: Number(formData.precio),
      });
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar el servicio.');
    }
  }

  const isEditing = Boolean(initialService);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="service-modal-title">
            {isEditing ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />

        <form onSubmit={handleSubmit} noValidate className="form-stack">
          <div className="form-group">
            <label htmlFor="service-nombre">Nombre del servicio *</label>
            <input
              id="service-nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Corte y Brushing"
              value={formData.nombre}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="service-descripcion">Descripción</label>
            <textarea
              id="service-descripcion"
              name="descripcion"
              rows={3}
              placeholder="Breve detalle de lo que incluye el servicio..."
              value={formData.descripcion}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="service-duracion">Duración (minutos) *</label>
              <input
                id="service-duracion"
                name="duracionMinutos"
                type="number"
                min="10"
                step="5"
                value={formData.duracionMinutos}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.duracionMinutos && (
                <span className="field-error">{errors.duracionMinutos}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="service-precio">Precio ($) *</label>
              <input
                id="service-precio"
                name="precio"
                type="number"
                min="0"
                step="100"
                placeholder="15000"
                value={formData.precio}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
