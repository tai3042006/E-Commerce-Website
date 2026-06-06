import { getProducts } from "./products";

const products = getProducts();

// Log some info about the products
console.log(`Total products: ${products.length}`);

// Check men's products
const mensProducts = products.filter(p => p.categories.includes('men'));
console.log(`Men's products: ${mensProducts.length}`);

// Check women's products
const womensProducts = products.filter(p => p.categories.includes('women'));
console.log(`Women's products: ${womensProducts.length}`);

// Check hoodies products
const hoodiesProducts = products.filter(p => p.categories.includes('hoodies'));
console.log(`Hoodies products: ${hoodiesProducts.length}`);

// Check tees products
const teesProducts = products.filter(p => p.categories.includes('tees'));
console.log(`Tees products: ${teesProducts.length}`);

// Check shoes products
const shoesProducts = products.filter(p => p.categories.includes('shoes'));
console.log(`Shoes products: ${shoesProducts.length}`);

// Check accessories products
const accessoriesProducts = products.filter(p => p.categories.includes('accessories'));
console.log(`Accessories products: ${accessoriesProducts.length}`);

// Check new arrivals products
const newArrivalsProducts = products.filter(p => p.categories.includes('new-arrivals'));
console.log(`New Arrivals products: ${newArrivalsProducts.length}`);

// Check favorites products
const favoritesProducts = products.filter(p => p.categories.includes('favorites'));
console.log(`Favorites products: ${favoritesProducts.length}`);

// Show a sample product
if (products.length > 0) {
  const sample = products[0];
  console.log('Sample product:', {
    id: sample.id,
    name: sample.name,
    category: sample.category,
    categories: sample.categories,
    price: sample.price,
    oldPrice: sample.oldPrice,
    rating: sample.rating,
    reviews: sample.reviews,
    description: sample.description?.substring(0, 50) + '...',
    brand: sample.brand,
    colors: sample.colors,
    sizes: sample.sizes,
    tags: sample.tags,
    featured: sample.featured,
    newArrival: sample.newArrival,
    bestseller: sample.bestseller,
    stock: sample.stock,
    imageCount: sample.images.length,
    firstImage: sample.image,
    allImages: sample.images
  });
}

// Check for duplicates in names
const names = products.map(p => p.name);
const uniqueNames = new Set(names);
console.log(`Unique names: ${uniqueNames.size} out of ${names.length}`);

// Check for duplicates in descriptions
const descriptions = products.map(p => p.description || '');
const uniqueDescriptions = new Set(descriptions);
console.log(`Unique descriptions: ${uniqueDescriptions.size} out of ${descriptions.length}`);

// Check for duplicates in image arrays (first image)
const firstImages = products.map(p => p.image);
const uniqueFirstImages = new Set(firstImages);
console.log(`Unique first images: ${uniqueFirstImages.size} out of ${firstImages.length}`);

// Check that each product has 3-5 images
const productsWithCorrectImageCount = products.filter(p => p.images.length >= 3 && p.images.length <= 5);
console.log(`Products with 3-5 images: ${productsWithCorrectImageCount.length} out of ${products.length}`);

// Check that each product has a brand
const productsWithBrand = products.filter(p => p.brand && p.brand.length > 0);
console.log(`Products with brand: ${productsWithBrand.length} out of ${products.length}`);

// Check that each product has colors
const productsWithColors = products.filter(p => p.colors && p.colors.length > 0);
console.log(`Products with colors: ${productsWithColors.length} out of ${products.length}`);

// Check that each product has sizes
const productsWithSizes = products.filter(p => p.sizes && p.sizes.length > 0);
console.log(`Products with sizes: ${productsWithSizes.length} out of ${products.length}`);

// Check that each product has tags
const productsWithTags = products.filter(p => p.tags && p.tags.length > 0);
console.log(`Products with tags: ${productsWithTags.length} out of ${products.length}`);