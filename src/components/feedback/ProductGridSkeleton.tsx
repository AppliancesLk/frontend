import { Skeleton } from '../ui/Feedback';
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products">
      <span className="sr-only">Loading products…</span>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="rounded-md border border-line-subtle bg-surface p-3"
          >
            <Skeleton className="mb-4 aspect-square w-full" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-5 h-5 w-3/4" />
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
