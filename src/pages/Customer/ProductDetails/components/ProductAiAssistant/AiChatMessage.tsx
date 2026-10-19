import type { AiChatMessage as Message } from '../../../../../types/ai.types';
import { aiText } from '../../../../../utils/aiText';

export function AiChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={
        message.role === 'USER'
          ? 'ml-8 rounded-xl bg-blue-50 p-3'
          : 'mr-4 rounded-xl border border-slate-200 bg-white p-3'
      }
    >
      <p className="mb-1 text-xs font-semibold text-slate-500">
        {message.role === 'USER' ? aiText.you : aiText.assistant}
      </p>
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
        {message.content}
      </p>
    </div>
  );
}
