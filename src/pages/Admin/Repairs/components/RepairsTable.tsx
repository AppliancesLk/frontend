import { formatDate } from '../../../../utils/date';
import { Link } from 'react-router-dom';
import type { AdminRepairTicket } from '../../../../types/repair.types';
import { translations } from '../../../../utils/translations';
import { ROUTES } from '../../../../constants/routes';
import { RepairStatusBadge } from './RepairStatusBadge';

const t = translations.adminRepairs;

export function RepairsTable({ repairs }: { repairs: AdminRepairTicket[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface ">
      <div className="overflow-x-auto">
        <table className="ui-table ui-card-table min-w-full divide-y divide-line">
          <thead className="bg-page">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-fg"
              >
                {t.reference}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-fg"
              >
                {t.customer}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-fg"
              >
                {t.device}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-fg"
              >
                {t.status}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-fg"
              >
                {t.submittedDate}
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">{translations.admin.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {repairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-page transition-colors">
                <td
                  data-label={t.reference}
                  className="xl:whitespace-nowrap px-4 py-4"
                >
                  <div className="ui-cell-value">
                    <div className="tabular-nums text-sm font-medium text-fg">
                      {repair.reference}
                    </div>
                  </div>
                </td>
                <td data-label={t.customer} className="px-4 py-4">
                  <div className="ui-cell-value">
                    <div className="text-sm text-fg">
                      {repair.customer.username}
                    </div>
                    <div className="text-sm text-fg-muted">
                      {repair.customer.email}
                    </div>
                  </div>
                </td>
                <td data-label={t.device} className="px-4 py-4">
                  <div className="ui-cell-value">
                    <div className="text-sm text-fg">
                      {repair.device.deviceType}
                    </div>
                    <div className="text-sm text-fg-muted">
                      {repair.device.brand} {repair.device.model}
                    </div>
                  </div>
                </td>
                <td data-label={t.status} className="px-4 py-4">
                  <div className="ui-cell-value">
                    <RepairStatusBadge status={repair.status} />
                  </div>
                </td>
                <td
                  data-label={t.submittedDate}
                  className="xl:whitespace-nowrap px-4 py-4 text-sm text-fg-muted"
                >
                  <div className="ui-cell-value">
                    {formatDate(repair.createdAt)}
                  </div>
                </td>
                <td
                  data-label={translations.admin.actions}
                  className="xl:whitespace-nowrap px-4 py-4 text-right text-sm"
                >
                  <div className="ui-cell-value">
                    <Link
                      to={ROUTES.adminRepairDetail.replace(':id', repair.id)}
                      className="font-medium text-fg-link hover:text-fg-link"
                    >
                      {t.viewDetails}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
