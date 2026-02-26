import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PageLoader from "./components/shared/PageLoader";
import Login from "./components/Login/Login";
import OrderListPage from "./components/OrderList/OrderList";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import CreateOrderForm from "./components/OrderList/CreateOrderForm";
import UserList from "./components/Users/UserList";
import CreateUserForm from "./components/Users/CreateUserForm";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-lg font-bold text-gray-800 hover:text-gray-600 transition-colors">
              Taller de Motos
            </Link>

            <div className="flex items-center gap-4">
              {user.role === "ADMIN" && (
                <Link
                  to="/users"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Gestión de Usuarios
                </Link>
              )}

              <span className="text-sm text-gray-500">
                {user.name}{" "}
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {user.role}
                </span>
              </span>

              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas - cualquier usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<OrderListPage />} />
            <Route path="/orders/new" element={<CreateOrderForm />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Route>

          {/* Rutas protegidas - solo ADMIN */}
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<CreateUserForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
