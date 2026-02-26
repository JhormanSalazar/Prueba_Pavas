import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PageLoader from "./components/shared/PageLoader";
import Sidebar from "./components/shared/Sidebar";
import Login from "./components/Login/Login";
import OrderListPage from "./components/OrderList/OrderList";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import CreateOrderForm from "./components/OrderList/CreateOrderForm";
import UserList from "./components/Users/UserList";
import CreateUserForm from "./components/Users/CreateUserForm";
import ClienteList from "./components/Clientes/ClienteList";
import CreateClienteForm from "./components/Clientes/CreateClienteForm";
import EditClienteForm from "./components/Clientes/EditClienteForm";
import MotoList from "./components/Motos/MotoList";
import CreateMotoForm from "./components/Motos/CreateMotoForm";
import EditMotoForm from "./components/Motos/EditMotoForm";
import ItemList from "./components/Items/ItemList";
import CreateItemForm from "./components/Items/CreateItemForm";
import EditItemForm from "./components/Items/EditItemForm";
import EstadoList from "./components/Estados/EstadoList";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  // Login page (no sidebar)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            {/* Rutas protegidas - cualquier usuario autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<OrderListPage />} />
              <Route path="/orders/new" element={<CreateOrderForm />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
            </Route>

            {/* Rutas protegidas - solo ADMIN */}
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="/admin/usuarios" element={<UserList />} />
              <Route path="/admin/usuarios/new" element={<CreateUserForm />} />
              <Route path="/admin/clientes" element={<ClienteList />} />
              <Route path="/admin/clientes/new" element={<CreateClienteForm />} />
              <Route path="/admin/clientes/:id/edit" element={<EditClienteForm />} />
              <Route path="/admin/motos" element={<MotoList />} />
              <Route path="/admin/motos/new" element={<CreateMotoForm />} />
              <Route path="/admin/motos/:id/edit" element={<EditMotoForm />} />
              <Route path="/admin/items" element={<ItemList />} />
              <Route path="/admin/items/new" element={<CreateItemForm />} />
              <Route path="/admin/items/:id/edit" element={<EditItemForm />} />
              <Route path="/admin/estados" element={<EstadoList />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
