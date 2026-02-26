import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList,
  FilePlus,
  Users,
  UserCircle,
  Bike,
  Package,
  Activity,
  LogOut,
  Wrench,
} from "lucide-react";

const ADMIN_LINKS = [
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/clientes", label: "Clientes", icon: UserCircle },
  { to: "/admin/motos", label: "Motos", icon: Bike },
  { to: "/admin/items", label: "Ítems", icon: Package },
  { to: "/admin/estados", label: "Estados", icon: Activity },
];

const MECANICO_LINKS = [
  { to: "/orders/new", label: "Crear Orden", icon: FilePlus },
  { to: "/", label: "Mis Órdenes", icon: ClipboardList },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-700"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
  }`;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-800">Taller de Motos</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Ordenes section - visible to all */}
        <p className="px-4 text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2">
          Órdenes
        </p>
        {MECANICO_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-gray-100" />
            <p className="px-4 text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2">
              Administración
            </p>
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User info + Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
