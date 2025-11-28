import { useState, useEffect } from "react";
import { adopcionesService } from "../../services/api";

export default function AdopcionesResumen() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResumen();
  }, []);

  const loadResumen = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adopcionesService.getResumen();
      setResumen(data);
    } catch (err) {
      setError(err.message || "Error al cargar el resumen");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-lg">Cargando resumen...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={loadResumen}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="bg-orange-200 shadow-xl rounded-xl p-8 w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-refugio-azul">
          Resumen de Adopciones 🐾
        </h2>
        <div className="space-y-3 text-lg text-gray-700">
          <p>
            <span className="font-semibold">Total candidatos:</span>{" "}
            {resumen?.total || 0}
          </p>
          <p>
            <span className="font-semibold">Adoptados:</span>{" "}
            {resumen?.adoptados || 0}
          </p>
          <p>
            <span className="font-semibold">Disponibles:</span>{" "}
            {resumen?.disponibles || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
