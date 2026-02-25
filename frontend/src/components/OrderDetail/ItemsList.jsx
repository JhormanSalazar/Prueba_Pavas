import { formatCurrency } from '../../utils/formatters';

const TYPE_BADGE = {
  REPUESTO:  'bg-purple-100 text-purple-700',
  MANO_OBRA: 'bg-orange-100 text-orange-700',
};

const ItemsList = ({ items }) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 italic">Sin ítems aún.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((it) => (
        <li key={it.id} className="flex justify-between items-center py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_BADGE[it.type]}`}>
              {it.type.replace('_', ' ')}
            </span>
            <span className="text-gray-700">{it.description}</span>
          </div>
          <span className="text-gray-500">
            {it.count} × {formatCurrency(it.unitValue)}
            <span className="ml-2 font-semibold text-gray-800">
              = {formatCurrency(it.count * it.unitValue)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;