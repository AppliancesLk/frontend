import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { getCart } from '../../../../services/cartService';
import { prepareCheckout } from '../../../../services/checkoutService';
import type { Cart } from '../../../../types/cart.types';
import type { CheckoutSummary } from '../../../../types/checkout.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
import {
  checkoutChanges,
  initialDelivery,
  normalizeDelivery,
  validateDelivery,
} from '../helpers/checkout.helpers';
import type { DeliveryDraft, DeliveryErrors } from '../types/checkout.types';
const t = translations.checkout;

export function useCheckoutPage(email: string) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(() => initialDelivery(email));
  const [errors, setErrors] = useState<DeliveryErrors>({});
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [latestSummary, setLatestSummary] = useState<CheckoutSummary | null>(
    null,
  );
  const alive = useRef(false),
    busy = useRef(false);
  const read = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    read.current?.abort();
    const controller = new AbortController();
    read.current = controller;
    setLoading(true);
    setError('');
    setSummary(null);
    setLatestSummary(null);
    try {
      const result = await getCart(controller.signal);
      if (alive.current && !controller.signal.aborted) setCart(result);
    } catch (err: unknown) {
      if (alive.current && !controller.signal.aborted)
        setError(getApiError(err, t.loadError));
    } finally {
      if (alive.current && !controller.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    // Restore the server's current cart, without storing delivery data locally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => {
      alive.current = false;
      read.current?.abort();
    };
  }, [refresh]);
  function change(field: keyof DeliveryDraft, value: string) {
    if (busy.current) return;
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSummary(null);
    setError('');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || loading || !cart?.items.length) return;
    setSummary(null);
    setError('');
    const invalid = validateDelivery(draft);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      const field = Object.keys(invalid)[0];
      event.currentTarget
        .querySelector<HTMLInputElement>(`[name="${field}"]`)
        ?.focus();
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      const result = await prepareCheckout({
        delivery: normalizeDelivery(draft),
      });
      if (alive.current) {
        setSummary(result);
        setLatestSummary(result);
      }
    } catch (err: unknown) {
      if (alive.current) setError(getApiError(err, t.prepareError));
      // Reconcile stock/deletions/price changes; keep delivery entries and never
      // automatically repeat the preparation request after a network failure.
      try {
        const current = await getCart();
        if (alive.current) {
          setCart(current);
          setLatestSummary(null);
        }
      } catch {
        /* Retain the last cart alongside the original error. */
      }
    } finally {
      busy.current = false;
      if (alive.current) setSaving(false);
    }
  }
  return {
    cart,
    loading,
    saving,
    error,
    draft,
    errors,
    summary,
    latestSummary,
    refresh,
    change,
    submit,
    changes:
      cart && summary
        ? checkoutChanges(cart, summary)
        : { pricesChanged: false, itemsChanged: false },
  };
}
