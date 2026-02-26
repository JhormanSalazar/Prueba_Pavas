import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { motosApi } from "../../api/motos.api";
import { Search, X, Bike } from "lucide-react";

const CreateOrderForm = () => {
  const navigate = useNavigate();

  const [selectedMoto, setSelectedMoto] = useState(null);
  const [faultDescription, setFaultDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Moto search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!showSearch) return;
    if (searchQuery.length < 1) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await motosApi.search(searchQuery);
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, showSearch]);

  const handleSelectMoto = (moto) => {
    setSelectedMoto(moto);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClearMoto = () => {
    setSelectedMoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMoto) {
      setError("Debes seleccionar una moto registrada.");
      return;
    }
    if (!faultDescription.trim()) {
      setError("Describe la falla reportada.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await ordersApi.create({ placa: selectedMoto.placa, faultDescription });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error ?? "Error al crear la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva Orden</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Moto Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moto
          </label>

          {selectedMoto ? (
            <div className="border border-green-200 bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">
                    {selectedMoto.placa}
                  </span>
                  <span className="text-sm text-green-700">
                    {selectedMoto.marca} {selectedMoto.modelo || ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearMoto}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {selectedMoto.client && (
                <p className="text-sm text-green-700 mt-1">
                  Cliente: <span className="font-medium">{selectedMoto.client.name}</span>
                  {selectedMoto.client.phone && ` - Tel: ${selectedMoto.client.phone}`}
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-left"
            >
              <Search className="w-4 h-4" />
              Buscar moto por placa...
            </button>
          )}
        </div>

        {/* Fault Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Falla reportada
          </label>
          <textarea
            value={faultDescription}
            onChange={(e) => setFaultDescription(e.target.value)}
            placeholder="Describe la falla..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Crear Orden"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Search Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe la placa para buscar..."
                className="flex-1 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto">
              {searching && (
                <p className="text-sm text-gray-400 text-center py-4">Buscando...</p>
              )}

              {!searching && searchQuery.length >= 1 && searchResults.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No se encontraron motos con esa placa.
                </p>
              )}

              {!searching && searchQuery.length < 1 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Escribe al menos 1 carácter para buscar.
                </p>
              )}

              {searchResults.map((moto) => (
                <button
                  key={moto.id}
                  type="button"
                  onClick={() => handleSelectMoto(moto)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">{moto.placa}</span>
                    <span className="text-sm text-gray-500">
                      {moto.marca} {moto.modelo || ""}
                    </span>
                  </div>
                  {moto.client && (
                    <p className="text-xs text-gray-400 mt-0.5 ml-6">
                      Cliente: {moto.client.name}
                      {moto.client.phone && ` - ${moto.client.phone}`}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderForm;
