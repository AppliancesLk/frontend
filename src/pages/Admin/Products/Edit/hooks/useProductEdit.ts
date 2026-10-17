import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import {
  getAdminProductById,
  updateProduct,
} from '../../../../../services/productService';
import { getAdminCategories } from '../../../../../services/categoryService';
import { useAuth } from '../../../../../hooks/useAuth';
import { isUuid } from '../../../../../utils/validation';
import type {
  Product,
  UpdateProductRequest,
} from '../../../../../types/product.types';
import type { Category } from '../../../../../types/category.types';
import type { ProductEditDraft } from '../types/product-edit.types';
import {
  buildProductUpdateInput,
  createProductEditDraft,
  isProductEditDirty,
} from '../helpers/product-edit.helpers';
import { productEditCache } from '../helpers/product-edit-cache';
import { getApiError } from '../../../../../utils/apiErrors';
import { translations } from '../../../../../utils/translations';
import { useUnsavedProductChanges } from './useUnsavedProductChanges';
type EditorResource =
  | {
      key: string;
      status: 'ready';
      product: Product;
      baseline: Product;
      categories: Category[];
      draft: ProductEditDraft;
      restored: boolean;
    }
  | { key: string; status: 'error' | 'not-found' | 'forbidden' };
const t = translations.productEdit;
export function useProductEdit(id?: string) {
  const { user } = useAuth();
  const accountId = user?.id;
  const [revision, setRevision] = useState(0);
  const [resource, setResource] = useState<EditorResource | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState({ key: '', error: '', success: '' });
  const cacheKey = `${accountId}:${id}`;
  const requestKey = `${cacheKey}:${revision}`;
  const validId = isUuid(id);
  const error = feedback.key === requestKey ? feedback.error : '';
  const success = feedback.key === requestKey ? feedback.success : '';
  function setError(message: string) {
    setFeedback((current) => ({
      key: requestKey,
      error: message,
      success: current.key === requestKey ? current.success : '',
    }));
  }
  function setSuccess(message: string) {
    setFeedback((current) => ({
      key: requestKey,
      success: message,
      error: current.key === requestKey ? current.error : '',
    }));
  }

  useEffect(() => {
    if (!id || !validId || !accountId) return;
    const controller = new AbortController();
    Promise.all([
      getAdminProductById(id, controller.signal),
      getAdminCategories(controller.signal),
    ])
      .then(([product, categories]) => {
        if (controller.signal.aborted) return;
        const cached = productEditCache.get(cacheKey);
        setResource({
          key: requestKey,
          status: 'ready',
          product,
          baseline: cached?.baseline ?? product,
          categories,
          draft: cached?.draft ?? createProductEditDraft(product),
          restored: !!cached,
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const missing =
          axios.isAxiosError(err) &&
          [400, 404].includes(err.response?.status ?? 0);
        setResource({
          key: requestKey,
          status:
            axios.isAxiosError(err) && err.response?.status === 403
              ? 'forbidden'
              : missing
                ? 'not-found'
                : 'error',
        });
      });
    return () => controller.abort();
  }, [id, validId, accountId, cacheKey, requestKey]);
  const current = resource?.key === requestKey ? resource : null;
  const editor = current?.status === 'ready' ? current : null;
  const dirty = !!editor && isProductEditDirty(editor.draft, editor.baseline);
  const blocker = useUnsavedProductChanges(dirty, busy);
  function changeDraft(next: ProductEditDraft) {
    if (!editor || inFlight.current) return;
    if (isProductEditDirty(next, editor.baseline))
      productEditCache.set(cacheKey, {
        baseline: editor.baseline,
        draft: next,
      });
    else productEditCache.delete(cacheKey);
    setResource({ ...editor, draft: next });
    setError('');
    setSuccess('');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || !id || inFlight.current) return;
    setError('');
    setSuccess('');
    let input: UpdateProductRequest;
    try {
      input = buildProductUpdateInput(editor.draft, editor.baseline);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.savedError);
      return;
    }
    if (!Object.keys(input).length) {
      changeDraft(createProductEditDraft(editor.baseline));
      setSuccess(t.noChanges);
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      const saved = await updateProduct(id, input);
      productEditCache.delete(cacheKey);
      setResource({
        ...editor,
        product: saved,
        baseline: saved,
        draft: createProductEditDraft(saved),
        restored: false,
      });
      setSuccess(t.saved);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  function discard() {
    productEditCache.delete(cacheKey);
    if (blocker.state === 'blocked') blocker.proceed();
  }
  return {
    editor,
    status: !validId ? ('not-found' as const) : (current?.status ?? 'loading'),
    busy,
    dirty,
    error,
    success,
    changeDraft,
    submit,
    blocker,
    discard,
    retry: () => setRevision((value) => value + 1),
  };
}
