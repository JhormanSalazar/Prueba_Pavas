import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itemsApi } from "../../api/items.api";
import PageLoader from "../shared/PageLoader";

const EditItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    workOrderId: "",
    type: "MANO_OBRA",
    description: "",
    count: "",
    unitValue: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemsApi.getById(id);
        const { workOrderId, type, description, count, unitValue } = res.data;
        setFormData({
          workOrderId: workOrderId || "",
          type: type || "MANO_OBRA",
          description: description || "",
          count: count ?? "",
          unitValue: unitValue ?? "",
        });
      } catch {
        setError("No se pudo cargar el ítem.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.description || !formData.count || !formData.unitValue) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await itemsApi.update(id, {
        type: formData.type,
        description: formData.description,
        count: Number(formData.count),
        unitValue: Number(formData.unitValue),
      });
      navigate("/admin/items");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al actualizar el ítem.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Editar Ítem</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Trabajo</label>
          <input
            type="text"
            value={`Orden #${formData.workOrderId}`}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
          >
            <option value="MANO_OBRA">Mano de Obra</option>
            <option value="REPUESTO">Repuesto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del ítem"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleChange}
            placeholder="1"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitario</label>
          <input
            type="number"
            name="unitValue"
            value={formData.unitValue}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="any"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/items")}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemForm;
