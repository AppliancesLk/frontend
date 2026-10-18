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
      className={`rounded-xl bg-blue-50 p-5 ${compact ? 'space-y-5' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-4'}`}
    >
      {benefits
        .slice(0, compact ? 3 : 4)
        .map(({ icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon name={icon} className="h-8 w-8 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
