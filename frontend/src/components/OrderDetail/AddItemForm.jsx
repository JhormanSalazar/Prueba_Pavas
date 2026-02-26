import { useState, useEffect, useRef, useCallback } from 'react';
import { itemsApi } from '../../api/items.api';
import { Search, X } from 'lucide-react';

const EMPTY_FORM = { type: 'REPUESTO', description: '', count: 1, unitValue: '' };

const AddItemForm = ({ onAddItem }) => {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // Catalog state
  const [catalog, setCatalog]       = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef    = useRef(null);

  // Fetch catalog
  const fetchCatalog = useCallback(() => {
    itemsApi
      .getCatalog()
      .then((res) => setCatalog(res.data ?? []))
      .catch(() => setCatalog([]));
  }, []);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  // Filtered catalog items
  const filtered = catalog.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.description.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectCatalogItem = useCallback((item) => {
    setForm((prev) => ({
      ...prev,
      type: item.type,
      description: item.description,
      unitValue: item.unitValue,
    }));
    setSearchTerm(item.description);
    setShowDropdown(false);
    setHighlightIdx(-1);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setForm((prev) => ({ ...prev, description: val }));
    setShowDropdown(val.length > 0);
    setHighlightIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => (i < filtered.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => (i > 0 ? i - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      selectCatalogItem(filtered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setForm(EMPTY_FORM);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onAddItem(form);
      setForm(EMPTY_FORM);
      setSearchTerm('');
      fetchCatalog();
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al agregar ítem.');
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = (t) => (t === 'MANO_OBRA' ? 'Mano de Obra' : 'Repuesto');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Combobox — search input with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Buscar en catálogo o escribir nuevo
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Filtro de aceite, Cambio de frenos..."
            autoComplete="off"
            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
            {filtered.map((item, idx) => (
              <li
                key={`${item.type}-${item.description}`}
                onMouseDown={() => selectCatalogItem(item)}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                  idx === highlightIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      item.type === 'REPUESTO'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {typeLabel(item.type)}
                  </span>
                  <span className="truncate">{item.description}</span>
                </div>
                <span className="shrink-0 ml-2 text-xs text-gray-400">
                  ${item.unitValue.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {showDropdown && searchTerm && filtered.length === 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-3 text-sm text-gray-400 italic">
            Sin coincidencias — escribe los datos manualmente abajo.
          </div>
        )}
      </div>

      {/* Fields row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="REPUESTO">Repuesto</option>
          <option value="MANO_OBRA">Mano de Obra</option>
        </select>

        <input
          name="description"
          value={form.description}
          onChange={(e) => {
            handleChange(e);
            setSearchTerm(e.target.value);
          }}
          placeholder="Descripción"
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="count"
          type="number"
          min="1"
          value={form.count}
          onChange={handleChange}
          placeholder="Cant."
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="unitValue"
          type="number"
          min="1"
          value={form.unitValue}
          onChange={handleChange}
          placeholder="Precio unit."
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Agregando...' : '+ Agregar ítem'}
      </button>
    </form>
  );
};

export default AddItemForm;