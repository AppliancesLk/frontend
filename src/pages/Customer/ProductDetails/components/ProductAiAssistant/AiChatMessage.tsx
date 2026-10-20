import type { AiChatMessage as Message } from '../../../../../types/ai.types';
import { aiText } from '../../../../../utils/aiText';

export function AiChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={
        message.role === 'USER'
          ? 'ml-8 rounded-md bg-primary-subtle p-3'
          : 'mr-4 rounded-md border border-line bg-surface p-3'
      }
    >
      <p className="mb-1 text-xs font-semibold text-fg-muted">
        {message.role === 'USER' ? aiText.you : aiText.assistant}
      </p>
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-fg">
        {message.content}
      </p>
    </div>
  );
}
