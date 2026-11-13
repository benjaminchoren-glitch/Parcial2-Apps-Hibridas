import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '../components/Alert';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceFormModal } from '../components/ServiceFormModal';
import { useAuth } from '../hooks/useAuth';
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from '../services/serviceService';

export function ServicesPage() {
  const { isAdmin } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catálogo de servicios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return services;
    return services.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(term) ||
        item.descripcion?.toLowerCase().includes(term)
    );
  }, [services, searchTerm]);

  function openCreateModal() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEditModal(service) {
    setEditingService(service);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setEditingService(null);
  }

  async function handleSaveService(payload) {
    setSubmitting(true);
    setFeedback('');
    try {
      if (editingService) {
        const updated = await updateService(editingService._id, payload);
        setServices((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setFeedback(`Servicio "${updated.nombre}" actualizado correctamente.`);
      } else {
        const created = await createService(payload);
        setServices((prev) => [...prev, created]);
        setFeedback(`Servicio "${created.nombre}" creado correctamente.`);
      }
      setModalOpen(false);
      setEditingService(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteService(service) {
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar el servicio "${service.nombre}"?`
    );
    if (!confirmed) return;

    setDeletingId(service._id);
    setError('');
    setFeedback('');
    try {
      await deleteService(service._id);
      setServices((prev) => prev.filter((item) => item._id !== service._id));
      setFeedback(`Servicio "${service.nombre}" eliminado correctamente.`);
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el servicio.');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <main className="container page-content">
      <section className="page-header">
        <div>
          <h1>Nuestros Servicios</h1>
          <p className="page-subtitle">
            Explorá tratamientos, cortes y coloración pensados para vos.
          </p>
        </div>

        <div className="page-header-actions">
          <input
            type="search"
            className="search-input"
            placeholder="Buscar servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar servicio"
          />
          {isAdmin && (
            <button type="button" className="btn btn-primary" onClick={openCreateModal}>
              + Nuevo servicio
            </button>
          )}
        </div>
      </section>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={feedback} onClose={() => setFeedback('')} />

      {loading ? (
        <div className="empty-state">Cargando catálogo de servicios...</div>
      ) : filteredServices.length === 0 ? (
        <div className="empty-state">
          {services.length === 0
            ? 'Todavía no hay servicios cargados en el catálogo.'
            : 'No se encontraron servicios que coincidan con tu búsqueda.'}
        </div>
      ) : (
        <section className="cards-grid" aria-label="Listado de servicios">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDeleteService}
              deletingId={deletingId}
            />
          ))}
        </section>
      )}

      <ServiceFormModal
        isOpen={modalOpen}
        initialService={editingService}
        onClose={closeModal}
        onSubmit={handleSaveService}
        submitting={submitting}
      />
    </main>
  );
}
