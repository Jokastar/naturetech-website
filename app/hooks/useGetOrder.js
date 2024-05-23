"use client"; 

import { useState, useEffect} from 'react';
import { getOrdersByUserId } from '@/app/admin/users/_actions/users';

const useGetOrders = (userId) => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrdersByUserId(userId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOrders(result.orders);
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (userId) {
      //fetchOrders();
      
    }
  }, []);

  return { orders, loading, error, fetchOrders };
};

export default useGetOrders;
