import type { ReactNode } from 'react';
export function RatingPlate({
  title,
  reference,
  rows,
  footer,
}: {
  title: string;
  reference?: string;
  rows: { label: string; value: ReactNode }[];
  footer?: ReactNode;
}) {
  return (
    <div className="rating-plate">
      <div className="plate-heading">
        <span>{title}</span>
        {reference && <span className="plate-reference">{reference}</span>}
      </div>
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="plate-row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {footer && <div className="plate-footer">{footer}</div>}
    </div>
  );
}
