import { formatSpecificationValue } from '../helpers/product-details.helpers';
import { translations } from '../../../../utils/translations';
const t = translations.productDetails;
export function ProductSpecifications({
  specifications,
}: {
  specifications: Record<string, unknown> | null;
}) {
  const entries = Object.entries(specifications ?? {});
  return (
    <section
      id="specifications"
      aria-labelledby="specifications-title"
      className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <h2
        id="specifications-title"
        className="border-b border-slate-200 px-5 py-5 text-xl font-semibold text-slate-900 sm:px-8"
      >
        {t.specifications}
      </h2>
      {entries.length ? (
        <dl className="divide-y divide-slate-100">
          {entries.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 px-5 py-4 odd:bg-slate-50/60 sm:grid-cols-[minmax(140px,1fr)_2fr] sm:gap-6 sm:px-8"
            >
              <dt className="break-words text-sm font-medium text-slate-600">
                {label}
              </dt>
              <dd className="min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-slate-900">
                {formatSpecificationValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="p-5 text-sm leading-6 text-slate-500 sm:px-8">
          {t.noSpecifications}
        </p>
      )}
    </section>
  );
}
