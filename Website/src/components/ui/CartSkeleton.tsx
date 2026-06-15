import { Skeleton } from "./skeleton";
import { Link } from "react-router-dom";

export const CartSkeleton = () => {
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Skeleton className="h-4 w-20" /> {/* "Your bag ({count})" skeleton */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
          <Skeleton className="h-5 w-5" /> {/* close button skeleton */}
        </div>
      </div>

      {/* Cart items skeleton */}
      <div className="flex-1 divide-y divide-border overflow-y-auto px-5">
        <div className="flex gap-4 py-5">
          {/* Image skeleton */}
          <Skeleton className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary" />
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Skeleton className="h-3 w-24" /> {/* product name */}
                <Skeleton className="mt-0.5 h-2 w-10" /> {/* size */}
              </div>
              <Skeleton className="text-sm font-semibold w-16" /> {/* price */}
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1">
                <Skeleton className="h-3.5 w-3.5" /> {/* decrement */}
                <Skeleton className="min-w-[1ch] text-sm font-medium" /> {/* quantity */}
                <Skeleton className="h-3.5 w-3.5" /> {/* increment */}
              </div>
              <Skeleton className="text-muted-foreground h-4 w-4" /> {/* remove button */}
            </div>
          </div>
        </div>
        <div className="flex gap-4 py-5">
          {/* Image skeleton */}
          <Skeleton className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary" />
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Skeleton className="h-3 w-24" /> {/* product name */}
                <Skeleton className="mt-0.5 h-2 w-10" /> {/* size */}
              </div>
              <Skeleton className="text-sm font-semibold w-16" /> {/* price }}</div>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1">
                <Skeleton className="h-3.5 w-3.5" /> {/* decrement */}
                <Skeleton className="min-w-[1ch] text-sm font-medium" /> {/* quantity */}
                <Skeleton className="h-3.5 w-3.5" /> {/* increment */}
              </div>
              <Skeleton className="text-muted-foreground h-4 w-4" /> {/* remove button */}
            </div>
          </div>
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="border-t border-border p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><Skeleton className="w-16" /><Skeleton className="w-16" /></div>
          <div className="flex justify-between"><Skeleton className="w-16" /><Skeleton className="w-16" /></div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><Skeleton className="w-16" /><Skeleton className="w-16" /></div>
        </dl>
        <Link to="/cart" className="mt-5 block w-full rounded-pill bg-foreground py-3.5 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90">
          <Skeleton className="h-4 w-32" /> {/* Checkout button skeleton */}
        </Link>
        <button className="mt-2 block w-full rounded-pill border border-border py-3 text-center text-sm font-medium transition-colors hover:bg-secondary">
          <Skeleton className="h-4 w-32" /> {/* Continue shopping button skeleton */}
        </button>
      </div>
    </>
  );
};