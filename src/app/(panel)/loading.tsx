import { Skeleton } from "@/components/ui/Skeleton";

export default function PanelLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-pro-surface rounded-xl border border-pro-border p-4 sm:p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
