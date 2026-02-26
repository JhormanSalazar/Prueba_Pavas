import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motosApi } from "../../api/motos.api";
import PageLoader from "../shared/PageLoader";

const MotoList = () => {
  const navigate = useNavigate();
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await motosApi.getAll();
      setMotos(res.data);
    } catch {
      setError("No se pudieron cargar las motos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMotos();
  }, [fetchMotos]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta moto?")) return;

    try {
      await motosApi.remove(id);
      fetchMotos();
    } catch (err) {
      alert(err.response?.data?.error ?? "Error al eliminar la moto.");
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Motos</h1>
        <button
          onClick={() => navigate("/admin/motos/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Nueva Moto
        </button>
      </div>

      {motos.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No hay motos registradas.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                {["ID", "Placa", "Marca", "Modelo", "Cliente", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {motos.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{m.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.placa}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.marca}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.modelo || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {m.client?.name || "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/motos/${m.id}/edit`)}
                      className="text-sm px-3 py-1 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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

export default MotoList;
