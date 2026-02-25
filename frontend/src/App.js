import { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import OrderList from './components/OrderList/OrderList';
import OrderDetail from './components/OrderDetail/OrderDetail';
import CreateOrderForm from './components/OrderList/CreateOrderForm';
import PageLoader from './components/shared/PageLoader';
import { ordersApi } from './api/orders.api';

function App() {
  const { orders, loading, error, refetch } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const openDetail = (id) => setSelectedOrderId(id);
  const closeDetail = () => { setSelectedOrderId(null); refetch(); };

  const handleCreateOrder = async (data) => {
    try {
      await ordersApi.create(data);
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.error ?? 'Error al crear la orden.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">🔧 Taller de Motos</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && <PageLoader />}
        {error   && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          selectedOrderId ? (
            <OrderDetail orderId={selectedOrderId} onBack={closeDetail} />
          ) : showCreateForm ? (
            <CreateOrderForm 
              onSubmit={handleCreateOrder} 
              onCancel={() => setShowCreateForm(false)} 
            />
          ) : (
            <OrderList 
              orders={orders} 
              onDetail={openDetail} 
              onCreateClick={() => setShowCreateForm(true)} 
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;