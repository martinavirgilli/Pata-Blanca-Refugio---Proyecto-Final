import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RefugioProvider } from "./context/RefugioContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Button from "./components/Button";
import EmptyState from "./components/EmptyState";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CandidatosPage from "./pages/CandidatosPage";
import CandidatoDetailPage from "./pages/CandidatoDetailPage";
import NuevoCandidatoPage from "./pages/NuevoCandidatoPage";
import VisitasPage from "./pages/VisitasPage";
import NuevaVisitaPage from "./pages/NuevaVisitaPage";
import AdopcionesLayout from "./pages/adopciones/AdopcionesLayout";
import AdopcionesResumen from "./pages/adopciones/AdopcionesResumen";
import AdopcionesHistorial from "./pages/adopciones/AdopcionesHistorial";

function App() {
  return (
    <AuthProvider>
      <RefugioProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            
            {/* Rutas protegidas - permiten acceso a invitados */}
            <Route
              path="/candidatos"
              element={
                <ProtectedRoute allowGuest={true}>
                  <CandidatosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidatos/:id"
              element={
                <ProtectedRoute allowGuest={true}>
                  <CandidatoDetailPage />
                </ProtectedRoute>
              }
            />
            {/* Rutas protegidas solo para admin */}
            <Route
              path="/nuevo"
              element={
                <ProtectedAdminRoute>
                  <NuevoCandidatoPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/visitas"
              element={
                <ProtectedAdminRoute>
                  <VisitasPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/nueva-visita"
              element={
                <ProtectedAdminRoute>
                  <NuevaVisitaPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/adopciones"
              element={
                <ProtectedRoute>
                  <AdopcionesLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdopcionesResumen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="historial"
                element={
                  <ProtectedRoute>
                    <AdopcionesHistorial />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* 404 */}
            <Route
              path="*"
              element={
                <Layout>
                  <EmptyState
                    title="404"
                    description="La página no existe."
                    action={
                      <Link to="/">
                        <Button>Ir al inicio</Button>
                      </Link>
                    }
                  />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </RefugioProvider>
    </AuthProvider>
  );
}

export default App;