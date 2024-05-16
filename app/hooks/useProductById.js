"use client"; 

import { useState, useEffect } from 'react';
import { getProductById } from '../admin/products/_actions/products'; // Adjust the import path accordingly

const useProductById = (id, isAdmin = false) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(id, isAdmin);
        setProduct(fetchedProduct);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, isAdmin]);

  return { product, loading, error };
};

export default useProductById;
