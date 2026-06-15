import { Skeleton } from "./skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
        {/* Image skeleton */}
        <Skeleton className="h-full w-full" />

        {/* Badges skeleton */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          <Skeleton className="rounded-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" />
          <Skeleton className="rounded-pill bg-foreground/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" />
        </div>

        {/* Wishlist skeleton */}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-card">
          <Skeleton className="h-4 w-4" />
        </div>

        {/* Quick add skeleton */}
        <div className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 rounded-pill bg-background/95 py-3 text-sm font-semibold text-foreground shadow-pop backdrop-blur md:flex">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="text-sm font-semibold" />
        </div>

        {/* Sold out skeleton */}
        <div className="absolute inset-x-0 bottom-0 bg-background/90 py-2 text-center text-xs font-semibold uppercase tracking-wider backdrop-blur">
          <Skeleton className="w-16" />
        </div>
      </div>

      <div className="mt-3 px-0.5">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-40" />
        {/* Tagline skeleton */}
        <Skeleton className="mt-1 h-3 w-32" />

        {/* Color swatches skeleton */}
        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton className="h-3 w-3 rounded-full border border-border" />
          <Skeleton className="h-3 w-3 rounded-full border border-border" />
          <Skeleton className="h-3 w-3 rounded-full border border-border" />
          <Skeleton className="text-[10px] text-muted-foreground" />
        </div>

        {/* Price skeleton */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <Skeleton className="text-sm font-semibold" />
          <Skeleton className="text-xs" />
        </div>
      </div>
    </div>
  );
};