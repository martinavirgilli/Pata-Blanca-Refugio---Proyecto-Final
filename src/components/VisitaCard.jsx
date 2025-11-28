import Button from "./Button";
import Badge from "./Badge";
import { useState } from "react";
import { visitasService } from "../services/api";

export default function VisitaCard({ visita, onDelete, onUpdate }) {
  const [showComentarioForm, setShowComentarioForm] = useState(false);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAgregarComentario = async () => {
    if (!comentario.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await visitasService.agregarComentario(visita.id, comentario);
      setShowComentarioForm(false);
      setComentario("");
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || "Error al agregar comentario");
    } finally {
      setLoading(false);
    }
  };

  const fechaVisita = new Date(visita.fecha_visita);
  const fechaFormateada = fechaVisita.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-orange-200 rounded-xl shadow-md hover:shadow-lg transition p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{visita.visitante_nombre}</h3>
          <p className="text-sm text-gray-600">{visita.visitante_email}</p>
          {visita.visitante_telefono && (
            <p className="text-sm text-gray-600">Tel: {visita.visitante_telefono}</p>
          )}
        </div>
        <Badge text={visita.estado} variant={visita.estado} />
      </div>

      <div className="mb-2">
        <p className="text-sm font-semibold">Candidato:</p>
        <p className="text-sm">{visita.candidato_detalle?.nombre || `ID: ${visita.candidato}`}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm font-semibold">Fecha de visita:</p>
        <p className="text-sm">{fechaFormateada}</p>
      </div>

      {visita.notas && (
        <div className="mb-2">
          <p className="text-sm font-semibold">Notas:</p>
          <p className="text-sm">{visita.notas}</p>
        </div>
      )}

      {visita.comentario_final && (
        <div className="mb-2 bg-green-100 p-2 rounded">
          <p className="text-sm font-semibold">Comentario Final:</p>
          <p className="text-sm">{visita.comentario_final}</p>
        </div>
      )}

      {!visita.comentario_final && !showComentarioForm && (
        <div className="mt-3 flex gap-2">
          <Button
            className="text-sm px-3 py-1"
            onClick={() => setShowComentarioForm(true)}
          >
            Agregar Comentario
          </Button>
          <Button
            className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700"
            onClick={() => {
              if (window.confirm(`¿Eliminar la visita de ${visita.visitante_nombre}?`)) {
                onDelete && onDelete(visita.id);
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      )}

      {showComentarioForm && (
        <div className="mt-3 p-3 bg-white rounded">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
              {error}
            </div>
          )}
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe el comentario final sobre la visita..."
            className="w-full p-2 border rounded mb-2 text-sm"
            rows="3"
          />
          <div className="flex gap-2">
            <Button
              className="text-sm px-3 py-1"
              onClick={handleAgregarComentario}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Comentario"}
            </Button>
            <Button
              className="text-sm px-3 py-1 bg-gray-500 hover:bg-gray-600"
              onClick={() => {
                setShowComentarioForm(false);
                setComentario("");
                setError("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

