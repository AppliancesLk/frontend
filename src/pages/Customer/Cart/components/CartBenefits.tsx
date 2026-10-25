import { Icon, type IconName } from '../../../../components/common/Icon';
import { translations } from '../../../../utils/translations';
const t = translations.cart;
const benefits: { icon: IconName; title: string; description: string }[] = [
  { icon: 'lock', title: t.secureTitle, description: t.secureDescription },
  { icon: 'truck', title: t.deliveryTitle, description: t.deliveryDescription },
  { icon: 'shield', title: t.stockTitle, description: t.stockDescription },
  { icon: 'repair', title: t.supportTitle, description: t.supportDescription },
];
export function CartBenefits({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-md bg-primary-subtle p-5 ${compact ? 'cart-trust space-y-3' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-4'}`}
    >
      {benefits
        .slice(0, compact ? 3 : 4)
        .map(({ icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon
              name={icon}
              className={
                compact
                  ? 'h-4 w-4 shrink-0 text-fg-muted'
                  : 'h-8 w-8 shrink-0 text-fg-link'
              }
            />
            <div>
              <p className="text-sm font-semibold text-fg">{title}</p>
              <p
                className={
                  compact ? 'sr-only' : 'mt-1 text-xs leading-5 text-fg-muted'
                }
              >
                {description}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
