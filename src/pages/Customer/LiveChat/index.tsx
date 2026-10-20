import { ChatPane } from '../../../components/chat/ChatPane';
import { Spinner } from '../../../components/ui/Feedback';
import { Alert } from '../../../components/ui/Feedback';
import { useState } from 'react';
import { LoadingState } from '../../../components/ui/Feedback';
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
  const [showConversation, setShowConversation] = useState(false);
  const chat = useSupportChat('CUSTOMER');
  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-[1200px] space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="ui-page-title text-fg">{t.title}</h1>
            <p className="mt-2 text-sm text-fg-secondary">
              {t.customerDescription}
            </p>
            {chat.list && chat.list.total >= 4 && (
              <p className="mt-2 max-w-2xl text-xs text-fg-muted">
                {t.retention}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowConversation(true);
              void chat.create();
            }}
            disabled={chat.creating}
            className="ui-button ui-button-primary min-h-11 rounded-sm bg-primary px-4 text-sm font-medium text-primary-on hover:bg-primary-hover "
          >
            {chat.creating && <Spinner className="mr-2" />}
            {chat.creating ? t.creating : t.newChat}
          </button>
        </header>
        <ChatConnection state={chat.connection} reconnect={chat.reconnect} />
        {chat.actionError && (
          <Alert severity="warning">{chat.actionError}</Alert>
        )}
        {chat.listError ? (
          <div
            role="alert"
            className="rounded-sm bg-danger-bg p-4 text-sm text-danger"
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
          <LoadingState label={t.loading} compact={true} />
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <aside
              className={
                (showConversation && chat.selectedId
                  ? 'hidden lg:block '
                  : '') + 'min-w-0 rounded-md border border-line bg-surface '
              }
            >
              <h2 className="border-b border-line p-4 font-semibold text-fg">
                {t.sessions} · {chat.list.total}/5
              </h2>
              <ChatSessionList
                sessions={chat.list.items}
                selectedId={chat.selectedId}
                role="CUSTOMER"
                select={(id) => {
                  chat.select(id);
                  setShowConversation(true);
                }}
              />
            </aside>
            <ChatPane
              chat={chat}
              back={() => {
                chat.deselect();
                setShowConversation(false);
              }}
            >
              <ChatConversation key={chat.selectedId} chat={chat} />
            </ChatPane>
          </div>
        )}
      </section>
    </main>
  );
}
