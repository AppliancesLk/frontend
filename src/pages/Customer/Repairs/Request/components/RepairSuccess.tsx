import { Link, generatePath } from 'react-router-dom';
import type { RepairTicket } from '../../../../../types/repair.types';
import { translations } from '../../../../../utils/translations';
import { ROUTES } from '../../../../../constants/routes';
import { RatingPlate } from '../../../../../components/common/RatingPlate';
import { CopyReference } from '../../../../../components/common/CopyReference';
import { Icon } from '../../../../../components/common/Icon';
const t = translations.repairs;
export function RepairSuccess({ ticket }: { ticket: RepairTicket }) {
  return (
    <section
      className="mx-auto max-w-[760px] rounded-lg border border-line bg-surface p-6 sm:p-8"
      aria-label="Repair request confirmation"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
        <Icon name="check" className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-center text-2xl font-semibold">
        Repair request submitted
      </h2>
      <p className="mt-3 text-center text-sm text-fg-secondary">
        We have your request. You can follow every update in Your repairs.
      </p>
      <div className="mt-8">
        <RatingPlate
          title={ticket.reference}
          rows={[
            {
              label: 'Reference',
              value: (
                <span className="flex items-center gap-2">
                  {ticket.reference}
                  <CopyReference value={ticket.reference} />
                </span>
              ),
            },
            {
              label: 'Device',
              value: `${ticket.device.brand} ${ticket.device.model}`,
            },
            { label: 'Status', value: t.statuses[ticket.status] },
          ]}
        />
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to={generatePath(ROUTES.repairDetail, { id: ticket.id })}
          className="auth-primary"
        >
          View repair
        </Link>
        <Link to={ROUTES.repairs} className="auth-secondary">
          Back to your repairs
        </Link>
        <Link to={ROUTES.products} className="ui-button ui-button-ghost">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
