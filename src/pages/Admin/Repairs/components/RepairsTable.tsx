import { formatDate } from '../../../../utils/date';
import { Link } from 'react-router-dom';
import type { AdminRepairTicket } from '../../../../types/repair.types';
import { translations } from '../../../../utils/translations';
import { ROUTES } from '../../../../constants/routes';
import { RepairStatusBadge } from './RepairStatusBadge';

const t = translations.adminRepairs;

export function RepairsTable({ repairs }: { repairs: AdminRepairTicket[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="ui-table ui-card-table min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              >
                {t.reference}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              >
                {t.customer}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              >
                {t.device}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              >
                {t.status}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              >
                {t.submittedDate}
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">{translations.admin.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {repairs.map((repair) => (
              <tr
                key={repair.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td
                  data-label={t.reference}
                  className="xl:whitespace-nowrap px-4 py-4"
                >
                  <div className="ui-cell-value">
                    <div className="tabular-nums text-sm font-medium text-slate-900">
                      {repair.reference}
                    </div>
                  </div>
                </td>
                <td data-label={t.customer} className="px-4 py-4">
                  <div className="ui-cell-value">
                    <div className="text-sm text-slate-900">
                      {repair.customer.username}
                    </div>
                    <div className="text-sm text-slate-500">
                      {repair.customer.email}
                    </div>
                  </div>
                </td>
                <td data-label={t.device} className="px-4 py-4">
                  <div className="ui-cell-value">
                    <div className="text-sm text-slate-900">
                      {repair.device.deviceType}
                    </div>
                    <div className="text-sm text-slate-500">
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
                  className="xl:whitespace-nowrap px-4 py-4 text-sm text-slate-500"
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
                      className="font-medium text-blue-600 hover:text-blue-700"
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
