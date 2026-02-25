import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../../api/orders.api';
import StatusBadge from '../shared/StatusBadge';
import StatusActions from './StatusActions';
import ItemsList from './ItemsList';
import AddItemForm from './AddItemForm';
import PageLoader from '../shared/PageLoader';
import { formatCurrency } from '../../utils/formatters';

const OrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder]   = useState(null);
  const [error, setError]   = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await ordersApi.getById(orderId);
      setOrder(res.data);
    } catch {
      setError('No se pudo cargar la orden.');
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleChangeStatus = async (newStatus) => {
    try {
      await ordersApi.changeStatus(orderId, newStatus);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.error ?? 'Error al cambiar estado.');
    }
  };

  const handleAddItem = async (item) => {
    await ordersApi.addItem(orderId, item);
    fetchOrder();
  };

  if (error)  return <p className="text-red-500">{error}</p>;
  if (!order) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          Orden #{order.id} — {order.placa}
        </h2>
        <StatusBadge status={order.estado} />
      </div>

      {/* Info + Total */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card label="Marca" value={order.marca} />
        <Card label="Falla reportada" value={order.faultDescription} />
        <Card label="Total" value={formatCurrency(order.total)} highlight />
      </div>

      {/* Cambio de estado */}
      <Section title="Cambiar estado">
        <StatusActions currentStatus={order.estado} onChangeStatus={handleChangeStatus} />
      </Section>

      {/* Ítems */}
      <Section title="Ítems de la orden">
        <ItemsList items={order.items} />
      </Section>

      {/* Agregar ítem */}
      <Section title="Agregar ítem">
        <AddItemForm onAddItem={handleAddItem} />
      </Section>
    </div>
  );
};

// Helpers visuales locales (pequeños, no justifican archivo propio)
const Card = ({ label, value, highlight }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className={`font-semibold ${highlight ? 'text-2xl text-blue-600' : 'text-gray-800'}`}>{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
    {children}
  </div>
);

export default OrderDetail;