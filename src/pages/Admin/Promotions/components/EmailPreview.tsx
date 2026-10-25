import { useState } from 'react';
import { LoadingState } from '../../../../components/ui/Feedback';
import { promotionText as t } from '../../../../utils/promotionText';
export function EmailPreview({
  html,
  subject,
  loading = false,
  error = '',
}: {
  html?: string;
  subject?: string;
  loading?: boolean;
  error?: string;
}) {
  const [mobile, setMobile] = useState(false);
  return (
    <section
      aria-label={t.preview}
      className="min-w-0 rounded-lg border border-line bg-surface"
    >
      <div className="space-y-3 border-b border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{t.preview}</h2>
          <div
            className="flex gap-1 rounded-full bg-subtle p-1"
            role="group"
            aria-label="Email preview size"
          >
            {[false, true].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={mobile === value}
                onClick={() => setMobile(value)}
                className={`min-h-8 rounded-full px-3 text-xs ${mobile === value ? 'bg-primary text-primary-on' : 'text-fg-secondary'}`}
              >
                {value ? 'Mobile' : 'Desktop'}
              </button>
            ))}
          </div>
        </div>
        <p className="break-words text-xs text-fg-secondary">
          <span className="font-semibold">Subject:</span>{' '}
          {subject || 'Your promotion subject'}
        </p>
        <p className="text-xs leading-5 text-fg-muted">
          {t.previewHint}
          {loading ? ' Updating preview…' : ''}
        </p>
      </div>
      {error && (
        <p role="alert" className="m-4 text-sm text-danger">
          {error}
        </p>
      )}
      {html ? (
        <div className="overflow-hidden rounded-b-lg bg-subtle p-2 sm:p-3">
          <iframe
            title="Promotion email preview"
            sandbox=""
            srcDoc={html}
            className="mx-auto block h-[690px] max-w-full rounded-md border border-line bg-white"
            style={{ width: mobile ? 360 : '100%' }}
          />
        </div>
      ) : (
        <LoadingState compact label="Preparing email preview" />
      )}
    </section>
  );
}
