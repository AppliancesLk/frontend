import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { Icon } from '../common/Icon';
import { ChatConnection } from './ChatConnection';
import { uiText } from '../../utils/uiText';
import { chatText } from '../../utils/chatText';
import type { useSupportChat } from '../../hooks/useSupportChat';

function subscribe(listener: () => void) {
  const media = window.matchMedia('(max-width: 1023px)');
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
function isMobile() {
  return window.matchMedia('(max-width: 1023px)').matches;
}

export function ChatPane({
  chat,
  back,
  children,
}: {
  chat: ReturnType<typeof useSupportChat>;
  back: () => void;
  children: ReactNode;
}) {
  const mobile = useSyncExternalStore(subscribe, isMobile, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = chat.selectedId !== null;
  useEffect(() => {
    const element = dialog.current;
    if (!mobile || !selected || !element) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    const viewport = window.visualViewport;
    const resize = () => {
      element.style.height = `${viewport?.height ?? window.innerHeight}px`;
      element.style.top = `${viewport?.offsetTop ?? 0}px`;
    };
    resize();
    viewport?.addEventListener('resize', resize);
    viewport?.addEventListener('scroll', resize);
    return () => {
      viewport?.removeEventListener('resize', resize);
      viewport?.removeEventListener('scroll', resize);
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [mobile, selected]);
  if (!mobile)
    return (
      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {children}
      </section>
    );
  if (!selected) return null;
  return (
    <dialog
      ref={dialog}
      aria-label={chatText.conversation}
      onCancel={(event) => {
        event.preventDefault();
        back();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-hidden border-0 bg-white p-0 text-slate-900 backdrop:bg-slate-950/40"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
          <button
            type="button"
            onClick={back}
            className="ui-button ui-button-ghost shrink-0"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            {uiText.sessions}
          </button>
          <div className="min-w-0">
            <ChatConnection
              state={chat.connection}
              reconnect={chat.reconnect}
            />
          </div>
        </header>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </dialog>
  );
}
