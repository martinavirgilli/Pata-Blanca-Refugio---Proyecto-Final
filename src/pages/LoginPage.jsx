import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Input from "../components/Input";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login"); // "login", "register"
  
  // Estados para login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para registro
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, register, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta a la que redirigir después del login (si venía de una ruta protegida)
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!regUsername || !regEmail || !regPassword) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (regPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const result = await register(regUsername, regEmail, regPassword, regFirstName, regLastName);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Error al registrarse");
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setError("");
    const result = loginAsGuest();
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Acceso al Refugio</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setError("");
            }}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Contenido de Login */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        )}

        {/* Contenido de Registro */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Nombre de usuario"
              type="text"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              required
              placeholder="usuario123"
            />

            <Input
              label="Email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre (opcional)"
                type="text"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                placeholder="Juan"
              />

              <Input
                label="Apellido (opcional)"
                type="text"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                placeholder="Pérez"
              />
            </div>

            <Input
              label="Contraseña"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            {/* Botón de acceso como invitado */}
            <div className="pt-4 border-t">
              <p className="text-center text-gray-600 text-sm mb-3">
                O
              </p>
              <Button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                Acceder como invitado
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}


