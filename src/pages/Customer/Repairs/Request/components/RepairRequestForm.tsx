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
      className="space-y-6"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.deviceInformation}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
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
                  <span className="ml-1 font-normal text-slate-500">
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
                onChange={(event) => page.change(field.name, event.target.value)}
                aria-invalid={!!page.errors[field.name]}
                aria-describedby={
                  page.errors[field.name]
                    ? `${field.name}-error`
                    : field.hint
                      ? `${field.name}-hint`
                      : undefined
                }
                className={`auth-input ${page.errors[field.name] ? 'border-red-500' : ''}`}
              />
              {field.hint && (
                <p
                  id={`${field.name}-hint`}
                  className="mt-1.5 text-xs leading-5 text-slate-500"
                >
                  {field.hint}
                </p>
              )}
              {page.errors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="mt-1.5 text-sm text-red-700"
                >
                  {page.errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </fieldset>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.problemDescription}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
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
            className={`auth-input resize-none ${page.errors.problemDescription ? 'border-red-500' : ''}`}
          />
          {page.errors.problemDescription && (
            <p
              id="problemDescription-error"
              className="mt-1.5 text-sm text-red-700"
            >
              {page.errors.problemDescription}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">
            {page.draft.problemDescription.length} / 2000 characters
          </p>
        </fieldset>
      </div>

      {page.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {page.error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
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
