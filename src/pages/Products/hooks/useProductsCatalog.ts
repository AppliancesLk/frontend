import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductCatalog } from '../../../services/productService';
import type { CatalogResult } from '../../../types/catalog.types';
import { readCatalogQuery } from '../helpers/catalog.helpers';
import { translations } from '../../../utils/translations';
export function useProductsCatalog() {
  const [params, setParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const key = params.toString();
  const query = readCatalogQuery(params);
  const [resource, setResource] = useState<{
    key: string;
    data?: CatalogResult;
    error?: string;
  } | null>(null);
  const requestKey = `${key}:${revision}`;
  useEffect(() => {
    const parsed = readCatalogQuery(new URLSearchParams(key));
    if (!parsed) return;
    const controller = new AbortController();
    void getProductCatalog(parsed, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResource({ key: requestKey, data });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResource({
            key: requestKey,
            error: translations.catalog.loadError,
          });
      });
    return () => controller.abort();
  }, [key, requestKey]);
  const current = resource?.key === requestKey ? resource : null;
  function update(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(params);
    next.delete('page');
    for (const [field, value] of Object.entries(changes)) {
      if (value) next.set(field, value);
      else next.delete(field);
    }
    // Controlled checkboxes follow the URL; commit it during the input event.
    setParams(next, { flushSync: true });
  }
  return {
    params,
    query,
    data: query ? (current ? current.data : resource?.data) : undefined,
    loading: !!query && !current,
    error: !query ? translations.catalog.invalid : (current?.error ?? ''),
    update,
    clear: () => setParams({}),
    retry: () => setRevision((value) => value + 1),
  };
}
