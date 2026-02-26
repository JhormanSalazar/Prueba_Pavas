import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders.api';

const CreateOrderForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    placa: '',
    faultDescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.placa || !formData.faultDescription) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await ordersApi.create(formData);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error ?? 'Error al crear la orden.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva Orden</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Falla reportada</label>
          <textarea
            name="faultDescription"
            value={formData.faultDescription}
            onChange={handleChange}
            placeholder="Describe la falla..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Crear Orden
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm;
