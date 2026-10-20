import { formatDate } from '../../../../utils/date';
import { Link } from 'react-router-dom';
import type { RepairerRepairTicket } from '../../../../types/repair.types';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';

interface RepairerRepairsTableProps {
  repairs: RepairerRepairTicket[];
}

export function RepairerRepairsTable({ repairs }: RepairerRepairsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface ">
      <div className="overflow-x-auto">
        <table className="ui-table ui-card-table w-full">
          <thead className="border-b border-line bg-page">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-fg-secondary">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-fg-secondary">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-fg-secondary">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-fg-secondary">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-fg-secondary">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-fg-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {repairs.map((repair) => (
              <tr key={repair.id} className="transition-colors hover:bg-page">
                <td
                  data-label={'Reference'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm font-medium text-fg"
                >
                  <div className="ui-cell-value">{repair.reference}</div>
                </td>
                <td
                  data-label={'Customer'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-fg-secondary"
                >
                  <div className="ui-cell-value">
                    <div>
                      <div className="font-medium">
                        {repair.customer.username}
                      </div>
                      <div className="text-fg-muted">
                        {repair.customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  data-label={'Device'}
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-fg-secondary"
                >
                  <div className="ui-cell-value">
                    <div>
                      <div className="font-medium">{repair.device.brand}</div>
                      <div className="text-fg-muted">
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
                  className="xl:whitespace-nowrap px-6 py-4 text-sm text-fg-muted"
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
                      className="font-medium text-fg-link hover:text-fg-link"
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
