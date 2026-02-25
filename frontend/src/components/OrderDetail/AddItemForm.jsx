import { useState } from 'react';

const EMPTY_FORM = { type: 'REPUESTO', description: '', count: 1, unitValue: '' };

const AddItemForm = ({ onAddItem }) => {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onAddItem(form);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al agregar ítem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="REPUESTO">Repuesto</option>
          <option value="MANO_OBRA">Mano de Obra</option>
        </select>

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          required
          className="col-span-1 sm:col-span-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="count"
          type="number"
          min="1"
          value={form.count}
          onChange={handleChange}
          placeholder="Cant."
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="unitValue"
          type="number"
          min="1"
          value={form.unitValue}
          onChange={handleChange}
          placeholder="Precio unit."
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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