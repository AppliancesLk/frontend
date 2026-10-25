import { useState } from 'react';
import { Icon } from './Icon';
export function CopyReference({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError(true);
    }
  }
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="ui-icon-button h-8 w-8"
        onClick={() => void copy()}
        aria-label={copied ? 'Copied reference' : 'Copy full reference'}
        title={value}
      >
        <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
      </button>
      <span className="sr-only" role="status">
        {copied ? 'Copied' : error ? `Could not copy. Reference: ${value}` : ''}
      </span>
    </span>
  );
}
