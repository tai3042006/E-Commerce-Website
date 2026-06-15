import { EmptyState } from "./EmptyState";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const EmptyWishlistEmptyState = () => {
  return (
    <EmptyState
      title="Your wishlist is empty"
      description="Find inspiring pieces and save them to your wishlist."
      actionLabel="Explore collections"
      actionTo="/shop"
      illustration={
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <Heart className="absolute inset-0 m-4 h-16 w-16 text-destructive" />
        </div>
      }
      animationDirection="up"
    />
  );
};