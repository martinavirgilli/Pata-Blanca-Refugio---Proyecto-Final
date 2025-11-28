import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import VisitaCard from "../components/VisitaCard";
import EmptyState from "../components/EmptyState";
import { visitasService } from "../services/api";

export default function VisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVisitas();
  }, []);

  const loadVisitas = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await visitasService.getAll();
      console.log("Visitas cargadas:", data);
      setVisitas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar visitas:", err);
      setError(err.message || "Error al cargar visitas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await visitasService.delete(id);
      await loadVisitas();
    } catch (err) {
      setError(err.message || "Error al eliminar visita");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Cargando visitas...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={loadVisitas}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </Layout>
    );
  }

  if (visitas.length === 0) {
    return (
      <Layout>
        <EmptyState
          title="No hay visitas planificadas"
          description="Aún no se han registrado visitas futuras."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Visitas Planificadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visitas.map((visita) => (
          <VisitaCard
            key={visita.id}
            visita={visita}
            onDelete={handleDelete}
            onUpdate={loadVisitas}
          />
        ))}
      </div>
    </Layout>
  );
}

