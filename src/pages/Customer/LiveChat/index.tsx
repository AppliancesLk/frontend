import { useAuth } from '../../../hooks/useAuth';
import { useSupportChat } from '../../../hooks/useSupportChat';
import { ChatConversation } from '../../../components/chat/ChatConversation';
import { ChatSessionList } from '../../../components/chat/ChatSessionList';
import { ChatConnection } from '../../../components/chat/ChatConnection';
import { chatText as t } from '../../../utils/chatText';
export default function LiveChatPage() {
  const { user } = useAuth();
  return <CustomerChat key={user?.id} />;
}
function CustomerChat() {
  const chat = useSupportChat('CUSTOMER');
  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t.customerDescription}
            </p>
            <p className="mt-2 max-w-2xl text-xs text-slate-500">
              {t.retention}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void chat.create()}
            disabled={chat.creating}
            className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {chat.creating ? t.creating : t.newChat}
          </button>
        </header>
        <ChatConnection state={chat.connection} reconnect={chat.reconnect} />
        {chat.actionError && (
          <p
            role="alert"
            className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
          >
            {chat.actionError}
          </p>
        )}
        {chat.listError ? (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{chat.listError}</p>
            <button
              onClick={() => void chat.refresh()}
              className="mt-2 rounded underline"
            >
              {t.retry}
            </button>
          </div>
        ) : !chat.list ? (
          <p role="status">{t.loading}</p>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <aside className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-200 p-4 font-semibold text-slate-900">
                {t.sessions} · {chat.list.total}/5
              </h2>
              <ChatSessionList
                sessions={chat.list.items}
                selectedId={chat.selectedId}
                role="CUSTOMER"
                select={chat.select}
              />
            </aside>
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <ChatConversation chat={chat} />
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
