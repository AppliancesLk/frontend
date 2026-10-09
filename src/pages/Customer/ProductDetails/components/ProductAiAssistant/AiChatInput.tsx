import { useState } from 'react';
import { aiText } from '../../../../../utils/aiText';

export function AiChatInput({
  disabled,
  send,
}: {
  disabled: boolean;
  send: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  function submit() {
    if (disabled || !value.trim()) return;
    send(value);
    setValue('');
  }
  return (
    <form
      className="space-y-2 border-t border-slate-200 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label
        htmlFor="product-ai-question"
        className="block text-sm font-medium text-slate-700"
      >
        {aiText.label}
      </label>
      <textarea
        id="product-ai-question"
        rows={2}
        maxLength={2000}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        placeholder={aiText.placeholder}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            submit();
          }
        }}
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">{value.length}/2000</span>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {aiText.send}
        </button>
      </div>
    </form>
  );
}
