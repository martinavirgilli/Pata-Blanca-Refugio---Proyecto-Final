/**
 * Servicio base para realizar peticiones a la API REST
 * Maneja automáticamente el token de autenticación
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Obtiene el token del localStorage
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Realiza una petición fetch con autenticación automática
 * @param {string} endpoint - Ruta del endpoint (ej: '/api/candidatos')
 * @param {object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Agregar token si existe
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Si recibimos 401, el token es inválido o expiró
    if (response.status === 401) {
      const isGuest = localStorage.getItem("isGuest");
      // Solo limpiar y redirigir si no es invitado
      if (!isGuest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }
      // Si es invitado, simplemente lanzar el error sin redirigir
      throw new Error("Esta acción requiere autenticación. Por favor, inicia sesión.");
    }

    // Verificar si la respuesta es HTML (error de Django)
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      const text = await response.text();
      if (text.trim().startsWith("<!DOCTYPE")) {
        throw new Error(`Error del servidor: La API devolvió HTML en lugar de JSON. Verifica que el endpoint ${endpoint} exista y esté funcionando correctamente.`);
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Servicios específicos para candidatos
 */
export const candidatosService = {
  // Obtener todos los candidatos
  getAll: async () => {
    const response = await apiRequest("/api/candidatos/", {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener candidatos");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    // Django REST Framework puede devolver los datos en 'results' si hay paginación
    // o directamente como array
    console.log("Respuesta de API:", data); // Debug
    return Array.isArray(data) ? data : (data.results || data);
  },

  // Obtener un candidato por ID
  getById: async (id) => {
    const response = await apiRequest(`/api/candidatos/${id}/`, {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener el candidato");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  // Crear un nuevo candidato
  create: async (candidato) => {
    const response = await apiRequest("/api/candidatos/", {
      method: "POST",
      body: JSON.stringify(candidato),
    });
    
    if (!response.ok) {
      // Intentar obtener el error en JSON
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al crear candidato");
      } catch (parseError) {
        // Si no es JSON, mostrar el mensaje del servidor
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  // Actualizar un candidato
  update: async (id, candidato) => {
    const response = await apiRequest(`/api/candidatos/${id}`, {
      method: "PUT",
      body: JSON.stringify(candidato),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar candidato");
    }
    
    return response.json();
  },

  // Eliminar un candidato
  delete: async (id) => {
    const response = await apiRequest(`/api/candidatos/${id}/`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al eliminar candidato");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    // Django REST Framework devuelve 204 No Content (sin cuerpo) al eliminar
    // Si hay contenido, lo parseamos, si no, devolvemos un objeto vacío
    if (response.status === 204 || response.status === 200) {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    }
    
    return response.json();
  },

  // Toggle adopción (marcar como adoptado/no adoptado)
  toggleAdopcion: async (id) => {
    const response = await apiRequest(`/api/candidatos/${id}/adoptar/`, {
      method: "PATCH",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al actualizar estado de adopción");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },
};

/**
 * Servicios específicos para adopciones
 */
export const adopcionesService = {
  // Obtener resumen de adopciones
  getResumen: async () => {
    const response = await apiRequest("/api/adopciones/resumen", {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener resumen de adopciones");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  // Obtener historial de adopciones
  getHistorial: async () => {
    const response = await apiRequest("/api/adopciones/historial", {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener historial de adopciones");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },
};

/**
 * Servicios específicos para visitas
 */
export const visitasService = {
  // Obtener todas las visitas futuras
  getAll: async () => {
    const response = await apiRequest("/api/visitas/", {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener visitas");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || data);
  },

  // Obtener una visita por ID
  getById: async (id) => {
    const response = await apiRequest(`/api/visitas/${id}/`, {
      method: "GET",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al obtener la visita");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  // Crear una nueva visita
  create: async (visita) => {
    const response = await apiRequest("/api/visitas/", {
      method: "POST",
      body: JSON.stringify(visita),
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        
        // Django REST Framework devuelve errores de validación en diferentes formatos
        // Puede ser: { "fecha_visita": ["mensaje"] } o { "detail": "mensaje" } o { "error": "mensaje" }
        if (error.fecha_visita) {
          // Error de campo específico (puede ser array o string)
          const mensaje = Array.isArray(error.fecha_visita) 
            ? error.fecha_visita[0] 
            : error.fecha_visita;
          throw new Error(mensaje || "La fecha debe ser futura");
        }
        
        // Buscar otros errores de campo
        const fieldErrors = Object.keys(error).find(key => 
          Array.isArray(error[key]) && error[key].length > 0
        );
        if (fieldErrors) {
          const mensaje = Array.isArray(error[fieldErrors]) 
            ? error[fieldErrors][0] 
            : error[fieldErrors];
          throw new Error(mensaje);
        }
        
        // Errores generales
        throw new Error(error.error || error.message || error.detail || "Error al crear visita");
      } catch (parseError) {
        // Si ya es un Error con mensaje, re-lanzarlo
        if (parseError instanceof Error && parseError.message) {
          throw parseError;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  // Eliminar una visita
  delete: async (id) => {
    const response = await apiRequest(`/api/visitas/${id}/`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al eliminar visita");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    // Manejar respuesta vacía (204)
    if (response.status === 204 || response.status === 200) {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    }
    
    return response.json();
  },

  // Agregar comentario final a una visita
  agregarComentario: async (id, comentario) => {
    const response = await apiRequest(`/api/visitas/${id}/agregar_comentario/`, {
      method: "PATCH",
      body: JSON.stringify({ comentario_final: comentario }),
    });
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || error.detail || "Error al agregar comentario");
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  },
};

