import { translations } from '../../../../utils/translations';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  getAdminProducts,
  updateProductStock,
} from '../../../../services/productService';
import type { Product } from '../../../../types/product.types';
import { getStockUpdateErrorMessage } from '../../../../utils/stockErrors';
import { validateStockQuantity } from '../../../../utils/stockValidation';

interface RowMessage {
  type: 'success' | 'error';
  text: string;
}

function withoutKey<T>(
  record: Record<string, T>,
  key: string,
): Record<string, T> {
  const copy = { ...record };

  delete copy[key];

  return copy;
}

export function useInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, RowMessage>>({});

  const loadProducts = useCallback(async () => {
    try {
      const data = await getAdminProducts();

      setProducts(data);
      setLoadError(null);
    } catch {
      setLoadError(translations.admin.inventoryLoadError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleRefresh = () => {
    setLoading(true);
    setDrafts({});
    setMessages({});
    void loadProducts();
  };

  const handleDraftChange = (productID: string, value: string) => {
    setDrafts((current) => ({ ...current, [productID]: value }));
    setMessages((current) => withoutKey(current, productID));
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>,
    product: Product,
  ) => {
    event.preventDefault();

    const { productID } = product;

    if (saving[productID]) {
      return;
    }

    const result = validateStockQuantity(
      drafts[productID] ?? String(product.stockQty),
    );

    if (!result.valid) {
      const validationMessage = result.message;

      setMessages((current) => ({
        ...current,
        [productID]: { type: 'error', text: validationMessage },
      }));

      return;
    }

    setSaving((current) => ({ ...current, [productID]: true }));
    setMessages((current) => withoutKey(current, productID));

    try {
      const updated = await updateProductStock(productID, result.value);

      setProducts((current) =>
        current.map((item) =>
          item.productID === productID
            ? { ...item, stockQty: updated.stockQty }
            : item,
        ),
      );
      setDrafts((current) => withoutKey(current, productID));
      setMessages((current) => ({
        ...current,
        [productID]: { type: 'success', text: translations.admin.stockUpdated },
      }));
    } catch (error) {
      setMessages((current) => ({
        ...current,
        [productID]: {
          type: 'error',
          text: getStockUpdateErrorMessage(error),
        },
      }));
    } finally {
      setSaving((current) => ({ ...current, [productID]: false }));
    }
  };

  return {
    products,
    loading,
    loadError,
    drafts,
    saving,
    messages,
    handleRefresh,
    handleDraftChange,
    handleSave,
  };
}
