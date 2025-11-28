import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { candidatosService } from "../services/api";

export default function CandidatosPage() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCandidatos();
  }, []);

  const loadCandidatos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await candidatosService.getAll();
      console.log("Candidatos cargados:", data); // Debug
      setCandidatos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar candidatos:", err); // Debug
      setError(err.message || "Error al cargar candidatos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdopcion = async (id) => {
    try {
      await candidatosService.toggleAdopcion(id);
      // Recargar la lista después de actualizar
      await loadCandidatos();
    } catch (err) {
      console.error("Error al actualizar adopción:", err);
      setError(err.message || "Error al actualizar estado de adopción");
    }
  };

  const handleDelete = async (id) => {
    try {
      await candidatosService.delete(id);
      // Recargar la lista después de eliminar
      await loadCandidatos();
    } catch (err) {
      console.error("Error al eliminar candidato:", err);
      setError(err.message || "Error al eliminar candidato");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Cargando candidatos...</div>
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
          onClick={loadCandidatos}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </Layout>
    );
  }

  if (candidatos.length === 0) {
    return (
      <Layout>
        <EmptyState
          title="No hay candidatos"
          description="Aún no se han registrado candidatos para adopción."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Candidatos</h1>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {candidatos.map((c) => (
          <Card
            key={c.id}
            candidato={c}
            onToggle={handleToggleAdopcion}
            onDelete={handleDelete}
            className="break-inside-avoid mb-4"
          />
        ))}
      </div>
    </Layout>
  );
}