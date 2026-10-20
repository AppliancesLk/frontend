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
        className={state === 'connected' ? 'text-success' : 'text-fg-muted'}
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
          className="rounded text-fg-link underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t.reconnect}
        </button>
      )}
      {state === 'error' && (
        <p role="alert" className="text-danger">
          {t.connectionError}
        </p>
      )}
    </div>
  );
}
