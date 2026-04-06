import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-pro-surface-alt",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-pro-surface rounded-xl border border-pro-border p-4 sm:p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
