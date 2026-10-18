import { useCallback, useEffect, useRef, useState } from 'react';
import * as cartService from '../../../../services/cartService';
import type { Cart, CartItem } from '../../../../types/cart.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
import { nextQuantity } from '../helpers/cart.helpers';
const t = translations.cart;
type Pending =
  { kind: 'quantity' | 'remove'; itemId: string } | { kind: 'clear' | 'add' };

export function useCartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const alive = useRef(false);
  const busy = useRef(false);
  const read = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    read.current?.abort();
    const controller = new AbortController();
    read.current = controller;
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const result = await cartService.getCart(controller.signal);
      if (!controller.signal.aborted && alive.current) setCart(result);
    } catch (err: unknown) {
      if (!controller.signal.aborted && alive.current)
        setError(getApiError(err, t.loadError));
    } finally {
      if (!controller.signal.aborted && alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    // Load the authenticated customer's cart on mount; abort stale reads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => {
      alive.current = false;
      read.current?.abort();
    };
  }, [refresh]);

  async function mutate(
    operation: Pending,
    request: () => Promise<Cart>,
    success: string,
  ) {
    if (busy.current) return;
    busy.current = true;
    read.current?.abort();
    setPending(operation);
    setError('');
    setNotice('');
    try {
      const result = await request();
      if (alive.current) {
        setCart(result);
        setNotice(success);
      }
    } catch (err: unknown) {
      if (alive.current) setError(getApiError(err, t.saveError));
      // A stock change, deleted item or lost response may make local data stale.
      // Re-read authoritative state without repeating the mutation.
      try {
        const result = await cartService.getCart();
        if (alive.current) setCart(result);
      } catch {
        /* Keep the last successful cart and the original error. */
      }
    } finally {
      busy.current = false;
      if (alive.current) setPending(null);
    }
  }

  function changeQuantity(item: CartItem, direction: -1 | 1) {
    const quantity = nextQuantity(item, direction);
    if (quantity === null) return;
    return mutate(
      { kind: 'quantity', itemId: item.id },
      () => cartService.updateCartItem(item.id, quantity),
      t.updated,
    );
  }
  return {
    cart,
    loading,
    pending,
    error,
    notice,
    refresh,
    changeQuantity,
    add: (productId: string) =>
      mutate(
        { kind: 'add' },
        () => cartService.addCartItem({ productId, quantity: 1 }),
        t.added,
      ),
    remove: (item: CartItem) =>
      mutate(
        { kind: 'remove', itemId: item.id },
        () => cartService.removeCartItem(item.id),
        t.removed,
      ),
    clear: () => mutate({ kind: 'clear' }, cartService.clearCart, t.cleared),
  };
}
