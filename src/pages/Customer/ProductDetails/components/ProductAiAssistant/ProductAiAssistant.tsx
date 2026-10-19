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
    launcher.current?.focus();
  }
  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  return (
    <aside
      className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
      aria-label={aiText.title}
    >
      {open && (
        <section
          role="dialog"
          aria-labelledby="product-ai-title"
          aria-describedby="product-ai-context"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              close();
            }
          }}
          className="mb-3 flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-[25rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
        >
          <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-blue-50 px-4 py-3">
            <div className="min-w-0">
              <h2
                id="product-ai-title"
                ref={heading}
                tabIndex={-1}
                className="font-semibold text-slate-900 outline-none"
              >
                {aiText.title}
              </h2>
              <p
                id="product-ai-context"
                className="mt-1 truncate text-xs text-slate-600"
              >
                {productName}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={aiText.close}
              className={`rounded-lg px-2 py-1 text-slate-600 hover:bg-blue-100 ${focusStyle}`}
            >
              ✕
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <p className="text-sm leading-6 text-slate-700">
              {aiText.greeting}
            </p>
            {loading ? (
              <p role="status" className="mt-3 text-sm text-slate-500">
                {aiText.checking}
              </p>
            ) : !user ? (
              <Link
                to={ROUTES.login}
                state={{ from: location.pathname + location.search }}
                className={`mt-4 inline-block rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white ${focusStyle}`}
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
                        className={`rounded-lg border border-blue-200 px-3 py-2 text-left text-xs text-blue-700 hover:bg-blue-50 disabled:opacity-50 ${focusStyle}`}
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
                  <p role="status" className="mt-3 text-sm text-slate-500">
                    {aiText.sending}
                  </p>
                )}
                {chat.error && (
                  <div
                    role="alert"
                    className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
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
                    className={`mt-3 rounded text-xs text-blue-700 underline disabled:opacity-50 ${focusStyle}`}
                  >
                    {aiText.newChat}
                  </button>
                )}
              </>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-500">
              {aiText.note}
            </p>
            <div ref={end} />
          </div>
          {user && (
            <AiChatInput
              disabled={chat.sending || !!chat.error}
              send={(value) => void chat.send(value)}
            />
          )}
        </section>
      )}
      <div className="flex justify-end">
        <button
          ref={launcher}
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={`flex h-12 items-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-lg hover:bg-blue-700 ${focusStyle}`}
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
    </aside>
  );
}
