import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ToastMessage } from '../../utils/toast';
import { Icon } from '../common/Icon';
type Item = ToastMessage & { id: string };
function Toast({
  item,
  dismiss,
}: {
  item: Item;
  dismiss: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => dismiss(item.id), 5000);
    return () => window.clearTimeout(timer);
  }, [item.id, paused, dismiss]);
  return (
    <div
      className="store-toast"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <Icon name="check" className="h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p>{item.message}</p>
        {item.action && (
          <Link
            to={item.action.to}
            onClick={() => dismiss(item.id)}
            className="mt-1 inline-block font-semibold underline underline-offset-4"
          >
            {item.action.label}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={() => dismiss(item.id)}
        aria-label="Dismiss notification"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  );
}
export function ToastRegion() {
  const [items, setItems] = useState<Item[]>([]);
  const dismiss = useCallback(
    (id: string) =>
      setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );
  useEffect(() => {
    const receive = (event: Event) => {
      const message = (event as CustomEvent<ToastMessage>).detail;
      setItems((current) =>
        [{ ...message, id: crypto.randomUUID() }, ...current].slice(0, 3),
      );
    };
    window.addEventListener('store-toast', receive);
    return () => window.removeEventListener('store-toast', receive);
  }, []);
  return (
    <div
      className="store-toast-region"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <Toast key={item.id} item={item} dismiss={dismiss} />
      ))}
    </div>
  );
}
