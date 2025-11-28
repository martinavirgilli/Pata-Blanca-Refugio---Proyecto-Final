import Button from "./Button";
import Badge from "./Badge";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Card({ candidato, onToggle, onDelete, className }) {
  const { isAdmin } = useAuth();
  const userIsAdmin = isAdmin();

  return (
    <div className={`bg-orange-200 rounded-xl shadow-md hover:shadow-lg transition p-3 flex flex-col items-center break-inside-avoid mb-4 ${className || ''}`}>
      <div className="w-full overflow-hidden rounded-lg mb-2">
        {candidato.imagen ? (
          <img
            src={candidato.imagen}
            alt={candidato.nombre}
            className="w-full h-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
      </div>
      <h2 className="text-lg font-bold text-gray-800">{candidato.nombre}</h2>
      <p className="text-sm text-black text-center mb-2">{candidato.descripcion}</p>
      <Badge text={candidato.especie} />
      <div className="mt-2 flex gap-1 flex-wrap justify-center">
        <Link to={`/candidatos/${candidato.id}`}>
          <Button className="text-sm px-3 py-1">Ver detalle</Button>
        </Link>
        {userIsAdmin && (
          <>
            <Button 
              className="text-sm px-3 py-1" 
              onClick={() => onToggle && onToggle(candidato.id)}
            >
              {candidato.adoptado ? "Revertir" : "Adoptar"}
            </Button>
            {onDelete && (
              <Button
                className="text-sm px-3 py-1"
                onClick={() => {
                  if (window.confirm(`¿Seguro que quieres eliminar a ${candidato.nombre}?`)) {
                    onDelete(candidato.id);
                  }
                }}
              >
                Eliminar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
