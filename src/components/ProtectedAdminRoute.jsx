import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Componente que protege rutas solo para administradores
 * Redirige a /login si no está autenticado
 * Redirige a / si está autenticado pero no es admin
 */
export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Guardar la ruta actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // Si está autenticado pero no es admin, redirigir al inicio
    return <Navigate to="/" replace />;
  }

  return children;
}

