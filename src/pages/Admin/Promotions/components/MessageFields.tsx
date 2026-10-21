import type { PromotionContent } from '../../../../types/promotion.types';
import { promotionText as t } from '../../../../utils/promotionText';
const fields = [
  ['subject', t.subject, 150],
  ['headline', t.headline, 120],
  ['preheader', t.preheader, 180],
  ['body', t.body, 6000],
  ['buttonText', t.button, 40],
  ['buttonUrl', t.buttonUrl, 1000],
  ['footerNote', t.footer, 240],
] as const;
export function MessageFields({
  draft,
  onChange,
}: {
  draft: PromotionContent;
  onChange: (value: PromotionContent) => void;
}) {
  return (
    <section className="ui-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Write your email</h2>
      <div className="mt-5 space-y-5">
        {fields.map(([key, label, max]) => (
          <div key={key}>
            <label htmlFor={`promotion-${key}`} className="auth-label">
              {label}
            </label>
            {key === 'body' || key === 'footerNote' ? (
              <textarea
                id={`promotion-${key}`}
                rows={key === 'body' ? 9 : 3}
                className={`ui-field py-3 ${key === 'body' ? 'min-h-64' : 'min-h-24'}`}
                maxLength={max}
                value={draft[key]}
                onChange={(e) => onChange({ ...draft, [key]: e.target.value })}
              />
            ) : (
              <input
                id={`promotion-${key}`}
                type={key === 'buttonUrl' ? 'url' : 'text'}
                className="ui-field"
                maxLength={max}
                value={draft[key]}
                onChange={(e) => onChange({ ...draft, [key]: e.target.value })}
              />
            )}
            {key === 'body' && (
              <p className="mt-2 text-xs leading-5 text-fg-muted">
                {t.bodyHint}
              </p>
            )}
            {key === 'buttonUrl' && (
              <p className="mt-2 text-xs text-fg-muted">{t.buttonHint}</p>
            )}
            <p className="mt-1 text-right text-xs text-fg-muted">
              {draft[key].length} / {max}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
