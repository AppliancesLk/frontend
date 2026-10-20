import { Spinner } from '../ui/Feedback';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { uiText } from '../../utils/uiText';
import { LoadingState } from '../ui/Feedback';
import { useEffect, useRef, useState } from 'react';
import type { useSupportChat } from '../../hooks/useSupportChat';
import { chatText as t } from '../../utils/chatText';
import { formatDate } from '../../utils/date';

export function ChatConversation({
  chat,
  admin = false,
}: {
  chat: ReturnType<typeof useSupportChat>;
  admin?: boolean;
}) {
  const [confirmClose, setConfirmClose] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const view = chat.conversation;
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [chat.selectedId, view?.messages.length]);
  if (!chat.selectedId)
    return (
      <div className="flex min-h-80 items-center justify-center p-8 text-center text-sm text-slate-500">
        {t.select}
      </div>
    );
  if (chat.historyError)
    return (
      <div role="alert" className="p-6 text-sm text-red-700">
        <p>{chat.historyError}</p>
        <button
          type="button"
          onClick={chat.retryHistory}
          className="ui-button ui-button-secondary mt-3 rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
        >
          {t.retry}
        </button>
      </div>
    );
  if (!view) return <LoadingState label={t.historyLoading} compact={true} />;
  const { session, messages } = view;
  return (
    <div className="chat-conversation">
      <Dialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title={uiText.closeChat}
        description={uiText.closeChatDescription}
        busy={chat.closing}
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            disabled={chat.closing}
            onClick={() => setConfirmClose(false)}
          >
            {uiText.cancel}
          </Button>
          <Button
            variant="danger"
            busy={chat.closing}
            onClick={async () => {
              await chat.close();
              setConfirmClose(false);
            }}
          >
            {t.close}
          </Button>
        </div>
      </Dialog>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
        <div className="min-w-0">
          <h2 className="break-words font-semibold text-slate-900">
            {admin ? (session.customer?.username ?? t.customer) : t.support}
          </h2>
          {admin && (
            <p className="mt-1 break-all text-sm text-slate-500">
              {session.customer?.email}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            <StatusBadge status={session.status}>
              {session.status === 'OPEN' ? t.open : t.closed}
            </StatusBadge>
            {' · '}
            {session.messageCount}/100 · {formatDate(session.createdAt)}
          </p>
        </div>
        {admin && session.status === 'OPEN' && (
          <button
            type="button"
            onClick={() => setConfirmClose(true)}
            disabled={chat.closing}
            className="ui-button ui-button-secondary min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {chat.closing && <Spinner className="mr-2" />}
            {chat.closing ? t.closing : t.close}
          </button>
        )}
      </header>
      <div
        role="log"
        aria-label={t.conversation}
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
        className="chat-message-log flex-1 space-y-4 overflow-y-auto overscroll-contain bg-slate-50 p-4 focus-visible:outline-2 focus-visible:outline-blue-500 sm:p-5"
      >
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            {t.noMessages}
          </p>
        )}
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[90%] rounded-xl px-4 py-3 sm:max-w-[80%] ${message.senderRole === chat.role ? 'ml-auto bg-blue-600 text-white' : 'mr-auto border border-slate-200 bg-white text-slate-900'}`}
          >
            <p
              className={`mb-1 text-xs font-semibold ${message.senderRole === chat.role ? 'text-blue-100' : 'text-slate-500'}`}
            >
              {message.senderUserId === chat.userId
                ? t.you
                : message.senderRole === 'ADMIN'
                  ? t.support
                  : t.customer}
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6">
              {message.content}
            </p>
            <time
              dateTime={message.createdAt}
              className={`mt-2 block text-xs ${message.senderRole === chat.role ? 'text-blue-100' : 'text-slate-500'}`}
            >
              {formatDate(message.createdAt)}
            </time>
          </article>
        ))}
        <div ref={end} />
      </div>
      {session.messageCount >= 100 ? (
        <p
          role="status"
          className="border-t border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          {admin ? t.adminLimit : t.limit}
        </p>
      ) : session.status === 'CLOSED' ? (
        <p
          role="status"
          className="border-t border-slate-200 bg-slate-100 p-4 text-sm text-slate-600"
        >
          {t.closedNotice}
        </p>
      ) : (
        <ChatComposer
          key={session.id}
          value={chat.draft}
          setValue={(value) => chat.setDraft(session.id, value)}
          disabled={
            chat.sending || chat.connection !== 'connected' || !!chat.sendError
          }
          sending={chat.sending}
          send={chat.submit}
        />
      )}
      {chat.sendError && (
        <div
          role="alert"
          className="border-t border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{chat.sendError}</p>
          <button
            type="button"
            disabled={chat.sending || chat.connection !== 'connected'}
            onClick={chat.retrySend}
            className="mt-2 rounded font-medium underline disabled:opacity-50"
          >
            {t.retry}
          </button>
        </div>
      )}
    </div>
  );
}
function ChatComposer({
  value,
  setValue,
  disabled,
  sending,
  send,
}: {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  sending: boolean;
  send: (text: string) => Promise<boolean>;
}) {
  const inFlight = useRef(false);
  async function submit() {
    if (disabled || inFlight.current || !value.trim()) return;
    inFlight.current = true;
    try {
      if (await send(value)) setValue('');
    } finally {
      inFlight.current = false;
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="sticky bottom-0 space-y-2 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <label
        htmlFor="support-message"
        className="block text-sm font-medium text-slate-700"
      >
        {t.label}
      </label>
      <textarea
        id="support-message"
        rows={2}
        maxLength={2000}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t.placeholder}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            void submit();
          }
        }}
        className="ui-field w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {t.textOnly} · {value.length}/2000
        </span>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="ui-button ui-button-primary min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {sending && <Spinner className="mr-2" />}
          {sending ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
