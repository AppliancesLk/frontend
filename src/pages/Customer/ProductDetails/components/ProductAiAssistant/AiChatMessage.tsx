import type { AiChatMessage as Message } from '../../../../../types/ai.types';
import { aiText } from '../../../../../utils/aiText';

export function AiChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={
        message.role === 'USER'
          ? 'ai-message ai-message-user ml-10 rounded-2xl bg-primary-subtle px-4 py-3'
          : 'ai-message ai-message-assistant mr-2 rounded-xl border border-line bg-surface px-4 py-4'
      }
    >
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-fg">
        {message.content}
      </p>
      <p className="mt-2 text-[11px] text-fg-muted">
        {message.role === 'USER' ? aiText.you : aiText.assistant} · Just now
      </p>
    </div>
  );
}
