import { TPCardSkeleton, TPTableSkeleton } from "@/design-system/components/TPSkeleton";

export default function AdminLoading() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-slate-50 animate-pulse rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TPCardSkeleton />
        <TPCardSkeleton />
        <TPCardSkeleton />
      </div>
      
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <TPTableSkeleton />
      </div>
    </div>
  );
}
