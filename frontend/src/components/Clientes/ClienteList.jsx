import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clientesApi } from "../../api/clientes.api";
import PageLoader from "../shared/PageLoader";

const ClienteList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await clientesApi.getAll();
      setClientes(res.data);
    } catch {
      setError("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    try {
      await clientesApi.remove(id);
      fetchClientes();
    } catch (err) {
      alert(err.response?.data?.error ?? "Error al eliminar el cliente.");
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        <button
          onClick={() => navigate("/admin/clientes/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Nuevo Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No hay clientes registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                {["ID", "Nombre", "Email", "Teléfono", "Motos", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c.motos?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/clientes/${c.id}/edit`)}
                      className="text-sm px-3 py-1 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-sm px-3 py-1 rounded-lg font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClienteList;
