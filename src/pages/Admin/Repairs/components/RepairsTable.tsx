import { Link } from 'react-router-dom';
import type { AdminRepairTicket } from '../../../../types/repair.types';
import { translations } from '../../../../utils/translations';
import { ROUTES } from '../../../../constants/routes';
import { RepairStatusBadge } from './RepairStatusBadge';

const t = translations.adminRepairs;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RepairsTable({ repairs }: { repairs: AdminRepairTicket[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
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
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="font-mono text-sm font-medium text-slate-900">
                    {repair.reference}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-slate-900">
                    {repair.customer.username}
                  </div>
                  <div className="text-sm text-slate-500">
                    {repair.customer.email}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-slate-900">
                    {repair.device.deviceType}
                  </div>
                  <div className="text-sm text-slate-500">
                    {repair.device.brand} {repair.device.model}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <RepairStatusBadge status={repair.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                  {formatDate(repair.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                  <Link
                    to={ROUTES.adminRepairDetail.replace(':id', repair.id)}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t.viewDetails}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
