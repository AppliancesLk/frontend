import { useEffect, useRef } from 'react';
import type { useProductEdit } from '../hooks/useProductEdit';
import { translations } from '../../../../../utils/translations';
const t = translations.productEdit;
export function UnsavedChangesDialog({
  page,
}: {
  page: ReturnType<typeof useProductEdit>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const blocked = page.blocker.state === 'blocked';
  useEffect(() => {
    const element = dialog.current;
    if (blocked && !element?.open) element?.showModal();
    else if (!blocked && element?.open) element.close();
  }, [blocked]);
  function stay() {
    if (page.blocker.state === 'blocked') page.blocker.reset();
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="unsaved-title"
      aria-describedby="unsaved-description"
      onCancel={(event) => {
        event.preventDefault();
        stay();
      }}
      className="ui-dialog"
    >
      <h2 id="unsaved-title" className="text-xl font-semibold text-fg">
        {page.busy ? t.savingTitle : t.unsavedTitle}
      </h2>
      <p
        id="unsaved-description"
        className="mt-3 text-sm leading-6 text-fg-muted"
      >
        {page.busy ? t.savingDescription : t.unsavedDescription}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" autoFocus className="auth-primary" onClick={stay}>
          {t.keepEditing}
        </button>
        <button
          type="button"
          className="auth-secondary "
          disabled={page.busy}
          onClick={page.discard}
        >
          {t.discard}
        </button>
      </div>
    </dialog>
  );
}
