import { useEffect, useState } from 'react';
import { getAdminProducts } from '../services/productService';
import { getAdminCategories } from '../services/categoryService';
import type { Product } from '../types/product.types';
import type { Category } from '../types/category.types';
import { translations } from '../utils/translations';
export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.all([getAdminProducts(), getAdminCategories()])
      .then(([productData, categoryData]) => {
        if (!active) return;
        setProducts(productData);
        setCategories(categoryData);
        setError('');
      })
      .catch(() => {
        if (active) setError(translations.admin.loadError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  function refresh() {
    setLoading(true);
    setRevision((current) => current + 1);
  }
  return {
    products,
    setProducts,
    categories,
    setCategories,
    loading,
    error,
    refresh,
  };
}
