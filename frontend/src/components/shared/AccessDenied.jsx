import { Link } from "react-router-dom";

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <p className="text-6xl font-bold text-gray-300 mb-4">403</p>
    <h2 className="text-xl font-semibold text-gray-700 mb-2">Acceso Denegado</h2>
    <p className="text-gray-500 mb-6">No tienes permisos para acceder a esta sección.</p>
    <Link
      to="/"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Volver al inicio
    </Link>
  </div>
);

export default AccessDenied;
