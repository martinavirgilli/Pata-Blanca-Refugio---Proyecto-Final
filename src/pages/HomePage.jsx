import Layout from "../components/Layout";
import portada from "../assets/images/portada.jpg";

export default function HomePage() {
  return (
    <Layout>
      {/* Portada */}
      <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg mb-6">
        <img
          src={portada}
          alt="Portada del refugio"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Bienvenida */}
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Refugio</h1>
      <p className="mb-4">Gestioná y conocé a los candidatos para adopción.</p>
    </Layout>
  );
}
