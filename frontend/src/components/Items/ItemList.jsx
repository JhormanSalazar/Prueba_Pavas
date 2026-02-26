import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { itemsApi } from "../../api/items.api";
import PageLoader from "../shared/PageLoader";

const TYPE_BADGE = {
  MANO_OBRA: "bg-green-100 text-green-700",
  REPUESTO: "bg-orange-100 text-orange-700",
};

const formatCurrency = (value) =>
  "$" +
  Number(value).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const ItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itemsApi.getAll();
      setItems(res.data);
    } catch {
      setError("No se pudieron cargar los items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este ítem?")) return;

    try {
      await itemsApi.remove(id);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error ?? "Error al eliminar el ítem.");
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Ítems</h1>
        <button
          onClick={() => navigate("/admin/items/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Nuevo Ítem
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No hay ítems registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                {["ID", "Orden #", "Tipo", "Descripción", "Cantidad", "Valor Unitario", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.workOrderId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${TYPE_BADGE[item.type] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.unitValue)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/items/${item.id}/edit`)}
                      className="text-sm px-3 py-1 rounded-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm px-3 py-1 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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

export default ItemList;
