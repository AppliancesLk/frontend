import { formatDate } from '../../../../utils/date';
import { Link } from 'react-router-dom';
import type { RepairerRepairTicket } from '../../../../types/repair.types';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';

interface RepairerRepairsTableProps {
  repairs: RepairerRepairTicket[];
}

export function RepairerRepairsTable({ repairs }: RepairerRepairsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="ui-table ui-card-table w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {repairs.map((repair) => (
              <tr
                key={repair.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td
                  data-label={'Reference'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900"
                >
                  <div className="ui-cell-value">{repair.reference}</div>
                </td>
                <td
                  data-label={'Customer'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-slate-700"
                >
                  <div className="ui-cell-value">
                    <div>
                      <div className="font-medium">
                        {repair.customer.username}
                      </div>
                      <div className="text-slate-500">
                        {repair.customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  data-label={'Device'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-slate-700"
                >
                  <div className="ui-cell-value">
                    <div>
                      <div className="font-medium">{repair.device.brand}</div>
                      <div className="text-slate-500">
                        {repair.device.model} ({repair.device.deviceType})
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  data-label={'Status'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm"
                >
                  <div className="ui-cell-value">
                    <RepairStatusBadge status={repair.status} />
                  </div>
                </td>
                <td
                  data-label={'Created'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-slate-500"
                >
                  <div className="ui-cell-value">
                    {formatDate(repair.createdAt)}
                  </div>
                </td>
                <td
                  data-label={'Actions'}
                  className="xl:whitespace-nowrap px-6 py-4 text-right text-sm"
                >
                  <div className="ui-cell-value">
                    <Link
                      to={`/repairer/repairs/${repair.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
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
