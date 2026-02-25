const TRANSITIONS = {
  RECIBIDA:   ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA:      ['ENTREGADA', 'CANCELADA'],
  ENTREGADA:  [],
  CANCELADA:  [],
};

const BUTTON_STYLES = {
  EN_PROCESO: 'bg-yellow-500 hover:bg-yellow-600',
  LISTA:      'bg-green-500 hover:bg-green-600',
  ENTREGADA:  'bg-gray-600 hover:bg-gray-700',
  CANCELADA:  'bg-red-500 hover:bg-red-600',
};

const StatusActions = ({ currentStatus, onChangeStatus }) => {
  const available = TRANSITIONS[currentStatus] ?? [];

  if (available.length === 0) {
    return <p className="text-sm text-gray-400 italic">Esta orden está en estado final.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {available.map(s => (
        <button
          key={s}
          onClick={() => onChangeStatus(s)}
          className={`text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors ${BUTTON_STYLES[s]}`}
        >
          Mover a {s.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
};

export default StatusActions;