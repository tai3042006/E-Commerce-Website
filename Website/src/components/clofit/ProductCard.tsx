import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const badgeStyles: Record<string, string> = {
  new: "bg-foreground text-background",
  sale: "bg-destructive text-destructive-foreground",
  bestseller: "bg-secondary text-foreground border border-border",
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const fav = has(product.id);

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes?.[Math.floor((product.sizes.length || 1) / 2)] || "M";
    add(product, size, 1);
    toast.success(`Added ${product.name} (${size})`);
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <motion.article
      className="group"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5]">
        <Link to={`/product/${product.id}`} aria-label={product.name} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800} height={1000}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              aria-hidden
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`rounded-pill px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles[product.badge]}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-pill bg-foreground/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          onClick={onFav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm shadow-card"
          whileTap={{ scale: 0.8 }}
        >
          <motion.span
            key={fav ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Heart className={`h-4 w-4 ${fav ? "text-destructive" : "text-foreground"}`}
              fill={fav ? "currentColor" : "none"} strokeWidth={1.75} />
          </motion.span>
        </motion.button>

        {/* Quick add */}
        <AnimatePresence>
          {hover && product.inStock !== false && (
            <motion.button
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={quickAdd}
              className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 rounded-pill bg-background/95 py-3 text-sm font-semibold text-foreground shadow-pop backdrop-blur md:flex"
            >
              <Plus className="h-4 w-4" /> Quick add
            </motion.button>
          )}
        </AnimatePresence>

        {product.inStock === false && (
          <div className="absolute inset-x-0 bottom-0 bg-background/90 py-2 text-center text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Sold out
          </div>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full border border-border" style={{ background: c }} />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            ${product.price.toFixed(product.price % 1 === 0 ? 0 : 2)} USD
          </span>
          {product.oldPrice && (
            <span className="price-strike text-xs">${product.oldPrice} USD</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};
