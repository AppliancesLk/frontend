import { cloneElement, useId, type ReactElement } from 'react';
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement<{ 'aria-describedby'?: string }>;
}) {
  const id = useId();
  return (
    <span className="ui-tooltip-host">
      {cloneElement(children, { 'aria-describedby': id })}
      <span role="tooltip" id={id} className="ui-tooltip">
        {label}
      </span>
    </span>
  );
}
