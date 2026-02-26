import { useState } from 'react';

const TRANSITIONS = {
  RECIBIDA:    ['DIAGNOSTICO', 'EN_PROCESO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO:  ['LISTA', 'CANCELADA'],
  LISTA:       ['ENTREGADA', 'CANCELADA'],
  ENTREGADA:   [],
  CANCELADA:   [],
};

const MECANICO_ALLOWED = ['DIAGNOSTICO', 'EN_PROCESO', 'LISTA'];

const BUTTON_STYLES = {
  DIAGNOSTICO: 'bg-purple-500 hover:bg-purple-600',
  EN_PROCESO:  'bg-yellow-500 hover:bg-yellow-600',
  LISTA:       'bg-green-500 hover:bg-green-600',
  ENTREGADA:   'bg-gray-600 hover:bg-gray-700',
  CANCELADA:   'bg-red-500 hover:bg-red-600',
};

const StatusActions = ({ currentStatus, userRole, onChangeStatus }) => {
  const [note, setNote] = useState('');

  let available = TRANSITIONS[currentStatus] ?? [];

  if (userRole === 'MECANICO') {
    available = available.filter((s) => MECANICO_ALLOWED.includes(s));
  }

  if (available.length === 0) {
    return <p className="text-sm text-gray-400 italic">Esta orden está en estado final.</p>;
  }

  const handleClick = (status) => {
    onChangeStatus(status, note || undefined);
    setNote('');
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota opcional..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
      <div className="flex flex-wrap gap-2">
        {available.map((s) => (
          <button
            key={s}
            onClick={() => handleClick(s)}
            className={`text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors ${BUTTON_STYLES[s]}`}
          >
            Mover a {s.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusActions;
