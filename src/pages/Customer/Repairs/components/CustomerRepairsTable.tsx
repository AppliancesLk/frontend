import { useNavigate, Link, generatePath } from 'react-router-dom';
import { formatDate } from '../../../../utils/date';
import { Icon } from '../../../../components/common/Icon';
import { ROUTES } from '../../../../constants/routes';
import type { RepairTicket } from '../../../../types/repair.types';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';
export function CustomerRepairsTable({ repairs }: { repairs: RepairTicket[] }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <table className="ui-table ui-card-table customer-repairs-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Device</th>
            <th>Status</th>
            <th>Updated</th>
            <th>
              <span className="sr-only">View repair</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => {
            const url = generatePath(ROUTES.repairDetail, { id: repair.id });
            return (
              <tr
                key={repair.id}
                className="cursor-pointer"
                onClick={(event) => {
                  if (!(event.target as HTMLElement).closest('a'))
                    navigate(url);
                }}
              >
                <td data-label="Reference">
                  <div className="ui-cell-value">
                    <Link
                      className="font-semibold tabular-nums text-fg-link"
                      to={url}
                    >
                      {repair.reference}
                    </Link>
                  </div>
                </td>
                <td data-label="Device">
                  <div className="ui-cell-value flex items-start gap-3">
                    <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-subtle lg:flex">
                      <Icon name="appliance" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-fg">
                        {repair.device.brand} {repair.device.model}
                      </p>
                      <p className="mt-1 line-clamp-1 max-w-xs text-xs text-fg-muted">
                        {repair.problemDescription}
                      </p>
                    </div>
                  </div>
                </td>
                <td data-label="Status">
                  <div className="ui-cell-value">
                    <RepairStatusBadge status={repair.status} />
                  </div>
                </td>
                <td data-label="Updated">
                  <div className="ui-cell-value text-xs text-fg-muted">
                    <time dateTime={repair.updatedAt}>
                      {formatDate(repair.updatedAt)}
                    </time>
                  </div>
                </td>
                <td data-label="">
                  <div
                    className="ui-cell-value text-fg-muted"
                    aria-hidden="true"
                  >
                    ›
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
