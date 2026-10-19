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
  const chat = useSupportChat('ADMIN');
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {t.adminTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t.adminDescription}</p>
        </div>
        <ChatConnection state={chat.connection} reconnect={chat.reconnect} />
      </header>
      {chat.actionError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {chat.actionError}
        </p>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">{t.sessions}</h2>
            <label
              htmlFor="chat-status"
              className="mt-3 block text-xs text-slate-500"
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
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:outline-blue-500"
            >
              <option value="">{t.all}</option>
              <option value="OPEN">{t.open}</option>
              <option value="CLOSED">{t.closed}</option>
            </select>
          </div>
          {chat.listError ? (
            <div role="alert" className="p-4 text-sm text-red-700">
              <p>{chat.listError}</p>
              <button
                onClick={() => void chat.refresh()}
                className="mt-2 rounded underline"
              >
                {t.retry}
              </button>
            </div>
          ) : !chat.list ? (
            <p role="status" className="p-4">
              {t.loading}
            </p>
          ) : (
            <>
              <ChatSessionList
                sessions={chat.list.items}
                selectedId={chat.selectedId}
                role="ADMIN"
                select={chat.select}
              />
              {chat.list.totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 border-t border-slate-200 p-3 text-sm">
                  <button
                    type="button"
                    disabled={chat.list.page <= 1}
                    onClick={() => chat.setPage(chat.list!.page - 1)}
                    className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
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
                    className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                  >
                    {t.next}
                  </button>
                </div>
              )}
            </>
          )}
        </aside>
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ChatConversation chat={chat} admin />
        </section>
      </div>
    </section>
  );
}
