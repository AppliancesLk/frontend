import { Icon, type IconName } from '../../../components/common/Icon';
export function CategoryIcon({
  name,
  className = 'h-5 w-5',
}: {
  name: string;
  className?: string;
}) {
  let icon: IconName = 'grid';
  if (/phone|mobile|tablet/i.test(name)) icon = 'phone';
  else if (/laptop|computer/i.test(name)) icon = 'laptop';
  else if (/audio|headphone|earbud|accessor/i.test(name)) icon = 'headphones';
  else if (/watch/i.test(name)) icon = 'watch';
  else if (/appliance|kitchen|laundry/i.test(name)) icon = 'appliance';
  return <Icon name={icon} className={className} />;
}
