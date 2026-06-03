import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useState } from "react";

export const ProductCard = ({ product }: { product: Product }) => {
  const [fav, setFav] = useState(false);
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-square">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            setFav((v) => !v);
          }}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart
            className="h-4 w-4 text-foreground"
            fill={fav ? "currentColor" : "none"}
            strokeWidth={1.75}
          />
        </button>
      </div>
      <div className="mt-3 px-0.5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.tagline}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            ${product.price.toFixed(product.price % 1 === 0 ? 0 : 2)} USD
          </span>
          {product.oldPrice && (
            <span className="price-strike text-xs">
              ${product.oldPrice} USD
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
