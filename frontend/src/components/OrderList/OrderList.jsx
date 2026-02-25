import OrderRow from './OrderRow';

const OrderList = ({ orders, onDetail, onCreateClick }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Órdenes del Taller</h1>
      <button
        onClick={onCreateClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>+</span> Nueva Orden
      </button>
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
            {orders.map(o => <OrderRow key={o.id} order={o} onDetail={onDetail} />)}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default OrderList;