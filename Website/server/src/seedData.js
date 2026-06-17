// Seed data — plain JS mirror of the React app's mock data files
// (src/data/products.ts + src/data/admin.ts). Kept in sync manually so the
// server can seed MySQL on first start without a TS build step.
//
// To refresh after editing the mock data, copy the array literals from the
// .ts files and convert image imports to the strings they resolve to.

export const categories = [
  { id: 'all',         label: 'All' },
  { id: 'hoodies',     label: 'Hoodies' },
  { id: 'tees',        label: 'Tees' },
  { id: 'shoes',       label: 'Shoes' },
  { id: 'pants',       label: 'Pants' },
  { id: 'accessories', label: 'Accessories' },
];

export const products = [
  {
    id: 'skeyeboxy-tee',
    name: 'SkeyeBoxy Tee',
    tagline: 'Oversized clean drip',
    price: 39,
    image: '/src/assets/product-tee-eye.jpg',
    hoverImage:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      '/src/assets/product-tee-eye.jpg',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'tees',
    gender: 'unisex',
    rating: 4.8,
    reviews: 1300,
    badge: 'bestseller',
    colors: ['#1a1a1a', '#f5f5f5', '#9ca3af'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'The new T-shirt in the "GREAT FUTURE" collection — premium cotton, oversized boxy cut, hand-finished watercolor graphic that lasts wash after wash.',
  },
  {
    id: 'flexmode-hoodie',
    name: 'FlexMode Hoodie',
    tagline: 'Built for daily flex',
    price: 69,
    image: '/src/assets/product-hoodie-white.jpg',
    hoverImage:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    gallery: [
      '/src/assets/product-hoodie-white.jpg',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'hoodies',
    gender: 'unisex',
    rating: 4.7,
    reviews: 842,
    badge: 'new',
    colors: ['#f5f5f5', '#1a1a1a', '#475569'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'Lightweight French terry hoodie with a soft brushed interior, kangaroo pocket, and adjustable drawcord. Cut for everyday motion.',
  },
  {
    id: 'hoodie-waffle',
    name: 'Hoodie Waffle',
    tagline: 'Built for every day',
    price: 48.5,
    image: '/src/assets/product-hoodie-navy.jpg',
    hoverImage:
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&q=80',
    gallery: [
      '/src/assets/product-hoodie-navy.jpg',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'hoodies',
    gender: 'men',
    rating: 4.6,
    reviews: 510,
    colors: ['#1e3a5f', '#1a1a1a'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'Textured waffle-knit hoodie with a relaxed drape. Mid-weight warmth that layers easily.',
  },
  {
    id: 'underdogs-zipped',
    name: 'Underdogs Zipped Hoodie',
    tagline: 'Relaxed fit',
    price: 34,
    oldPrice: 54,
    image: '/src/assets/product-hoodie-black.jpg',
    hoverImage:
      'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?auto=format&fit=crop&w=900&q=80',
    gallery: [
      '/src/assets/product-hoodie-black.jpg',
      'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'hoodies',
    gender: 'men',
    rating: 4.5,
    reviews: 1120,
    badge: 'sale',
    colors: ['#1a1a1a', '#374151'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'Heavyweight full-zip hoodie with embroidered chest mark. Roomy with ribbed cuffs and hem.',
  },
  {
    id: 'chill-guy-hoodie',
    name: 'Just A Chill Guy Oversized Hoodie',
    tagline: 'Boxy oversized fit',
    price: 69,
    image: '/src/assets/product-hoodie-chill.jpg',
    hoverImage:
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      '/src/assets/product-hoodie-chill.jpg',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'hoodies',
    gender: 'unisex',
    rating: 4.9,
    reviews: 2200,
    badge: 'bestseller',
    colors: ['#1a1a1a'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'Statement oversized hoodie in 380gsm cotton fleece. Bold front graphic, dropped shoulders, boxy fit.',
  },
  {
    id: 'core-crew-tee',
    name: 'Core Crew Tee',
    tagline: 'Pima cotton essential',
    price: 28,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80',
    category: 'tees',
    gender: 'men',
    rating: 4.6,
    reviews: 412,
    colors: ['#f5f5f5', '#1a1a1a', '#6b7280'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description:
      'Soft-hand pima crewneck with reinforced collar. The everyday foundation.',
  },
  {
    id: 'studio-tee-w',
    name: 'Studio Tee',
    tagline: 'Boxy cropped silhouette',
    price: 32,
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80',
    category: 'tees',
    gender: 'women',
    rating: 4.7,
    reviews: 233,
    badge: 'new',
    colors: ['#f5f5f5', '#dcd0c0'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description: 'Boxy crop with rolled sleeves. Designed for layering or solo.',
  },
  {
    id: 'runner-low',
    name: 'Runner Low',
    tagline: 'Lightweight mesh runner',
    price: 142,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
    category: 'shoes',
    gender: 'unisex',
    rating: 4.7,
    reviews: 1820,
    badge: 'new',
    colors: ['#f5f5f5', '#1a1a1a', '#dc2626'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    inStock: true,
    description:
      'Engineered mesh upper, foam midsole, rubber pods on high-wear zones.',
  },
  {
    id: 'court-classic',
    name: 'Court Classic',
    tagline: 'Leather court sneaker',
    price: 98,
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    category: 'shoes',
    gender: 'men',
    rating: 4.5,
    reviews: 980,
    colors: ['#ffffff', '#1a1a1a'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    inStock: true,
    description:
      'Tumbled leather upper on a vulcanized rubber sole. Heritage court silhouette.',
  },
  {
    id: 'trail-mid',
    name: 'Trail Mid GTX',
    tagline: 'All-weather trail boot',
    price: 198,
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    category: 'shoes',
    gender: 'unisex',
    rating: 4.8,
    reviews: 412,
    colors: ['#3f3f2f', '#1a1a1a'],
    sizes: ['8', '9', '10', '11', '12'],
    inStock: true,
    description: 'Waterproof bootie construction with sticky-rubber outsole.',
  },
  {
    id: 'wide-pant',
    name: 'Wide-Leg Pant',
    tagline: 'Crisp wool blend',
    price: 118,
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    category: 'pants',
    gender: 'women',
    rating: 4.6,
    reviews: 304,
    badge: 'new',
    colors: ['#1a1a1a', '#3a2e26'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description: 'Pleated wide-leg trouser in a fluid wool blend.',
  },
  {
    id: 'carpenter-pant',
    name: 'Carpenter Pant',
    tagline: '13oz organic denim',
    price: 88,
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    category: 'pants',
    gender: 'men',
    rating: 4.7,
    reviews: 528,
    colors: ['#1e3a5f', '#1a1a1a'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    description: 'Reinforced carpenter cut with hammer loop and side tool pocket.',
  },
  {
    id: 'tote-canvas',
    name: 'Canvas Tote',
    tagline: '16oz duck canvas',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    gender: 'unisex',
    rating: 4.8,
    reviews: 720,
    colors: ['#dcd0c0', '#1a1a1a'],
    sizes: ['One Size'],
    inStock: true,
    description: 'Heavyweight duck canvas tote with reinforced strap stitching.',
  },
  {
    id: 'cap-low',
    name: 'Low-Profile Cap',
    tagline: 'Washed cotton 6-panel',
    price: 32,
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    gender: 'unisex',
    rating: 4.5,
    reviews: 240,
    colors: ['#1a1a1a', '#f5f5f5', '#3f3f2f'],
    sizes: ['One Size'],
    inStock: true,
    description: 'Washed twill 6-panel with brass slide closure.',
  },
  {
    id: 'beanie-rib',
    name: 'Ribbed Beanie',
    tagline: 'Merino wool',
    price: 38,
    oldPrice: 48,
    image:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
    category: 'accessories',
    gender: 'unisex',
    rating: 4.6,
    reviews: 198,
    badge: 'sale',
    colors: ['#1a1a1a', '#dcd0c0', '#3a2e26'],
    sizes: ['One Size'],
    inStock: true,
    description: 'Fine-gauge merino rib beanie with folded cuff.',
  },
  {
    id: 'knit-cardigan',
    name: 'Heavy Knit Cardigan',
    tagline: 'Lambswool blend',
    price: 168,
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    hoverImage:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    category: 'hoodies',
    gender: 'women',
    rating: 4.7,
    reviews: 88,
    colors: ['#dcd0c0', '#3a2e26'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: false,
    description: 'Chunky 7-gauge lambswool cardigan with horn buttons.',
  },
];

export const customers = [
  { id: 'u_001', name: 'Alex Morgan',  email: 'alex@example.com',     joined: '2025-11-02', orders: 8,  spent: 612,  location: 'New York, US' },
  { id: 'u_002', name: 'Jamie Chen',   email: 'jamie.c@example.com',  joined: '2026-01-14', orders: 3,  spent: 207,  location: 'Toronto, CA' },
  { id: 'u_003', name: 'Priya Patel',  email: 'priya@example.com',    joined: '2025-08-21', orders: 12, spent: 1340, location: 'London, UK' },
  { id: 'u_004', name: 'Marco Rossi',  email: 'marco.r@example.com',  joined: '2026-04-09', orders: 1,  spent: 34,   location: 'Milan, IT' },
  { id: 'u_005', name: 'Sara Kim',     email: 'sara.k@example.com',   joined: '2025-12-30', orders: 5,  spent: 388,  location: 'Seoul, KR' },
  { id: 'u_006', name: 'Tom Becker',   email: 'tom.b@example.com',    joined: '2026-02-18', orders: 2,  spent: 78,   location: 'Berlin, DE' },
  { id: 'u_007', name: 'Lina Ortiz',   email: 'lina.o@example.com',   joined: '2025-10-05', orders: 9,  spent: 942,  location: 'Madrid, ES' },
  { id: 'u_008', name: 'Noah Wright',  email: 'noah.w@example.com',   joined: '2026-03-22', orders: 4,  spent: 256,  location: 'Sydney, AU' },
];

export const orders = [
  { id: '#CF-10428', customerEmail: 'alex@example.com',    date: '2026-05-30', items: 2, total: 138, status: 'delivered',  product: 'FlexMode Hoodie' },
  { id: '#CF-10427', customerEmail: 'jamie.c@example.com', date: '2026-05-30', items: 1, total: 69,  status: 'shipped',    product: 'Just A Chill Guy Hoodie' },
  { id: '#CF-10426', customerEmail: 'priya@example.com',   date: '2026-05-29', items: 3, total: 142, status: 'processing', product: 'SkeyeBoxy Tee' },
  { id: '#CF-10425', customerEmail: 'marco.r@example.com', date: '2026-05-29', items: 1, total: 34,  status: 'pending',    product: 'Underdogs zipped Hoodie' },
  { id: '#CF-10424', customerEmail: 'sara.k@example.com',  date: '2026-05-28', items: 2, total: 117, status: 'delivered',  product: 'Hoodie Waffle' },
  { id: '#CF-10423', customerEmail: 'tom.b@example.com',   date: '2026-05-28', items: 1, total: 39,  status: 'cancelled',  product: 'SkeyeBoxy Tee' },
  { id: '#CF-10422', customerEmail: 'lina.o@example.com',  date: '2026-05-27', items: 4, total: 220, status: 'delivered',  product: 'FlexMode Hoodie' },
  { id: '#CF-10421', customerEmail: 'noah.w@example.com',  date: '2026-05-27', items: 1, total: 69,  status: 'shipped',    product: 'Just A Chill Guy Hoodie' },
];
