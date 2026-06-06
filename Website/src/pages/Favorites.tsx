import { Link } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden">
          <Link to="/" aria-label="Back" className="-ml-2 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold lowercase">
            favorites
          </h1>
        </div>

        {/* Desktop header */}
        <div className="hidden items-end justify-between md:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Saved Items
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
              Favorites
            </h1>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <p className="text-muted-foreground">
              You haven't saved any items yet. Start browsing and tap the heart
              icon to save your favorite products.
            </p>
            <Link to="/shop" className="text-sm font-medium underline underline-offset-4">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:mt-10 lg:grid-cols-4 lg:gap-x-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Favorites;