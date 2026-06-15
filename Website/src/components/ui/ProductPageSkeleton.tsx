import { Skeleton } from "./skeleton";

export const ProductPageSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      {/* Gallery skeleton */}
      <div className="flex gap-4">
        <div className="hidden flex-col gap-3 lg:flex">
          {/* Thumbnail skeletons */}
          <Skeleton className="h-20 w-20" />
          <Skeleton className="h-20 w-20" />
          <Skeleton className="h-20 w-20" />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          {/* Main image skeleton */}
          <Skeleton className="h-full w-full" />
          {/* Mobile dots skeleton */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Details skeleton */}
      <div className="flex flex-col">
        <Skeleton className="text-xs font-medium uppercase tracking-[0.18em] w-16" /> {/* category */}
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <Skeleton className="mt-1 text-2xl font-extrabold tracking-tight w-36" /> {/* product name */}
            <Skeleton className="mt-1 text-sm text-muted-foreground w-24" /> {/* tagline */}
          </div>
          {/* Wishlist button skeleton */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="text-2xl font-semibold w-20" /> {/* price */}
          <Skeleton className="text-xs" /> {/* old price */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {/* Rating skeletons */}
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="ml-1">(123)</Skeleton> {/* reviews placeholder */}
          </div>
        </div>

        <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium">
          <Skeleton className="h-1.5 w-1.5 rounded-full" /> {/* stock */}
          <Skeleton className="ml-1">In stock — ships within 24h</Skeleton>
        </p>

        {/* Color skeletons */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold">Color</h2>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full border-2" />
            <Skeleton className="h-8 w-8 rounded-full border-2" />
            <Skeleton className="h-8 w-8 rounded-full border-2" />
          </div>
        </div>

        {/* Size skeletons */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Select size</h2>
            <Skeleton className="text-xs font-medium text-muted-foreground" /> {/* size guide */}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="rounded-pill border py-2.5 text-sm font-medium" />
            ))}
          </div>
        </div>

        {/* Quantity skeletons */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-pill border border-border px-4 py-2.5">
            <Skeleton className="h-4 w-4" /> {/* decrease */}
            <Skeleton className="min-w-[2ch] text-center text-sm font-medium" /> {/* quantity */}
            <Skeleton className="h-4 w-4" /> {/* increase */}
          </div>
          <Skeleton className="flex-1 rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background" /> {/* add to bag button */}
        </div>

        {/* Benefits skeleton */}
        <div className="mt-6 grid gap-3 rounded-2xl border border-border p-5 text-sm sm:grid-cols-3">
          <Skeleton className="flex items-start gap-3" />
          <Skeleton className="flex items-start gap-3" />
          <Skeleton className="flex items-start gap-3" />
        </div>

        {/* Description skeleton */}
        <div className="mt-6 border-t border-border pt-6">
          <h2 className="text-sm font-semibold">Description</h2>
          <Skeleton className="mt-2 h-4 w-80" />
          <Skeleton className="mt-2 h-4 w-60" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
      </div>
    </div>
  );
};