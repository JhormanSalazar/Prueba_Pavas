import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import PageLoader from "../shared/PageLoader";

const ROLE_BADGE = {
  ADMIN: "bg-purple-100 text-purple-700",
  MECANICO: "bg-blue-100 text-blue-700",
};

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi.getUsers();
      setUsers(res.data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (id) => {
    try {
      await authApi.toggleUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error ?? "Error al cambiar estado del usuario.");
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => navigate("/users/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                {["ID", "Nombre", "Email", "Rol", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{u.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[u.role] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {u.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(u.id)}
                      className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                        u.active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {u.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
