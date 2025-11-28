import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { candidatosService } from "../services/api";

export default function CandidatoDetailPage() {
  const { id } = useParams();
  const [candidato, setCandidato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCandidato();
  }, [id]);

  const loadCandidato = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await candidatosService.getById(id);
      setCandidato(data);
    } catch (err) {
      setError(err.message || "Error al cargar el candidato");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Cargando...</div>
        </div>
      </Layout>
    );
  }

  if (error || !candidato) {
    return (
      <Layout>
        <Link
          to="/candidatos"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mb-4"
        >
          Volver a candidatos
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "No se encontró el candidato."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link
        to="/candidatos"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mb-4"
      >
        Volver a candidatos
      </Link>
      <div className="flex justify-center">
        <div className="max-w-md w-full bg-orange-200 shadow-lg p-6 rounded-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">{candidato.nombre}</h1>
          <img
            src={candidato.imagen}
            alt={candidato.nombre}
            className="rounded-lg h-60 object-cover mx-auto mb-4"
            onError={(e) => {
              e.target.src = "/images/default.jpg";
            }}
          />
          <p className="mb-2">{candidato.descripcion}</p>
          <p className="text-gray-600">Edad: {candidato.edad} años</p>
          <p className="text-gray-600 mb-4">Especie: {candidato.especie}</p>
        </div>
      </div>
    </Layout>
  );
}
