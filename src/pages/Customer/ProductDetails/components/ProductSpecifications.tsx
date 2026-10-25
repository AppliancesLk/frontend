import { RatingPlate } from '../../../../components/common/RatingPlate';
import {
  formatSpecificationValue,
  getSpecificationEntries,
  formatSpecificationLabel,
} from '../helpers/product-details.helpers';
import { translations } from '../../../../utils/translations';
const t = translations.productDetails;
export function ProductSpecifications({
  specifications,
}: {
  specifications: Record<string, unknown> | null;
}) {
  const entries = getSpecificationEntries(specifications);
  return (
    <section
      id="specifications"
      aria-labelledby="specifications-title"
      className="scroll-mt-6"
    >
      <h2 id="specifications-title" className="sr-only">
        {t.specifications}
      </h2>
      {entries.length ? (
        <RatingPlate
          title={t.specifications}
          rows={entries.map(([label, value]) => ({
            label: formatSpecificationLabel(label),
            value: formatSpecificationValue(value),
          }))}
        />
      ) : (
        <p className="p-5 text-sm leading-6 text-fg-muted sm:px-8">
          {t.noSpecifications}
        </p>
      )}
    </section>
  );
}
