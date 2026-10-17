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
        <table className="w-full">
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
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {repair.reference}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                  <div>
                    <div className="font-medium">{repair.customer.username}</div>
                    <div className="text-slate-500">{repair.customer.email}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                  <div>
                    <div className="font-medium">{repair.device.brand}</div>
                    <div className="text-slate-500">
                      {repair.device.model} ({repair.device.deviceType})
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <RepairStatusBadge status={repair.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {new Date(repair.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <Link
                    to={`/repairer/repairs/${repair.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details
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
