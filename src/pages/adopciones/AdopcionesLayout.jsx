import { Outlet, NavLink } from "react-router-dom";
import Layout from "../../components/Layout";

export default function AdopcionesLayout() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-refugio-azul">
          Adopciones
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          <NavLink
            to="/adopciones"
            end
            className={({ isActive }) =>
              `pb-2 text-lg font-medium transition-colors ${
                isActive
                  ? "text-refugio-azul border-b-4 border-refugio-azul"
                  : "text-gray-500 hover:text-refugio-azul"
              }`
            }
          >
            Resumen
          </NavLink>
          <NavLink
            to="/adopciones/historial"
            className={({ isActive }) =>
              `pb-2 text-lg font-medium transition-colors ${
                isActive
                  ? "text-refugio-azul border-b-4 border-refugio-azul"
                  : "text-gray-500 hover:text-refugio-azul"
              }`
            }
          >
            Historial
          </NavLink>
        </div>

        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
