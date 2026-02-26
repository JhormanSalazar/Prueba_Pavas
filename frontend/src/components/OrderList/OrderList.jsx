import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import OrderRow from './OrderRow';
import PageLoader from '../shared/PageLoader';

const OrderList = () => {
  const { orders, loading, error } = useOrders();

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Órdenes del Taller</h1>
        <Link
          to="/orders/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Nueva Orden
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No hay órdenes registradas.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                {['ID', 'Placa', 'Marca', 'Estado', 'Total', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => <OrderRow key={o.id} order={o} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
