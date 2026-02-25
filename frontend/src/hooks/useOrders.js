import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../api/orders.api';

export const useOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getAll();
      setOrders(res.data);
    } catch {
      setError('No se pudieron cargar las órdenes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};