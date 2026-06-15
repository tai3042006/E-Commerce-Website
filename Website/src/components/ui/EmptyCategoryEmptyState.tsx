import { EmptyState } from "./EmptyState";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

export const EmptyCategoryEmptyState = () => {
  return (
    <EmptyState
      title="No products in this category yet"
      description="Check back later for new arrivals or explore other categories."
      actionLabel="Explore categories"
      actionTo="/shop"
      illustration={
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <Tag className="absolute inset-0 m-4 h-16 w-16" />
        </div>
      }
      animationDirection="up"
    />
  );
};