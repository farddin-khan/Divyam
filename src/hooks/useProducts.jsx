import { useState, useEffect, useCallback } from 'react';
import { apiUrl, readJsonResponse } from '../lib/api.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.featured) params.set('featured', 'true');
      if (filters.bestSeller) params.set('bestSeller', 'true');
      if (filters.newArrival) params.set('newArrival', 'true');
      if (filters.search) params.set('search', filters.search);

      const queryString = params.toString();
      const response = await fetch(apiUrl(`/api/products${queryString ? `?${queryString}` : ''}`));
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load products.');
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/collections'));
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load collections.');
      }

      setCategories(data.collections || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchProductBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl(`/api/products/${encodeURIComponent(slug)}`));
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load product.');
      }

      return data.product;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { products, categories, loading, error, fetchProducts, fetchProductBySlug };
}
