import { Link } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

const OrderRow = ({ order }) => (
  <tr className="border-b hover:bg-gray-50 transition-colors">
    <td className="px-4 py-3 text-sm text-gray-500">#{order.id}</td>
    <td className="px-4 py-3 font-medium">{order.placa}</td>
    <td className="px-4 py-3 text-sm text-gray-500">{order.marca}</td>
    <td className="px-4 py-3"><StatusBadge status={order.estado} /></td>
    <td className="px-4 py-3 font-semibold">{formatCurrency(order.total)}</td>
    <td className="px-4 py-3">
      <Link
        to={`/orders/${order.id}`}
        className="text-sm text-blue-600 hover:underline font-medium"
      >
        Ver detalle →
      </Link>
    </td>
  </tr>
);

export default OrderRow;
