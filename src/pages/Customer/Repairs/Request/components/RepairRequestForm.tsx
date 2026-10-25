import { translations } from '../../../../../utils/translations';
import type { useRepairRequest } from '../hooks/useRepairRequest';

const t = translations.repairs;

const fields: {
  name: keyof ReturnType<typeof useRepairRequest>['draft'];
  label: string;
  maxLength: number;
  optional?: boolean;
  hint?: string;
  type?: string;
}[] = [
  {
    name: 'deviceType',
    label: t.deviceType,
    maxLength: 100,
    hint: t.deviceTypeHint,
  },
  {
    name: 'brand',
    label: t.brand,
    maxLength: 100,
    hint: t.brandHint,
  },
  {
    name: 'model',
    label: t.model,
    maxLength: 100,
    hint: t.modelHint,
  },
  {
    name: 'serialNumber',
    label: t.serialNumber,
    maxLength: 100,
    optional: true,
    hint: t.serialNumberHint,
  },
  {
    name: 'purchaseDate',
    label: t.purchaseDate,
    maxLength: 10,
    optional: true,
    hint: t.purchaseDateHint,
    type: 'date',
  },
];

export function RepairRequestForm({
  page,
}: {
  page: ReturnType<typeof useRepairRequest>;
}) {
  return (
    <form
      onSubmit={(event) => void page.submit(event)}
      noValidate
      className="repair-request-form space-y-6"
    >
      <div className="rounded-md border border-line bg-surface p-5  sm:p-6">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-fg">
          <span className="form-step-number">1</span>
          {t.deviceInformation}
        </h2>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          All fields are required unless marked optional.{' '}
          {t.deviceInformationDescription}
        </p>
        <fieldset
          disabled={page.submitting}
          className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2"
        >
          <legend className="sr-only">{t.deviceInformation}</legend>
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`repair-${field.name}`} className="auth-label">
                {field.label}
                {field.optional && (
                  <span className="ml-1 font-normal text-fg-muted">
                    {t.optional}
                  </span>
                )}
              </label>
              <input
                id={`repair-${field.name}`}
                name={field.name}
                type={field.type ?? 'text'}
                required={!field.optional}
                maxLength={field.maxLength}
                value={page.draft[field.name]}
                onChange={(event) =>
                  page.change(field.name, event.target.value)
                }
                aria-invalid={!!page.errors[field.name]}
                aria-describedby={
                  page.errors[field.name]
                    ? `${field.name}-error`
                    : field.hint
                      ? `${field.name}-hint`
                      : undefined
                }
                className={`auth-input ${page.errors[field.name] ? 'border-danger/25' : ''}`}
              />
              {field.hint && (
                <p
                  id={`${field.name}-hint`}
                  className="mt-1.5 text-xs leading-5 text-fg-muted"
                >
                  {field.hint}
                </p>
              )}
              {page.errors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="mt-1.5 text-sm text-danger"
                >
                  {page.errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </fieldset>
      </div>

      <div className="rounded-md border border-line bg-surface p-5  sm:p-6">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-fg">
          <span className="form-step-number">2</span>
          {t.problemDescription}
        </h2>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          {t.problemDescriptionHint}
        </p>
        <fieldset disabled={page.submitting} className="mt-6">
          <legend className="sr-only">{t.problemDescription}</legend>
          <label htmlFor="repair-problemDescription" className="auth-label">
            {t.problemDescriptionLabel}
          </label>
          <textarea
            id="repair-problemDescription"
            name="problemDescription"
            required
            maxLength={2000}
            rows={6}
            value={page.draft.problemDescription}
            onChange={(event) =>
              page.change('problemDescription', event.target.value)
            }
            aria-invalid={!!page.errors.problemDescription}
            aria-describedby={
              page.errors.problemDescription
                ? 'problemDescription-error'
                : undefined
            }
            className={`auth-input min-h-40 resize-y ${page.errors.problemDescription ? 'border-danger/25' : ''}`}
          />
          {page.errors.problemDescription && (
            <p
              id="problemDescription-error"
              className="mt-1.5 text-sm text-danger"
            >
              {page.errors.problemDescription}
            </p>
          )}
          <p className="mt-1.5 text-xs text-fg-muted">
            {page.draft.problemDescription.length} / 2000 characters
          </p>
        </fieldset>
      </div>

      {page.error && (
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-4 text-sm text-danger"
        >
          {page.error}
        </div>
      )}

      <div className="repair-submit-bar flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={page.submitting}
          className="auth-primary h-12 flex-1"
        >
          {page.submitting ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
