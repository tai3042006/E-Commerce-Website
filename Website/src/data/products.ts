import hoodieWhite from "@/assets/product-hoodie-white.jpg";
import hoodieNavy from "@/assets/product-hoodie-navy.jpg";
import hoodieBlack from "@/assets/product-hoodie-black.jpg";
import hoodieChill from "@/assets/product-hoodie-chill.jpg";
import teeEye from "@/assets/product-tee-eye.jpg";

export type ProductCategory =
  | "hoodies"
  | "tees"
  | "shoes"
  | "accessories"
  | "pants";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  category: ProductCategory;
  gender: "men" | "women" | "unisex";
  rating?: number;
  reviews?: number;
  description?: string;
  colors?: string[];
  sizes?: string[];
  badge?: "new" | "sale" | "bestseller";
  inStock?: boolean;
};

// Unsplash hosted fashion catalog (free, on-brand)
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

export const products: Product[] = [
  {
    id: "skeyeboxy-tee",
    name: "SkeyeBoxy Tee",
    tagline: "Oversized clean drip",
    price: 39,
    image: teeEye,
    hoverImage: u("photo-1583743814966-8936f5b7be1a"),
    gallery: [teeEye, u("photo-1583743814966-8936f5b7be1a"), u("photo-1521572163474-6864f9cf17ab")],
    category: "tees",
    gender: "unisex",
    rating: 4.8,
    reviews: 1300,
    badge: "bestseller",
    colors: ["#1a1a1a", "#f5f5f5", "#9ca3af"],
    sizes,
    inStock: true,
    description:
      'The new T-shirt in the "GREAT FUTURE" collection — premium cotton, oversized boxy cut, hand-finished watercolor graphic that lasts wash after wash.',
  },
  {
    id: "flexmode-hoodie",
    name: "FlexMode Hoodie",
    tagline: "Built for daily flex",
    price: 69,
    image: hoodieWhite,
    hoverImage: u("photo-1556821840-3a63f95609a7"),
    gallery: [hoodieWhite, u("photo-1556821840-3a63f95609a7"), u("photo-1620799140408-edc6dcb6d633")],
    category: "hoodies",
    gender: "unisex",
    rating: 4.7,
    reviews: 842,
    badge: "new",
    colors: ["#f5f5f5", "#1a1a1a", "#475569"],
    sizes,
    inStock: true,
    description:
      "Lightweight French terry hoodie with a soft brushed interior, kangaroo pocket, and adjustable drawcord. Cut for everyday motion.",
  },
  {
    id: "hoodie-waffle",
    name: "Hoodie Waffle",
    tagline: "Built for every day",
    price: 48.5,
    image: hoodieNavy,
    hoverImage: u("photo-1620799140188-3b2a02fd9a77"),
    gallery: [hoodieNavy, u("photo-1620799140188-3b2a02fd9a77")],
    category: "hoodies",
    gender: "men",
    rating: 4.6,
    reviews: 510,
    colors: ["#1e3a5f", "#1a1a1a"],
    sizes,
    inStock: true,
    description: "Textured waffle-knit hoodie with a relaxed drape. Mid-weight warmth that layers easily.",
  },
  {
    id: "underdogs-zipped",
    name: "Underdogs Zipped Hoodie",
    tagline: "Relaxed fit",
    price: 34,
    oldPrice: 54,
    image: hoodieBlack,
    hoverImage: u("photo-1542838686-37da4a9fd1b3"),
    gallery: [hoodieBlack, u("photo-1542838686-37da4a9fd1b3")],
    category: "hoodies",
    gender: "men",
    rating: 4.5,
    reviews: 1120,
    badge: "sale",
    colors: ["#1a1a1a", "#374151"],
    sizes,
    inStock: true,
    description: "Heavyweight full-zip hoodie with embroidered chest mark. Roomy with ribbed cuffs and hem.",
  },
  {
    id: "chill-guy-hoodie",
    name: "Just A Chill Guy Oversized Hoodie",
    tagline: "Boxy oversized fit",
    price: 69,
    image: hoodieChill,
    hoverImage: u("photo-1620799139507-2a76f79a2f4d"),
    gallery: [hoodieChill, u("photo-1620799139507-2a76f79a2f4d")],
    category: "hoodies",
    gender: "unisex",
    rating: 4.9,
    reviews: 2200,
    badge: "bestseller",
    colors: ["#1a1a1a"],
    sizes,
    inStock: true,
    description: "Statement oversized hoodie in 380gsm cotton fleece. Bold front graphic, dropped shoulders, boxy fit.",
  },
  // Catalog expansion (Unsplash)
  {
    id: "core-crew-tee",
    name: "Core Crew Tee",
    tagline: "Pima cotton essential",
    price: 28,
    image: u("photo-1521572163474-6864f9cf17ab"),
    hoverImage: u("photo-1503341504253-dff4815485f1"),
    category: "tees", gender: "men", rating: 4.6, reviews: 412,
    colors: ["#f5f5f5", "#1a1a1a", "#6b7280"], sizes, inStock: true,
    description: "Soft-hand pima crewneck with reinforced collar. The everyday foundation.",
  },
  {
    id: "studio-tee-w",
    name: "Studio Tee",
    tagline: "Boxy cropped silhouette",
    price: 32,
    image: u("photo-1503342217505-b0a15ec3261c"),
    hoverImage: u("photo-1571945153237-4929e783af4a"),
    category: "tees", gender: "women", rating: 4.7, reviews: 233,
    badge: "new",
    colors: ["#f5f5f5", "#dcd0c0"], sizes, inStock: true,
    description: "Boxy crop with rolled sleeves. Designed for layering or solo.",
  },
  {
    id: "runner-low",
    name: "Runner Low",
    tagline: "Lightweight mesh runner",
    price: 142,
    image: u("photo-1542291026-7eec264c27ff"),
    hoverImage: u("photo-1600185365483-26d7a4cc7519"),
    category: "shoes", gender: "unisex", rating: 4.7, reviews: 1820,
    badge: "new",
    colors: ["#f5f5f5", "#1a1a1a", "#dc2626"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    description: "Engineered mesh upper, foam midsole, rubber pods on high-wear zones.",
  },
  {
    id: "court-classic",
    name: "Court Classic",
    tagline: "Leather court sneaker",
    price: 98,
    image: u("photo-1595950653106-6c9ebd614d3a"),
    hoverImage: u("photo-1525966222134-fcfa99b8ae77"),
    category: "shoes", gender: "men", rating: 4.5, reviews: 980,
    colors: ["#ffffff", "#1a1a1a"],
    sizes: ["7", "8", "9", "10", "11", "12"], inStock: true,
    description: "Tumbled leather upper on a vulcanized rubber sole. Heritage court silhouette.",
  },
  {
    id: "trail-mid",
    name: "Trail Mid GTX",
    tagline: "All-weather trail boot",
    price: 198,
    image: u("photo-1606107557195-0e29a4b5b4aa"),
    hoverImage: u("photo-1542291026-7eec264c27ff"),
    category: "shoes", gender: "unisex", rating: 4.8, reviews: 412,
    colors: ["#3f3f2f", "#1a1a1a"],
    sizes: ["8", "9", "10", "11", "12"], inStock: true,
    description: "Waterproof bootie construction with sticky-rubber outsole.",
  },
  {
    id: "wide-pant",
    name: "Wide-Leg Pant",
    tagline: "Crisp wool blend",
    price: 118,
    image: u("photo-1594633312681-425c7b97ccd1"),
    hoverImage: u("photo-1624378439575-d8705ad7ae80"),
    category: "pants", gender: "women", rating: 4.6, reviews: 304,
    badge: "new",
    colors: ["#1a1a1a", "#3a2e26"], sizes, inStock: true,
    description: "Pleated wide-leg trouser in a fluid wool blend.",
  },
  {
    id: "carpenter-pant",
    name: "Carpenter Pant",
    tagline: "13oz organic denim",
    price: 88,
    image: u("photo-1624378439575-d8705ad7ae80"),
    hoverImage: u("photo-1594633312681-425c7b97ccd1"),
    category: "pants", gender: "men", rating: 4.7, reviews: 528,
    colors: ["#1e3a5f", "#1a1a1a"], sizes, inStock: true,
    description: "Reinforced carpenter cut with hammer loop and side tool pocket.",
  },
  {
    id: "tote-canvas",
    name: "Canvas Tote",
    tagline: "16oz duck canvas",
    price: 42,
    image: u("photo-1591561954557-26941169b49e"),
    hoverImage: u("photo-1548036328-c9fa89d128fa"),
    category: "accessories", gender: "unisex", rating: 4.8, reviews: 720,
    colors: ["#dcd0c0", "#1a1a1a"], sizes: ["One Size"], inStock: true,
    description: "Heavyweight duck canvas tote with reinforced strap stitching.",
  },
  {
    id: "cap-low",
    name: "Low-Profile Cap",
    tagline: "Washed cotton 6-panel",
    price: 32,
    image: u("photo-1588850561407-ed78c282e89b"),
    hoverImage: u("photo-1521369909029-2afed882baee"),
    category: "accessories", gender: "unisex", rating: 4.5, reviews: 240,
    colors: ["#1a1a1a", "#f5f5f5", "#3f3f2f"], sizes: ["One Size"], inStock: true,
    description: "Washed twill 6-panel with brass slide closure.",
  },
  {
    id: "beanie-rib",
    name: "Ribbed Beanie",
    tagline: "Merino wool",
    price: 38,
    oldPrice: 48,
    image: u("photo-1576871337622-98d48d1cf531"),
    hoverImage: u("photo-1521369909029-2afed882baee"),
    category: "accessories", gender: "unisex", rating: 4.6, reviews: 198,
    badge: "sale",
    colors: ["#1a1a1a", "#dcd0c0", "#3a2e26"], sizes: ["One Size"], inStock: true,
    description: "Fine-gauge merino rib beanie with folded cuff.",
  },
  {
    id: "knit-cardigan",
    name: "Heavy Knit Cardigan",
    tagline: "Lambswool blend",
    price: 168,
    image: u("photo-1620799140408-edc6dcb6d633"),
    hoverImage: u("photo-1556821840-3a63f95609a7"),
    category: "hoodies", gender: "women", rating: 4.7, reviews: 88,
    colors: ["#dcd0c0", "#3a2e26"], sizes, inStock: false,
    description: "Chunky 7-gauge lambswool cardigan with horn buttons.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const categories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hoodies", label: "Hoodies" },
  { id: "tees", label: "Tees" },
  { id: "shoes", label: "Shoes" },
  { id: "pants", label: "Pants" },
  { id: "accessories", label: "Accessories" },
];
