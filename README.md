# Refugio Pata Blanca

Aplicación web full stack para la gestión de un refugio de animales. Permite a los administradores gestionar candidatos a adopción, programar visitas y llevar un registro de adopciones, mientras que los usuarios pueden explorar los animales disponibles y solicitar adopciones.

## Tecnologías utilizadas

### Frontend
- React 19.1.1
- React Router DOM 7.8.2
- Vite 7.1.2
- Tailwind CSS 4.1.12
- ESLint

### Backend
- Django 5.0.1
- Django REST Framework 3.14.0
- djangorestframework-simplejwt 5.3.1 (JWT)
- MySQL 8.0
- Docker & Docker Compose
- Gunicorn (producción)
- WhiteNoise (archivos estáticos)

## Requisitos previos

### Frontend
- Node.js 18 o superior
- npm o yarn

### Backend
- Docker Desktop (recomendado)
- Docker Compose
- O alternativamente: Python 3.11+ y MySQL 8.0

## Instalación y ejecución en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/martinavirgilli/Refugio-Pata-Blanca---Proyecto-Final.git
cd "Proyecto Final"
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Configurar variables de entorno

Ver sección "Configuración (variables de entorno)" más abajo.

### 4. Levantar la API con Docker

```bash
cd src/api
docker-compose up --build
```

En otra terminal, aplicar migraciones y crear superusuario:

```bash
cd src/api
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### 5. Iniciar el servidor de desarrollo del frontend

```bash
# Desde la raíz del proyecto
npm run dev
```

### 6. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

## Configuración (variables de entorno)

### Frontend

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
```

Para producción, cambiar a la URL de la API desplegada.

### Backend

Crear archivo `.env` en `src/api/`:

```env
# Django
SECRET_KEY=tu-secret-key-muy-segura-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos (para Docker Compose)
DB_NAME=refugio_db
DB_USER=refugio_user
DB_PASSWORD=refugio_password
DB_HOST=db
DB_PORT=3306

# JWT (opcional, Django tiene valores por defecto)
JWT_SECRET_KEY=tu-jwt-secret-key
JWT_ALGORITHM=HS256

# Django Superuser (para creación automática)
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@refugio.com
DJANGO_SUPERUSER_PASSWORD=admin123
```

**Importante**: En producción, `DEBUG` debe ser `False` y `SECRET_KEY` debe ser una clave segura y única.

## Estructura del proyecto

```
Proyecto Final/
├── src/
│   ├── api/                    # Backend Django
│   │   ├── apps/               # Aplicaciones Django
│   │   │   ├── auth_app/       # Autenticación JWT
│   │   │   ├── candidatos/     # CRUD de candidatos
│   │   │   ├── adopciones/     # Gestión de adopciones
│   │   │   └── visitas/        # Visitas planificadas
│   │   ├── refugio_api/        # Configuración del proyecto Django
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── Dockerfile.prod     # Para producción
│   │   └── docker-compose.yml
│   ├── components/             # Componentes React reutilizables
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ProtectedAdminRoute.jsx
│   ├── context/                # Contextos de React
│   │   ├── AuthContext.jsx     # Manejo de autenticación
│   │   └── RefugioContext.jsx
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CandidatosPage.jsx
│   │   ├── CandidatoDetailPage.jsx
│   │   ├── NuevoCandidatoPage.jsx
│   │   ├── VisitasPage.jsx
│   │   ├── NuevaVisitaPage.jsx
│   │   └── adopciones/
│   ├── services/               # Servicios de API
│   │   └── api.js              # Cliente API centralizado
│   └── assets/                 # Imágenes y recursos estáticos
├── public/                     # Archivos públicos
├── package.json                # Dependencias frontend
├── vite.config.js
├── Dockerfile.frontend         # Dockerfile para frontend
├── nginx.conf                  # Configuración Nginx
└── railway.json                # Configuración Railway
```

## Deploy en la nube

### Plataforma: Railway

El proyecto está configurado para desplegarse en Railway. La configuración se encuentra en `railway.json`.

**Enlaces** (completar cuando esté desplegado):
- Frontend: [URL del frontend en Railway]
- API: [URL de la API en Railway]

### Proceso de deploy

1. **Conectar repositorio**: Conectar el repositorio de GitHub a Railway
2. **Configurar servicios**: Railway detectará automáticamente los servicios (frontend, backend, base de datos)
3. **Variables de entorno**: Configurar las variables de entorno en Railway para cada servicio
4. **Deploy automático**: Railway desplegará automáticamente en cada push a la rama principal

### Variables de entorno en Railway

Configurar las mismas variables mencionadas en la sección "Configuración", pero con valores de producción:
- `DEBUG=False`
- `ALLOWED_HOSTS` con el dominio de Railway
- Credenciales de base de datos de Railway
- `VITE_API_URL` con la URL de la API en Railway

## Estado del proyecto / Trabajo futuro

### ✅ Implementado

- [x] Autenticación JWT completa (login, logout, protección de rutas)
- [x] API REST en Django con Docker
- [x] CRUD completo de candidatos (solo administradores)
- [x] Sistema de adopciones con historial
- [x] Sistema de visitas planificadas (solo administradores)
- [x] Rutas protegidas y rutas protegidas para administradores
- [x] Manejo de errores y estados de carga
- [x] Validaciones en backend (serializers, fechas futuras)
- [x] Configuración segura (variables de entorno, DEBUG=False en producción)
- [x] Logging configurado en Django
- [x] CORS configurado
- [x] Migraciones de base de datos
- [x] Docker Compose para desarrollo local

### 🔄 Trabajo futuro

- [ ] Tests automatizados (unitarios e integración)
- [ ] CI/CD pipeline completo
- [ ] Mejoras en la UI/UX
- [ ] Sistema de notificaciones
- [ ] Panel de estadísticas avanzado
- [ ] Exportación de reportes
- [ ] Sistema de roles más granular
- [ ] Documentación de API con Swagger/OpenAPI

## Autores / Créditos

**Desarrollado por**: [Tu nombre aquí]

**Rol**: Desarrollador Full Stack

**Proyecto**: Proyecto Final de la Diplomatura en Desarrollo Web Full Stack

---

**Nota**: Este proyecto es parte de una diplomatura académica.
