import { chatText as t } from '../../utils/chatText';
export function ChatConnection({
  state,
  reconnect,
}: {
  state: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnect: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <p
        role="status"
        className={state === 'connected' ? 'text-green-700' : 'text-slate-500'}
      >
        {state === 'connected'
          ? t.connected
          : state === 'connecting'
            ? t.connecting
            : t.disconnected}
      </p>
      {state !== 'connected' && (
        <button
          type="button"
          onClick={reconnect}
          className="rounded text-blue-700 underline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          {t.reconnect}
        </button>
      )}
      {state === 'error' && (
        <p role="alert" className="text-red-700">
          {t.connectionError}
        </p>
      )}
    </div>
  );
}
