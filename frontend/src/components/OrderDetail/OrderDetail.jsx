import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders.api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../shared/StatusBadge';
import StatusActions from './StatusActions';
import ItemsList from './ItemsList';
import AddItemForm from './AddItemForm';
import StatusHistory from './StatusHistory';
import PageLoader from '../shared/PageLoader';
import { formatCurrency } from '../../utils/formatters';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder]   = useState(null);
  const [error, setError]   = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await ordersApi.getById(id);
      setOrder(res.data);
    } catch {
      setError('No se pudo cargar la orden.');
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleChangeStatus = async (newStatus, note) => {
    try {
      await ordersApi.changeStatus(id, newStatus, note);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.error ?? 'Error al cambiar estado.');
    }
  };

  const handleAddItem = async (item) => {
    await ordersApi.addItem(id, item);
    fetchOrder();
  };

  if (error)  return <p className="text-red-500">{error}</p>;
  if (!order) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
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
        <StatusActions
          currentStatus={order.estado}
          userRole={user?.role}
          onChangeStatus={handleChangeStatus}
        />
      </Section>

      {/* Ítems */}
      <Section title="Ítems de la orden">
        <ItemsList items={order.items} />
      </Section>

      {/* Agregar ítem */}
      <Section title="Agregar ítem">
        <AddItemForm onAddItem={handleAddItem} />
      </Section>

      {/* Historial de cambios */}
      <Section title="Historial de Cambios">
        <StatusHistory orderId={id} />
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
