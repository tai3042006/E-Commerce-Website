import hoodieWhite from "@/assets/product-hoodie-white.jpg";
import hoodieNavy from "@/assets/product-hoodie-navy.jpg";
import hoodieBlack from "@/assets/product-hoodie-black.jpg";
import hoodieChill from "@/assets/product-hoodie-chill.jpg";
import teeEye from "@/assets/product-tee-eye.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  description?: string;
};

export const products: Product[] = [
  {
    id: "skeyeboxy-tee",
    name: "SkeyeBoxy Tee",
    tagline: "Oversized clean drip",
    price: 39,
    image: teeEye,
    category: "tees",
    rating: 4.8,
    reviews: 1300,
    description:
      'SKEYE BOXY TEE — The new T-shirt in the "GREAT FUTURE" collection is impressively crafted with premium cotton, an oversized boxy cut, and a hand-finished watercolor graphic that lasts wash after wash.',
  },
  {
    id: "flexmode-hoodie",
    name: "FlexMode Hoodie",
    tagline: "Built for daily flex",
    price: 69,
    image: hoodieWhite,
    category: "hoodies",
    rating: 4.7,
    reviews: 842,
    description:
      "Lightweight French terry hoodie with a soft brushed interior, kangaroo pocket, and adjustable drawcord. Cut for everyday motion.",
  },
  {
    id: "hoodie-waffle",
    name: "Hoodie Waffle",
    tagline: "Built for every day",
    price: 48.5,
    image: hoodieNavy,
    category: "hoodies",
    rating: 4.6,
    reviews: 510,
    description:
      "Textured waffle-knit hoodie with a relaxed drape. Mid-weight warmth that layers easily under any jacket.",
  },
  {
    id: "underdogs-zipped",
    name: "Underdogs zipped Hoodie",
    tagline: "Relaxed Fit",
    price: 34,
    oldPrice: 54,
    image: hoodieBlack,
    category: "hoodies",
    rating: 4.5,
    reviews: 1120,
    description:
      "Heavyweight full-zip hoodie with embroidered chest mark. Roomy through the body with ribbed cuffs and hem.",
  },
  {
    id: "chill-guy-hoodie",
    name: "Just A Chill Guy Oversized Hoodie Black",
    tagline: "Boxy Oversized Fit",
    price: 69,
    image: hoodieChill,
    category: "hoodies",
    rating: 4.9,
    reviews: 2200,
    description:
      "Statement oversized hoodie in heavyweight 380 gsm cotton fleece. Bold front graphic, dropped shoulders, boxy fit.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
