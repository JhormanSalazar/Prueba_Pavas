import { useState, useEffect } from "react";
import { ordersApi } from "../../api/orders.api";
import StatusBadge from "../shared/StatusBadge";

const StatusHistory = ({ orderId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getHistory(orderId)
      .then((res) => setHistory(res.data.data ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <p className="text-sm text-gray-400">Cargando historial...</p>;
  }

  if (history.length === 0) {
    return <p className="text-sm text-gray-400 italic">Sin cambios de estado registrados.</p>;
  }

  return (
    <div className="relative pl-6">
      {/* Línea vertical */}
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="relative flex items-start gap-3">
            {/* Punto en la línea */}
            <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <StatusBadge status={entry.from_status} />
                <span className="text-gray-400">→</span>
                <StatusBadge status={entry.to_status} />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-gray-600">
                  {entry.changed_by_name ?? `Usuario #${entry.changed_by_user_id}`}
                </span>
                {" — "}
                {new Date(entry.created_at).toLocaleString("es-CO")}
              </p>

              {entry.note && (
                <p className="text-xs text-gray-500 mt-1 italic">"{entry.note}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusHistory;
