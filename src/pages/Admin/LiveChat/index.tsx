import { ChatPane } from '../../../components/chat/ChatPane';
import { useState } from 'react';
import { LoadingState } from '../../../components/ui/Feedback';
import { useAuth } from '../../../hooks/useAuth';
import { useSupportChat } from '../../../hooks/useSupportChat';
import { ChatConversation } from '../../../components/chat/ChatConversation';
import { ChatSessionList } from '../../../components/chat/ChatSessionList';
import { ChatConnection } from '../../../components/chat/ChatConnection';
import { chatText as t } from '../../../utils/chatText';
export default function AdminChatPage() {
  const { user } = useAuth();
  return <AdminChat key={user?.id} />;
}
function AdminChat() {
  const [showConversation, setShowConversation] = useState(false);
  const chat = useSupportChat('ADMIN');
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title text-fg">{t.adminTitle}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t.adminDescription}</p>
        </div>
        <ChatConnection state={chat.connection} reconnect={chat.reconnect} />
      </header>
      {chat.actionError && (
        <p
          role="alert"
          className="rounded-sm bg-danger-bg p-3 text-sm text-danger"
        >
          {chat.actionError}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside
          className={
            (showConversation && chat.selectedId ? 'hidden lg:block ' : '') +
            'min-w-0 rounded-md border border-line bg-surface '
          }
        >
          <div className="border-b border-line p-4">
            <h2 className="font-semibold text-fg">{t.sessions}</h2>
            <label
              htmlFor="chat-status"
              className="mt-3 block text-xs text-fg-muted"
            >
              {t.status}
            </label>
            <select
              id="chat-status"
              value={chat.status ?? ''}
              onChange={(event) =>
                chat.filter(
                  event.target.value === 'OPEN'
                    ? 'OPEN'
                    : event.target.value === 'CLOSED'
                      ? 'CLOSED'
                      : undefined,
                )
              }
              className="ui-field mt-1 min-h-11 w-full rounded-sm border border-line px-3 text-sm focus:outline-primary"
            >
              <option value="">{t.all}</option>
              <option value="OPEN">{t.open}</option>
              <option value="CLOSED">{t.closed}</option>
            </select>
          </div>
          {chat.listError ? (
            <div role="alert" className="p-4 text-sm text-danger">
              <p>{chat.listError}</p>
              <button
                onClick={() => void chat.refresh()}
                className="mt-2 rounded underline"
              >
                {t.retry}
              </button>
            </div>
          ) : !chat.list ? (
            <LoadingState label={t.loading} compact={true} />
          ) : (
            <>
              <ChatSessionList
                sessions={chat.list.items}
                selectedId={chat.selectedId}
                role="ADMIN"
                select={(id) => {
                  chat.select(id);
                  setShowConversation(true);
                }}
              />
              {chat.list.totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 border-t border-line p-3 text-sm">
                  <button
                    type="button"
                    disabled={chat.list.page <= 1}
                    onClick={() => chat.setPage(chat.list!.page - 1)}
                    className="ui-button ui-button-secondary rounded-sm border border-line px-3 py-2 "
                  >
                    {t.previous}
                  </button>
                  <span>
                    {chat.list.page}/{chat.list.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={chat.list.page >= chat.list.totalPages}
                    onClick={() => chat.setPage(chat.list!.page + 1)}
                    className="ui-button ui-button-secondary rounded-sm border border-line px-3 py-2 "
                  >
                    {t.next}
                  </button>
                </div>
              )}
            </>
          )}
        </aside>
        <ChatPane
          chat={chat}
          back={() => {
            chat.deselect();
            setShowConversation(false);
          }}
        >
          <ChatConversation key={chat.selectedId} chat={chat} admin />
        </ChatPane>
      </div>
    </section>
  );
}
