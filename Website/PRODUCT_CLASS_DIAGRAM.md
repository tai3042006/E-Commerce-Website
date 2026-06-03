# Product Management Class Diagram

This diagram illustrates the structure for managing multiple products in the e-commerce frontend.

```mermaid
classDiagram
    class Product {
        -id: string
        -name: string
        -tagline: string
        -price: number
        -oldPrice?: number
        -image: string
        -category: string
        -rating?: number
        -reviews?: number
        -description?: string
    }

    class ProductsService {
        +getProducts(): Product[]
        +getProduct(id: string): Product | undefined
        +addProduct(product: Product): void
        +updateProduct(id: string, updates: Partial<Product>): void
        +deleteProduct(id: string): void
    }

    class ProductCard {
        +product: Product
        +onFavoriteToggle(): void
    }

    class ShopPage {
        +products: Product[]
        +filteredProducts: Product[]
        +searchQuery: string
        +renderProductCards(): void
    }

    class ProductDetailPage {
        +product: Product
        +selectedSize: string
        +isFavorited: boolean
        +addToBag(): void
        +toggleFavorite(): void
    }

    class AdminProductsPage {
        +products: Product[]
        +searchQuery: string
        +editingProductId: string | null
        +editData: Partial<Product>
        +addProduct(): void
        +editProduct(id: string): void
        +saveProduct(id: string): void
        +deleteProduct(id: string): void
    }

    class Layout {
        <<component>>
    }
    class AdminLayout {
        <<component>>
    }

    Product ..> ProductsService : uses
    ProductsService <|.. ProductCard : uses
    ProductsService <|.. ShopPage : uses
    ProductsService <|.. ProductDetailPage : uses
    ProductsService <|.. AdminProductsPage : uses
    
    ShopPage ..> ProductCard : contains
    ProductDetailPage ..> ProductCard : shows related
    AdminProductsPage ..> ProductCard : manages
    
    Layout <|.. AdminLayout : extends
    Layout <|.. ShopPage : uses
    Layout <|.. ProductDetailPage : uses
    Layout <|.. AdminProductsPage : uses
```

## Component Responsibilities

### Product Data Model
- Represents a single product with all its attributes
- Used throughout the application for displaying and managing products

### Products Service
- Handles all product data operations
- Uses localStorage for persistence in this frontend-only implementation
- Provides CRUD operations for products

### ProductCard Component
- Displays a single product in a card format
- Shows product image, name, tagline, price, and favorite button
- Used in shop page, product detail page (related products), and admin panel

### Shop Page
- Main product listing page
- Displays products in a grid layout
- Includes category filtering and search functionality

### Product Detail Page
- Shows detailed information for a single product
- Includes size selection, description, and add-to-bag functionality
- Displays related products

### Admin Products Page
- Interface for managing products
- Allows adding, editing, and deleting products
- Features inline editing for product attributes
- Includes search functionality to filter products

## Data Flow
1. ProductsService manages product data in localStorage
2. Components retrieve product data through ProductsService methods
3. AdminProductsPage modifies data through ProductsService
4. All other components automatically reflect changes through service calls
5. ProductCard is a reusable component used across multiple views