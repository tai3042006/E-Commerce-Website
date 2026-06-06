import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full-page product-grid skeleton.
 * Used as the <Suspense> fallback for lazily-loaded route pages.
 */
export const PageSkeleton = () => (
  <div className="container-clofit py-10 pb-20">
    {/* Page title area */}
    <Skeleton className="mb-1 h-3.5 w-20" />
    <Skeleton className="h-9 w-56 mb-2" />
    <Skeleton className="h-3.5 w-28 mb-8" />

    {/* Filter toolbar */}
    <div className="mb-6 flex items-center justify-between border-y border-border py-3">
      <Skeleton className="h-9 w-24 rounded-full" />
      <Skeleton className="h-9 w-36 rounded-full" />
    </div>

    {/* Product grid */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton
            className="w-full rounded-2xl"
            style={{ aspectRatio: "3/4" }}
          />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

/** Thin hero skeleton used on the Home page */
export const HomeSkeleton = () => (
  <div className="container-clofit py-4">
    <Skeleton
      className="w-full rounded-3xl"
      style={{ aspectRatio: "16/9", maxHeight: 640 }}
    />
  </div>
);

/** Single-product detail skeleton */
export const ProductSkeleton = () => (
  <div className="container-clofit py-10 pb-20">
    <Skeleton className="mb-8 h-3.5 w-64" />
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "4/5" }} />
      <div className="space-y-4">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-5 gap-2 pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-4 h-14 w-full rounded-full" />
      </div>
    </div>
  </div>
);
