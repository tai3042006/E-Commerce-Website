import { EmptyState } from "./EmptyState";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export const EmptyCartEmptyState = () => {
  return (
    <EmptyState
      title="Your bag is empty"
      description="Discover something you'll love and add it to your bag."
      actionLabel="Shop the collection"
      actionTo="/shop"
      illustration={
        <div className="relative w-24 h-24 mb-6">
          {/* Placeholder for shopping bag illustration */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <ShoppingBag className="absolute inset-0 m-4 h-16 w-16" />
        </div>
      }
      animationDirection="up"
    />
  );
};