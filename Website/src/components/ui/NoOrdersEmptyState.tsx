import { EmptyState } from "./EmptyState";
import { Link } from "react-router-dom";
import { List } from "lucide-react";

export const NoOrdersEmptyState = () => {
  return (
    <EmptyState
      title="You haven't placed any orders yet"
      description="Your order history will appear here after you make a purchase."
      actionLabel="Shop now"
      actionTo="/shop"
      illustration={
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <List className="absolute inset-0 m-4 h-16 w-16" />
        </div>
      }
      animationDirection="up"
    />
  );
};