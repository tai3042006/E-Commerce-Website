# Files Importing Directly from @/data/products.ts - Review Required

These files import data directly from the static products data source and should be reviewed for modification to use the ProductContext (which fetches from API with fallback to static data) instead.

## Files Requiring Modification

1. **Website/src/components/clofit/Navbar.tsx**
   - Usage: Direct access to `products` array for mega menu filtering (line 218)
   - Issue: Uses static data instead of API-fetched data via ProductContext
   - Fix: Replace direct `products` usage with `useProduct()` hook

2. **Website/src/pages/shop/AllProducts.tsx**
   - Usage: Direct access to `products` array for filtering and display (line 68: `let list = products.slice();`)
   - Issue: Uses static data instead of API-fetched data
   - Fix: Replace direct `products` usage with `useProduct()` hook

3. **Website/src/pages/shop/CollectionPage.tsx**
   - Usage: Direct access to `products` array for filtering and display (line 55: `let list = products.filter(config.baseFilter);`)
   - Issue: Uses static data instead of API-fetched data
   - Fix: Replace direct `products` usage with `useProduct()` hook

4. **Website/src/pages/Search.tsx**
   - Usage: Direct access to `products` array for search functionality (lines 35-41)
   - Issue: Uses static data instead of API-fetched data
   - Fix: Replace direct `products` usage with `useProduct()` hook

5. **Website/src/components/clofit/SearchOverlay.tsx**
   - Usage: Direct access to `products` array for search suggestions (lines 35-40)
   - Issue: Uses static data instead of API-fetched data
   - Fix: Replace direct `products` usage with `useProduct()` hook

6. **Website/src/components/SearchPanel.tsx**
   - Usage: Attempts to import and use non-existent `getProducts()` function (line 45)
   - Issue: Broken import - `getProducts` is not exported from '@/data/products'
   - Fix: Either correct the import to use `products` directly and then migrate to ProductContext, or implement proper getProducts function

## Files Using Static Data as Appropriate Fallback (NO CHANGE NEEDED)

1. **Website/src/services/ProductCatalog.ts**
   - Usage: Imports `staticProducts` as fallback when API is unavailable (line 33)
   - Status: CORRECT - This is the intended fallback mechanism

2. **Website/src/services/CartService.ts**
   - Usage: Uses `getProduct(id)` as fallback when product not found in API catalog (line 66)
   - Status: CORRECT - This is a reasonable fallback for cart operations

3. **Website/src/context/CartContext.tsx**
   - Usage: Uses `getProduct` function via cartService (indirect)
   - Status: CORRECT - Delegates to CartService which has proper fallback logic

4. **Website/src/controllers/CartController.tsx**
   - Usage: Uses cartService methods (indirect)
   - Status: CORRECT - Delegates to CartService which has proper fallback logic

## Files Importing Only Types (NO CHANGE NEEDED)

These files import only the Product type or related types, not the actual products data:
- Website/src/pages/Product.tsx
- Website/src/pages/Wishlist.tsx
- Website/src/components/clofit/ProductCard.tsx
- Website/src/context/FavoritesContext.tsx
- Website/src/controllers/ProductController.tsx
- And all the filter strategy files (they receive products as parameters)

## Summary

- **6 files require modification** to use ProductContext instead of direct static data access
- **3 files use static data appropriately as fallback** (no change needed)
- **Multiple files import only types** (no change needed)