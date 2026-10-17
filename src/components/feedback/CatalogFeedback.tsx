import { translations } from '../../utils/translations';
export function CatalogFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  if (loading)
    return (
      <p
        role="status"
        className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500"
      >
        {translations.admin.loading}
      </p>
    );
  if (error)
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5"
      >
        <p className="text-sm text-red-700">{error}</p>
        <button className="auth-secondary mt-4" onClick={retry}>
          {translations.common.retry}
        </button>
      </div>
    );
  return null;
}
