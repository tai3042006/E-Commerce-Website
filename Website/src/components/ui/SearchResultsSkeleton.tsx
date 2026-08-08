import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchResultsSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-6">
      {/* Search bar skeleton */}
      <div className="flex flex-col">
        <Skeleton className="h-10 w-64 rounded-xl bg-secondary" />
        <Skeleton className="mt-2 h-8 w-40" />
      </div>

      {/* Results grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};