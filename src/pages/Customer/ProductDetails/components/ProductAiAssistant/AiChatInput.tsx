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
      className="space-y-2 border-t border-line p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label
        htmlFor="product-ai-question"
        className="block text-sm font-medium text-fg-secondary"
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
        className="ui-field w-full resize-none rounded-sm border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-subtle"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-fg-muted">{value.length}/2000</span>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="ui-button ui-button-primary min-h-11 rounded-sm bg-primary px-4 text-sm font-medium text-primary-on hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed "
        >
          {aiText.send}
        </button>
      </div>
    </form>
  );
}
