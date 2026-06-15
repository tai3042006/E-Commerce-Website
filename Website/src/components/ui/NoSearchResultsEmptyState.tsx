import { EmptyState } from "./EmptyState";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export const NoSearchResultsEmptyState = () => {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
      actionLabel="Try again"
      actionTo="/shop"
      illustration={
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <Search className="absolute inset-0 m-4 h-16 w-16" />
        </div>
      }
      animationDirection="up"
    />
  );
};