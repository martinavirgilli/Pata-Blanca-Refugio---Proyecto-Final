import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { visitasService, candidatosService } from "../services/api";

export default function NuevaVisitaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidatos, setCandidatos] = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);

  const [form, setForm] = useState({
    candidato: "",
    fecha_visita: "",
    visitante_nombre: "",
    visitante_email: "",
    visitante_telefono: "",
    notas: "",
  });

  useEffect(() => {
    loadCandidatos();
  }, []);

  const loadCandidatos = async () => {
    try {
      setLoadingCandidatos(true);
      const data = await candidatosService.getAll();
      setCandidatos(data);
    } catch (err) {
      setError("Error al cargar candidatos");
    } finally {
      setLoadingCandidatos(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convertir fecha a formato ISO para el backend
      const fechaISO = new Date(form.fecha_visita).toISOString();
      
      await visitasService.create({
        ...form,
        candidato: parseInt(form.candidato),
        fecha_visita: fechaISO,
      });
      navigate("/visitas");
    } catch (err) {
      setError(err.message || "Error al crear la visita");
      setLoading(false);
    }
  };

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Programar Nueva Visita
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-orange-200 shadow-lg rounded-xl p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Candidato *</label>
            {loadingCandidatos ? (
              <div className="text-sm text-gray-600">Cargando candidatos...</div>
            ) : (
              <select
                name="candidato"
                value={form.candidato}
                onChange={handleChange}
                required
                className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecciona un candidato</option>
                {candidatos
                  .filter((c) => !c.adoptado)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} - {c.especie}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <Input
            label="Fecha y Hora de Visita *"
            type="datetime-local"
            value={form.fecha_visita}
            onChange={handleChange}
            name="fecha_visita"
            required
            min={getMinDate()}
          />

          <Input
            label="Nombre del Visitante *"
            value={form.visitante_nombre}
            onChange={handleChange}
            name="visitante_nombre"
            required
          />

          <Input
            label="Email del Visitante *"
            type="email"
            value={form.visitante_email}
            onChange={handleChange}
            name="visitante_email"
            required
          />

          <Input
            label="Teléfono del Visitante"
            type="tel"
            value={form.visitante_telefono}
            onChange={handleChange}
            name="visitante_telefono"
          />

          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
              rows="3"
              placeholder="Notas adicionales sobre la visita..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || loadingCandidatos}>
            {loading ? "Creando..." : "Programar Visita"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

