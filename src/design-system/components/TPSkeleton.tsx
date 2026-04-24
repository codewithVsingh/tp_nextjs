"use client";

import { cn } from "@/lib/utils";

/**
 * TPSkeleton: Standardized loading patterns for INDL compliance.
 * Use this to maintain layout integrity during data fetching.
 */
export const TPSkeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-100", className)}
      {...props}
    />
  );
};

export const TPTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-4 p-4">
    <div className="flex gap-4">
      {[1, 2, 3, 4].map((i) => (
        <TPSkeleton key={i} className="h-10 flex-1" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <TPSkeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

export const TPCardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 p-6 space-y-4">
    <TPSkeleton className="h-4 w-1/3" />
    <TPSkeleton className="h-8 w-full" />
    <div className="flex gap-2">
      <TPSkeleton className="h-4 w-12" />
      <TPSkeleton className="h-4 w-12" />
    </div>
  </div>
);
