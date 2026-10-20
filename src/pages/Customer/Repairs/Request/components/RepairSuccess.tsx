import { Link } from 'react-router-dom';
import type { RepairTicket } from '../../../../../types/repair.types';
import { translations } from '../../../../../utils/translations';
import { ROUTES } from '../../../../../constants/routes';

const t = translations.repairs;

export function RepairSuccess({ ticket }: { ticket: RepairTicket }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex min-h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-600">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-green-900">
            {t.ticketCreated}
          </h2>
          <p className="mt-2 text-sm text-green-800">{t.submitSuccess}</p>

          <div className="mt-4 space-y-3 rounded-lg bg-white p-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">
                {t.ticketReference}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {ticket.reference}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                {t.ticketStatus}
              </dt>
              <dd className="mt-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-amber-800">
                  {t.statuses[ticket.status] || ticket.status}
                </span>
              </dd>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.repairs} className="auth-primary text-center">
              {t.continueToRepairs}
            </Link>
            <Link to={ROUTES.products} className="auth-secondary text-center">
              {t.backToProducts}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
