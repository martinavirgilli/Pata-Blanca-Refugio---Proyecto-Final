import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const isGuest = localStorage.getItem("isGuest");
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Solo establecer token si no es invitado
      if (storedToken && !isGuest) {
        setToken(storedToken);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      
      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password, first_name = '', last_name = '') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, first_name, last_name }),
      });

      // Verificar si la respuesta es HTML (error del servidor)
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE")) {
          throw new Error("Error del servidor: La API devolvió HTML. Verifica que el endpoint /api/auth/register exista y esté funcionando correctamente.");
        }
      }

      if (!response.ok) {
        let errorMessage = "Error al registrarse";
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (parseError) {
          // Si no se puede parsear como JSON, usar el status text
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginAsGuest = () => {
    // Crear un usuario "invitado" sin autenticación real
    const guestUser = {
      id: null,
      email: 'guest@invitado.com',
      username: 'Invitado',
      name: 'Invitado',
      is_staff: false,
      is_superuser: false,
      isGuest: true,
    };
    
    // Guardar como invitado (sin token real)
    localStorage.setItem("user", JSON.stringify(guestUser));
    localStorage.setItem("isGuest", "true");
    
    setUser(guestUser);
    setToken(null); // No hay token para invitados
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    // Los invitados también se consideran "autenticados" para ver contenido público
    return !!token || !!user;
  };

  const isGuest = () => {
    return user && user.isGuest === true;
  };

  const isAdmin = () => {
    return user && !user.isGuest && (user.is_staff || user.is_superuser);
  };

  const value = {
    user,
    token,
    login,
    register,
    loginAsGuest,
    logout,
    isAuthenticated,
    isGuest,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

