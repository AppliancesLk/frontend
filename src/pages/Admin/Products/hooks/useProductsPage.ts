import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCatalog } from '../../../../hooks/useCatalog';
import {
  createProduct,
  updateProduct,
} from '../../../../services/productService';
import type {
  Product,
  CreateProductRequest,
} from '../../../../types/product.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
import { emptyProductDraft } from '../types/product-form.types';
import { buildProductInput } from '../helpers/product.helpers';
import { uploadProductImage } from '../../../../services/productService';
export function useProductsPage() {
  const catalog = useCatalog();
  const [draft, setDraft] = useState(emptyProductDraft);
  const [busy, setBusy] = useState(false);
  const [uploading,setUploading]=useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    setError('');
    setSuccess('');
    let input: CreateProductRequest;
    try {
      input = buildProductInput(draft);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : translations.admin.saveError,
      );
      return;
    }
    setBusy(true);
    try {
      const product = await createProduct(input);
      let currentProduct = product;
      for (const file of draft.pendingImages) {
        const uploaded = await uploadProductImage(product.productID, file);
        currentProduct = { ...currentProduct, images: [...currentProduct.images, uploaded.imageUrl] };
      }
      catalog.setProducts((current) => [currentProduct, ...current]);
      setDraft(emptyProductDraft);
      setSuccess(translations.admin.productCreated);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusy(false);
    }
  }
  async function toggle(product: Product) {
    setUpdating(product.productID);
    setError('');
    setSuccess('');
    try {
      const updated = await updateProduct(product.productID, {
        isActive: !product.isActive,
      });
      catalog.setProducts((current) =>
        current.map((item) =>
          item.productID === updated.productID ? updated : item,
        ),
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setUpdating(null);
    }
  }
  const filtered = catalog.products.filter((product) =>
    `${product.name} ${product.SKU}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return {
    ...catalog,
    draft,
    setDraft,
    busy:busy||uploading,
    setUploading,
    updating,
    formError: error,
    success,
    search,
    setSearch,
    filtered,
    submit,
    toggle,
  };
}
