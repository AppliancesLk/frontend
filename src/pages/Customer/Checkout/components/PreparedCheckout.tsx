import type { CheckoutSummary } from '../../../../types/checkout.types';
import { translations } from '../../../../utils/translations';
const t = translations.checkout;
export function PreparedCheckout({ summary }: { summary: CheckoutSummary }) {
  const delivery = summary.delivery;
  return (
    <section
      aria-labelledby="prepared-delivery"
      className="rounded-md border border-line bg-surface p-5  sm:p-6"
    >
      <h2 id="prepared-delivery" className="text-lg font-semibold text-fg">
        {t.confirmedDelivery}
      </h2>
      <address className="mt-4 space-y-1 break-words text-sm not-italic leading-6 text-fg-secondary">
        <p className="font-medium text-fg">
          {delivery.firstName} {delivery.lastName}
        </p>
        <p>{delivery.addressLine1}</p>
        {delivery.addressLine2 && <p>{delivery.addressLine2}</p>}
        <p>
          {delivery.city}, {delivery.postalCode}, {delivery.countryCode}
        </p>
        <p className="break-all">{delivery.email}</p>
        <p>{delivery.phone}</p>
      </address>
    </section>
  );
}
