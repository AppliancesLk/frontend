import { formatCurrency } from '../../utils/currency';
export function Price({
  value,
  className = '',
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <span className={`price ${className}`}>
      <span className="font-medium text-fg-secondary">LKR</span>
      {'\u00a0'}
      {formatCurrency(value).slice(4)}
    </span>
  );
}
