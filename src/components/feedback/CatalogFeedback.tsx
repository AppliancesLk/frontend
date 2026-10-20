import { LoadingState, ErrorState } from '../ui/Feedback';
export function CatalogFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={retry} />;
  return null;
}
