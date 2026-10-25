import { LoadingState } from '../../../../../components/ui/Feedback';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/useAuth';
import { ROUTES } from '../../../../../constants/routes';
import { aiText } from '../../../../../utils/aiText';
import { useProductAiAssistant } from '../../hooks/useProductAiAssistant';
import { AiChatMessage } from './AiChatMessage';
import { AiChatInput } from './AiChatInput';

export function ProductAiAssistant({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { user } = useAuth();
  return (
    <AssistantPanel
      key={`${productId}-${user?.id ?? 'guest'}`}
      productId={productId}
      productName={productName}
    />
  );
}

function AssistantPanel({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const chat = useProductAiAssistant(productId);
  const launcher = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open) end.current?.scrollIntoView({ block: 'nearest' });
  }, [open, chat.messages, chat.sending, chat.error]);
  function close() {
    setOpen(false);
    requestAnimationFrame(() => launcher.current?.focus());
  }
  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  return (
    <aside className="product-assistant z-40" aria-label={aiText.title}>
      {open && (
        <section
          role="dialog"
          aria-labelledby="product-ai-title"
          aria-describedby="product-ai-context"
          onKeyDown={(event) => {
            if (
              event.key === 'Tab' &&
              window.matchMedia('(max-width: 767px)').matches
            ) {
              const controls = Array.from(
                event.currentTarget.querySelectorAll<HTMLElement>(
                  'button:not(:disabled), a[href], textarea:not(:disabled), input:not(:disabled), [tabindex="0"]',
                ),
              );
              const first = controls[0],
                last = controls[controls.length - 1];
              if (
                event.shiftKey &&
                (document.activeElement === first ||
                  document.activeElement === heading.current)
              ) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }
            if (event.key === 'Escape') {
              event.stopPropagation();
              close();
            }
          }}
          className="ai-panel flex flex-col overflow-hidden rounded-lg border border-line bg-raised shadow-lg"
        >
          <header className="flex items-start justify-between gap-3 border-b border-line bg-raised px-4 py-4">
            <div className="min-w-0">
              <h2
                id="product-ai-title"
                ref={heading}
                tabIndex={-1}
                className="font-semibold text-fg outline-none"
              >
                {aiText.title}
              </h2>
              <p
                id="product-ai-context"
                className="mt-1 truncate text-xs text-fg-muted"
              >
                {productName}
              </p>
              <details className="mt-2 text-xs text-fg-muted">
                <summary>About this assistant</summary>
                <p className="mt-2 max-w-xs leading-5">{aiText.providerNote}</p>
              </details>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={aiText.close}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-fg-secondary hover:bg-subtle ${focusStyle}`}
            >
              ✕
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <p className="text-sm leading-6 text-fg-secondary">
              {aiText.greeting}
            </p>
            {loading ? (
              <LoadingState label={aiText.checking} compact={true} />
            ) : !user ? (
              <Link
                to={ROUTES.login}
                state={{ from: location.pathname + location.search }}
                className={`mt-4 inline-block rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-on ${focusStyle}`}
              >
                {aiText.signIn}
              </Link>
            ) : (
              <>
                {chat.messages.length === 0 && (
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {aiText.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void chat.send(prompt)}
                        disabled={chat.sending}
                        className={`rounded-sm border border-primary px-3 py-2 text-left text-xs text-fg-link hover:bg-primary-subtle  ${focusStyle}`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
                <div
                  role="log"
                  aria-label={aiText.conversation}
                  aria-live="polite"
                  aria-relevant="additions"
                  className="mt-4 space-y-3"
                >
                  {chat.messages.map((message) => (
                    <AiChatMessage key={message.id} message={message} />
                  ))}
                </div>
                {chat.sending && (
                  <LoadingState label={aiText.sending} compact={true} />
                )}
                {chat.error && (
                  <div
                    role="alert"
                    className="mt-3 rounded-sm bg-danger-bg p-3 text-sm text-danger"
                  >
                    <p>{chat.error}</p>
                    <button
                      type="button"
                      onClick={chat.retry}
                      className={`mt-2 rounded font-medium underline ${focusStyle}`}
                    >
                      {aiText.retry}
                    </button>
                  </div>
                )}
                {chat.messages.length > 0 && (
                  <button
                    type="button"
                    onClick={chat.reset}
                    disabled={chat.sending}
                    className={`mt-3 rounded text-xs text-fg-link underline  ${focusStyle}`}
                  >
                    {aiText.newChat}
                  </button>
                )}
              </>
            )}
            <div ref={end} />
          </div>
          {user && (
            <AiChatInput
              disabled={chat.sending}
              send={(value) => void chat.send(value)}
            />
          )}
          <p className="px-4 pb-4 text-xs leading-5 text-fg-muted">
            {aiText.note}
          </p>
        </section>
      )}
      {!open && (
        <div className="flex justify-end">
          <button
            ref={launcher}
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className={`ai-launcher flex h-13 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-on shadow-lg hover:bg-primary-hover ${focusStyle}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-3 3V11.5A7.5 7.5 0 0 1 9.5 4h3A7.5 7.5 0 0 1 20 11.5Z" />
              <path d="m17 2 1-2 1 2 2 1-2 1-1 2-1-2-2-1Z" />
            </svg>
            {aiText.open}
          </button>
        </div>
      )}
    </aside>
  );
}
