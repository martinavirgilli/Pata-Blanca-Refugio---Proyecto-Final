import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Layout({ children }) {
  const { isAuthenticated, user, logout, isAdmin, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-black-100">
      {/* Header */}
      <header className="bg-refugio-azul text-black px-6 py-4 flex items-center justify-between shadow">
        <h1 className="text-xl font-bold">Refugio Pata Blanca</h1>
        <nav className="flex items-center space-x-4">
          {isAuthenticated() ? (
            <>
              <Link to="/" className="hover:underline">
                Inicio
              </Link>
              <Link to="/candidatos" className="hover:underline">
                Candidatos
              </Link>
              {isAdmin() && (
                <>
                  <Link to="/nuevo" className="hover:underline">
                    Nuevo Candidato
                  </Link>
                  <Link to="/visitas" className="hover:underline">
                    Visitas
                  </Link>
                  <Link to="/nueva-visita" className="hover:underline">
                    Nueva Visita
                  </Link>
                </>
              )}
              {!isGuest() && (
                <Link to="/adopciones" className="hover:underline">
                  Adopciones
                </Link>
              )}
              {user && (
                <span className="text-sm">
                  {isGuest() ? "Invitado" : `Hola, ${user.email || user.name}`}
                </span>
              )}
              <Button onClick={handleLogout} className="px-3 py-1 text-sm">
                {isGuest() ? "Salir" : "Cerrar Sesión"}
              </Button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </header>

      {/* Principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full h-full">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-refugio-azul text-black text-center py-4 text-sm">
        © 2025 Refugio Pata Blanca - Todos los derechos reservados
      </footer>
    </div>
  );
}
