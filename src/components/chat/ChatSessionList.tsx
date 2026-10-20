import { StatusBadge } from '../ui/StatusBadge';
import type { ChatRole, ChatSession } from '../../types/chat.types';
import { chatText as t } from '../../utils/chatText';
import { formatDate } from '../../utils/date';
export function ChatSessionList({
  sessions,
  selectedId,
  role,
  select,
}: {
  sessions: ChatSession[];
  selectedId: string | null;
  role: ChatRole;
  select: (id: string) => void;
}) {
  return (
    <nav
      aria-label={t.sessions}
      className="max-h-[32rem] space-y-2 overflow-y-auto p-3"
    >
      {sessions.length === 0 && (
        <p className="p-4 text-sm text-slate-500">{t.empty}</p>
      )}
      {sessions.map((session) => {
        const unread =
          role === 'ADMIN'
            ? session.adminUnreadCount
            : session.customerUnreadCount;
        return (
          <button
            key={session.id}
            type="button"
            aria-pressed={selectedId === session.id}
            onClick={() => select(session.id)}
            className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${selectedId === session.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="min-w-0 truncate font-semibold text-slate-900">
                {role === 'ADMIN'
                  ? (session.customer?.username ?? t.customer)
                  : `${t.newConversation} · ${session.id.slice(0, 8)}`}
              </span>
              <StatusBadge status={session.status}>
                {session.status === 'OPEN' ? t.open : t.closed}
              </StatusBadge>
            </span>
            {role === 'ADMIN' && (
              <span className="mt-1 block truncate text-xs text-slate-500">
                {session.customer?.email}
              </span>
            )}
            <span className="mt-3 block truncate text-sm text-slate-600">
              {session.lastMessagePreview || t.noMessages}
            </span>
            <span className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <time dateTime={session.lastMessageAt}>
                {formatDate(session.lastMessageAt)}
              </time>
              <span>{session.messageCount}/100</span>
            </span>
            {unread > 0 && (
              <span className="mt-2 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                {unread} {t.unread}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
