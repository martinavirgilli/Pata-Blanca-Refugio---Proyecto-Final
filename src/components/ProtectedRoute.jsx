import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Componente que protege rutas privadas
 * Permite acceso a usuarios autenticados e invitados
 * Redirige a /login si el usuario no está autenticado ni es invitado
 * Guarda la ruta de origen para redirigir después del login
 */
export default function ProtectedRoute({ children, allowGuest = false }) {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si allowGuest es true, permitir acceso a invitados también
  if (allowGuest && isGuest()) {
    return children;
  }

  if (!isAuthenticated()) {
    // Guardar la ruta actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

