import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidatosService } from "../services/api";

export default function NuevoCandidatoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    edad: "",
    descripcion: "",
    imagen: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await candidatosService.create({
        ...form,
        edad: parseInt(form.edad) || 0,
        adoptado: false,
      });
      navigate("/candidatos");
    } catch (err) {
      setError(err.message || "Error al crear el candidato");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Registrar Nuevo Candidato
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

          <Input
            label="Nombre"
            value={form.nombre}
            onChange={handleChange}
            name="nombre"
            required
          />
          <Input
            label="Especie"
            value={form.especie}
            onChange={handleChange}
            name="especie"
            required
          />
          <Input
            label="Edad"
            type="number"
            value={form.edad}
            onChange={handleChange}
            name="edad"
            required
          />
          <Input
            label="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            name="descripcion"
            required
          />
          <Input
            label="Imagen (URL)"
            value={form.imagen}
            onChange={handleChange}
            name="imagen"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Agregar Candidato"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
