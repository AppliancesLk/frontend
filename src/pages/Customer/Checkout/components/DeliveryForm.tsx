import { Spinner } from '../../../../components/ui/Feedback';
import { translations } from '../../../../utils/translations';
import type { useCheckoutPage } from '../hooks/useCheckoutPage';
import type { DeliveryDraft } from '../types/checkout.types';
const t = translations.checkout;
const fields: {
  name: keyof DeliveryDraft;
  label: string;
  autoComplete: string;
  type?: string;
  maxLength: number;
  full?: boolean;
  optional?: boolean;
  hint?: string;
}[] = [
  {
    name: 'firstName',
    label: t.firstName,
    autoComplete: 'given-name',
    maxLength: 80,
  },
  {
    name: 'lastName',
    label: t.lastName,
    autoComplete: 'family-name',
    maxLength: 80,
  },
  {
    name: 'email',
    label: t.email,
    autoComplete: 'email',
    type: 'email',
    maxLength: 254,
  },
  {
    name: 'phone',
    label: t.phone,
    autoComplete: 'tel',
    type: 'tel',
    maxLength: 30,
    hint: t.phoneHint,
  },
  {
    name: 'addressLine1',
    label: t.addressLine1,
    autoComplete: 'address-line1',
    maxLength: 200,
    full: true,
  },
  {
    name: 'addressLine2',
    label: t.addressLine2,
    autoComplete: 'address-line2',
    maxLength: 200,
    full: true,
    optional: true,
  },
  {
    name: 'city',
    label: t.city,
    autoComplete: 'address-level2',
    maxLength: 100,
  },
  {
    name: 'postalCode',
    label: t.postalCode,
    autoComplete: 'postal-code',
    maxLength: 20,
  },
  {
    name: 'countryCode',
    label: t.countryCode,
    autoComplete: 'country',
    maxLength: 2,
    hint: t.countryHint,
  },
];
export function DeliveryForm({
  page,
}: {
  page: ReturnType<typeof useCheckoutPage>;
}) {
  const blocked =
    !page.cart?.items.length ||
    page.cart.items.some((item) => !item.isAvailable);
  return (
    <form
      onSubmit={(event) => void page.submit(event)}
      noValidate
      className="rounded-md border border-line bg-surface p-5  sm:p-6"
    >
      <h2 className="flex items-center gap-3 text-xl font-semibold text-fg">
        <span className="form-step-number">1</span>
        {t.deliveryTitle}
      </h2>
      <p className="mt-2 text-sm leading-6 text-fg-muted">
        {t.deliveryDescription}
      </p>
      <fieldset
        disabled={page.locked}
        className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2"
      >
        <legend className="sr-only">{t.deliveryTitle}</legend>
        {fields.map((field) => (
          <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
            <label htmlFor={`checkout-${field.name}`} className="auth-label">
              {field.label}
              {field.optional && (
                <span className="ml-1 font-normal text-fg-muted">
                  {t.optional}
                </span>
              )}
            </label>
            <input
              id={`checkout-${field.name}`}
              name={field.name}
              type={field.type ?? 'text'}
              autoComplete={field.autoComplete}
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
      <div className="mt-6 border-t border-line pt-5">
        <button
          type="submit"
          disabled={page.locked || blocked}
          className="auth-primary h-12 w-full"
        >
          {page.saving && <Spinner className="mr-2" />}
          {page.saving
            ? t.preparing
            : page.summary
              ? t.validateAgain
              : t.prepare}
        </button>
        <p className="mt-3 text-xs leading-5 text-fg-muted">{t.prepareHint}</p>
      </div>
    </form>
  );
}
