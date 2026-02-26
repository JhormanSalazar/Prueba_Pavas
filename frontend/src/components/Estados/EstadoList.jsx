import { useState, useEffect, useCallback } from "react";
import { estadosApi } from "../../api/estados.api";
import PageLoader from "../shared/PageLoader";

const STATUS_STYLES = {
  RECIBIDA: "bg-blue-100 text-blue-700",
  DIAGNOSTICO: "bg-purple-100 text-purple-700",
  EN_PROCESO: "bg-yellow-100 text-yellow-700",
  LISTA: "bg-green-100 text-green-700",
  ENTREGADA: "bg-gray-100 text-gray-600",
  CANCELADA: "bg-red-100 text-red-600",
};

const EstadoList = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEstados = useCallback(async () => {
    try {
      setLoading(true);
      const res = await estadosApi.getAll();
      setEstados(res.data);
    } catch {
      setError("No se pudieron cargar los estados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstados();
  }, [fetchEstados]);

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Estados</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
            <tr>
              {["Estado", "Transiciones Permitidas", "Mecánico Puede Asignar"].map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estados.map((e) => (
              <tr
                key={e.name}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      STATUS_STYLES[e.name] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {e.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {e.transitions.length > 0 ? (
                      e.transitions.map((t) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_STYLES[t] ?? "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Estado terminal</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      e.mecanicoAllowed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {e.mecanicoAllowed ? "Sí" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstadoList;
