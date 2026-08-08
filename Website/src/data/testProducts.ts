import { products } from "./products";

// Log some info about the products
console.log(`Total products: ${products.length}`);

// Check men's products
const mensProducts = products.filter(p => p.gender === 'men');
console.log(`Men's products: ${mensProducts.length}`);

// Check women's products
const womensProducts = products.filter(p => p.gender === 'women');
console.log(`Women's products: ${womensProducts.length}`);

// Check unisex products
const unisexProducts = products.filter(p => p.gender === 'unisex');
console.log(`Unisex products: ${unisexProducts.length}`);

// Check hoodies products
const hoodiesProducts = products.filter(p => p.category === 'hoodies');
console.log(`Hoodies products: ${hoodiesProducts.length}`);

// Check tees products
const teesProducts = products.filter(p => p.category === 'tees');
console.log(`Tees products: ${teesProducts.length}`);

// Check shoes products
const shoesProducts = products.filter(p => p.category === 'shoes');
console.log(`Shoes products: ${shoesProducts.length}`);

// Check accessories products
const accessoriesProducts = products.filter(p => p.category === 'accessories');
console.log(`Accessories products: ${accessoriesProducts.length}`);

// Check pants products
const pantsProducts = products.filter(p => p.category === 'pants');
console.log(`Pants products: ${pantsProducts.length}`);

// Check new arrivals (badge: new)
const newArrivalsProducts = products.filter(p => p.badge === 'new');
console.log(`New Arrivals products: ${newArrivalsProducts.length}`);

// Check bestseller products
const bestsellerProducts = products.filter(p => p.badge === 'bestseller');
console.log(`Bestseller products: ${bestsellerProducts.length}`);

// Check sale products
const saleProducts = products.filter(p => p.badge === 'sale');
console.log(`Sale products: ${saleProducts.length}`);

// Show a sample product
if (products.length > 0) {
  const sample = products[0];
  console.log('Sample product:', {
    id: sample.id,
    name: sample.name,
    category: sample.category,
    gender: sample.gender,
    price: sample.price,
    oldPrice: sample.oldPrice,
    rating: sample.rating,
    reviews: sample.reviews,
    description: sample.description?.substring(0, 50) + '...',
    colors: sample.colors,
    sizes: sample.sizes,
    badge: sample.badge,
    inStock: sample.inStock,
    image: sample.image,
    hoverImage: sample.hoverImage,
    galleryLength: sample.gallery?.length ?? 0
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

// Check that each product has an image (main or hover or gallery)
const productsWithImage = products.filter(p =>
  p.image || p.hoverImage || (p.gallery && p.gallery.length > 0)
);
console.log(`Products with image: ${productsWithImage.length} out of ${products.length}`);

// Check that each product has a category (should be all)
const productsWithCategory = products.filter(p => p.category);
console.log(`Products with category: ${productsWithCategory.length} out of ${products.length}`);

// Check that each product has a gender (should be all)
const productsWithGender = products.filter(p => p.gender);
console.log(`Products with gender: ${productsWithGender.length} out of ${products.length}`);

// Check that each product has at least one size (if sizes are provided)
const productsWithSizes = products.filter(p => p.sizes && p.sizes.length > 0);
console.log(`Products with sizes: ${productsWithSizes.length} out of ${products.length}`);

// Check that each product has at least one color (if colors are provided)
const productsWithColors = products.filter(p => p.colors && p.colors.length > 0);
console.log(`Products with colors: ${productsWithColors.length} out of ${products.length}`);

// Check that each product has a rating (if provided)
const productsWithRating = products.filter(p => p.rating !== undefined);
console.log(`Products with rating: ${productsWithRating.length} out of ${products.length}`);

// Check that each product has reviews count (if provided)
const productsWithReviews = products.filter(p => p.reviews !== undefined);
console.log(`Products with reviews: ${productsWithReviews.length} out of ${products.length}`);