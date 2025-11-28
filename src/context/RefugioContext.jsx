import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import { candidatosIniciales } from "../data/candidatos";

const RefugioContext = createContext(null);
export const useRefugio = () => useContext(RefugioContext);

export function RefugioProvider({ children }) {
  const [candidatos, setCandidatos] = useState([]);

  // Ref para mantener el ultimo ID usado
  const ultimoId = useRef(0);

  // Inicializar candidatos
  useEffect(() => {
    setCandidatos(candidatosIniciales);
    // Inicializar ultimo ID
    const maxId = candidatosIniciales.reduce((max, c) => {
      const idNum = Number(c.id);
      return !isNaN(idNum) && idNum > max ? idNum : max;
    }, 0);
    ultimoId.current = maxId;
  }, []);

  useEffect(() => {
    const disponibles = candidatos.filter((c) => !c.adoptado).length;
    document.title = `Refugio (${disponibles} disponibles)`;
  }, [candidatos]);

  // Candidato con ID unico
  const addCandidato = (nuevo) => {
    ultimoId.current += 1; // incrementar ID
    const candidatoConId = { ...nuevo, id: ultimoId.current };
    setCandidatos((prev) => [candidatoConId, ...prev]);
  };

  const toggleAdopcion = (id) =>
    setCandidatos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adoptado: !c.adoptado } : c))
    );

  const removeCandidato = (id) =>
    setCandidatos((prev) => prev.filter((c) => c.id !== id));

  const ctx = useMemo(
    () => ({ candidatos, addCandidato, toggleAdopcion, removeCandidato }),
    [candidatos]
  );

  return (
    <RefugioContext.Provider value={ctx}>{children}</RefugioContext.Provider>
  );
}
