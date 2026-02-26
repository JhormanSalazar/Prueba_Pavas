import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TRANSITIONS = {
  RECIBIDA:    ['DIAGNOSTICO', 'EN_PROCESO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO:  ['LISTA', 'CANCELADA'],
  LISTA:       ['EN_PROCESO', 'ENTREGADA', 'CANCELADA'],
  ENTREGADA:   [],
  CANCELADA:   [],
};

const MECANICO_ALLOWED = ['DIAGNOSTICO', 'EN_PROCESO', 'LISTA'];

const STATUS_CONFIG = {
  RECIBIDA:    { color: 'blue',   label: 'Recibida' },
  DIAGNOSTICO: { color: 'purple', label: 'Diagnóstico' },
  EN_PROCESO:  { color: 'yellow', label: 'En Proceso' },
  LISTA:       { color: 'green',  label: 'Lista' },
  ENTREGADA:   { color: 'gray',   label: 'Entregada' },
  CANCELADA:   { color: 'red',    label: 'Cancelada' },
};

const BUTTON_STYLES = {
  DIAGNOSTICO: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300',
  EN_PROCESO:  'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300',
  LISTA:       'bg-green-500 hover:bg-green-600 focus:ring-green-300',
  ENTREGADA:   'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300',
  CANCELADA:   'bg-red-500 hover:bg-red-600 focus:ring-red-300',
};

const DOT_COLORS = {
  RECIBIDA:    'bg-blue-500',
  DIAGNOSTICO: 'bg-purple-500',
  EN_PROCESO:  'bg-yellow-500',
  LISTA:       'bg-green-500',
  ENTREGADA:   'bg-gray-500',
  CANCELADA:   'bg-red-500',
};

const StatusActions = ({ currentStatus, userRole, onChangeStatus }) => {
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  let available = TRANSITIONS[currentStatus] ?? [];

  if (userRole === 'MECANICO') {
    available = available.filter((s) => MECANICO_ALLOWED.includes(s));
  }

  const isFinal = available.length === 0;
  const cfg = STATUS_CONFIG[currentStatus] ?? { color: 'gray', label: currentStatus };

  const handleClick = async (status) => {
    setLoading(true);
    try {
      await onChangeStatus(status, note || undefined);
      setNote('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden transition-all duration-200">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => !isFinal && setOpen((v) => !v)}
        disabled={isFinal}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
          isFinal
            ? 'bg-gray-50 cursor-default'
            : 'bg-white hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[currentStatus] ?? 'bg-gray-400'}`} />
          <span className="text-sm font-semibold text-gray-700">
            Estado actual: <span className="text-gray-900">{cfg.label}</span>
          </span>
        </div>

        {!isFinal && (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        )}

        {isFinal && (
          <span className="text-xs text-gray-400 italic">Estado final</span>
        )}
      </button>

      {/* Accordion body */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50/50">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nota opcional..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />

          <div className="flex flex-wrap gap-2">
            {available.map((s) => (
              <button
                key={s}
                disabled={loading}
                onClick={() => handleClick(s)}
                className={`text-white text-sm px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_STYLES[s]}`}
              >
                {loading ? '...' : `Mover a ${(STATUS_CONFIG[s]?.label ?? s).replace('_', ' ')}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusActions;
