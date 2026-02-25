const STATUS_STYLES = {
  RECIBIDA:   'bg-blue-100 text-blue-700',
  EN_PROCESO: 'bg-yellow-100 text-yellow-700',
  LISTA:      'bg-green-100 text-green-700',
  ENTREGADA:  'bg-gray-100 text-gray-600',
  CANCELADA:  'bg-red-100 text-red-600',
};

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}`}>
    {status}
  </span>
);

export default StatusBadge;