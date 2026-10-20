import { useEffect, useId, useRef, type ReactNode } from 'react';
import { uiText } from '../../utils/uiText';
import { Icon } from '../common/Icon';
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  drawer = false,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  drawer?: boolean;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const element = ref.current;
    if (!open || !element) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      aria-describedby={description ? `${id}-description` : undefined}
      className={drawer ? 'ui-dialog ui-drawer' : 'ui-dialog'}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (!busy && event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id={id} className="text-xl font-semibold tracking-tight text-fg">
            {title}
          </h2>
          {description && (
            <p
              id={`${id}-description`}
              className="mt-2 text-sm leading-6 text-fg-secondary"
            >
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={busy}
          aria-label={uiText.close}
          onClick={onClose}
          className="ui-icon-button shrink-0"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
