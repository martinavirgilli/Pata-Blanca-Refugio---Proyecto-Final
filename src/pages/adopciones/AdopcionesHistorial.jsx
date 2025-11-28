import { useState, useEffect } from "react";
import { adopcionesService } from "../../services/api";

export default function AdopcionesHistorial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adopcionesService.getHistorial();
      setHistorial(data);
    } catch (err) {
      setError(err.message || "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-lg">Cargando historial...</div>
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
          onClick={loadHistorial}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <p className="text-gray-600 text-lg">
          🐾 No hay adopciones registradas todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="bg-orange-200 shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-refugio-azul">
          Historial de Adopciones
        </h2>
        <ul className="space-y-3 text-lg text-gray-700">
          {historial.map((candidato) => (
            <li
              key={candidato.id}
              className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm flex justify-between items-center"
            >
              <span className="font-medium">{candidato.nombre}</span>
              <span className="text-sm text-blue-500 italic">
                {candidato.especie}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
