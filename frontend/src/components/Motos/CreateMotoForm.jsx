import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motosApi } from "../../api/motos.api";
import { clientesApi } from "../../api/clientes.api";
import PageLoader from "../shared/PageLoader";

const CreateMotoForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    clientId: "",
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await clientesApi.getAll();
        setClientes(res.data);
      } catch {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.placa || !formData.marca || !formData.clientId) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await motosApi.create({
        ...formData,
        clientId: Number(formData.clientId),
      });
      navigate("/admin/motos");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al crear la moto.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva Moto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            placeholder="ABC-123"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Yamaha, Honda, Suzuki..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="FZ 2.0, CBR 250..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
          >
            <option value="">Seleccionar cliente...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creando..." : "Crear Moto"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/motos")}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMotoForm;
