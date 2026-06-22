# CloFit — E-Commerce Fashion Platform

> A full-stack fashion e-commerce platform built with React + TypeScript (frontend) and Node.js + MySQL (backend), applying object-oriented design patterns: **Singleton**, **Observer**, **Strategy**.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Design Patterns](#design-patterns)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Notes](#notes)

---

## Introduction

**CloFit** is a fashion e-commerce application that lets users browse and purchase clothing, shoes, and accessories. The system includes a fully-featured storefront and an admin dashboard for managing products, orders, and customers.

This project was built for the **Object-Oriented Design (OOD)** course, focusing on applying Design Patterns to real-world problems.

### Class Diagram

<!-- After uploading to GitHub Issues, replace the URL below with your actual image link -->
![Class Diagram](https://github.com/user-attachments/assets/ec48d475-7129-43ec-9b1d-fbb23871f6bb)

---

## Features

### 👤 User
- Register, log in, log out
- Browse products by category (Men / Women / Hoodies / Tees / Shoes / Accessories)
- View product details, select size and color
- Add to cart and checkout
- Wishlist / Favorites
- Rate and review products
- Real-time product search
- View order history
- Receive system notifications

### ⚙️ Admin
- Overview dashboard (revenue, orders, products, customers)
- Product management: create, update, delete
- Order management: view and update status
- Customer management
- Receive notifications on new orders

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| UI Components | shadcn/ui + Radix UI + Tailwind CSS |
| State Management | React Context API + TanStack Query |
| Routing | React Router DOM v6 |
| Animation | Framer Motion |
| Backend | Node.js + Express.js |
| Database | MySQL 8 |
| DB Driver | mysql2 |
| Auth | Token-based (custom) |
| Build Tool | Vite 5 |

---

## Project Structure

```
Website/
├── src/                        # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── clofit/             # Core application components
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── ...
│   │   └── ui/                 # shadcn/ui base components
│   ├── context/                # React Context (Observer / Provider pattern)
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── NotificationContext.tsx
│   │   ├── OrderContext.tsx
│   │   ├── WishlistContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── UIContext.tsx
│   ├── controllers/            # Controller layer
│   │   ├── CartController.tsx
│   │   └── ProductController.tsx
│   ├── services/               # Service layer (Singleton pattern)
│   │   ├── CartService.ts      # Singleton — manages cart state
│   │   ├── ProductCatalog.ts   # Singleton — caches product catalog
│   │   └── api.ts
│   ├── filters/                # Strategy pattern
│   │   └── ProductFilterContext.ts
│   ├── pages/                  # Route pages
│   │   ├── Index.tsx
│   │   ├── Shop.tsx
│   │   ├── Product.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Favorites.tsx
│   │   ├── Search.tsx
│   │   ├── Account.tsx
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminCustomers.tsx
│   │       └── AdminLogin.tsx
│   ├── App.tsx
│   └── main.tsx
│
└── server/                     # Backend (Node.js + Express)
    └── src/
        ├── routes/             # REST API routes
        │   ├── products.js
        │   ├── orders.js
        │   ├── auth.js
        │   ├── customers.js
        │   ├── notifications.js
        │   └── reviews.js
        ├── db.js               # MySQL connection pool
        ├── schema.sql          # Database schema
        ├── seed.js             # Seed entry point
        ├── seedData.js         # Sample data
        ├── seedRunner.js       # Auto-seed logic
        ├── migrate.js          # Migration helper
        └── index.js            # Express app entry point
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL 8 running
- npm >= 9

### 1. Clone the repository

```bash
git clone https://github.com/tai3042006/E-Commerce-Website.git
cd E-Commerce-Website/Website
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Configure environment

```bash
# Backend
cp server/.env.example server/.env
# Open server/.env and fill in your MySQL credentials

# Frontend (optional — only needed for production builds)
cp .env.example .env
```

### 4. Initialize the database

```bash
npm run seed
```

> The database and tables are created automatically if they don't exist (`AUTO_CREATE_DB=true`).

### 5. Run the application

```bash
# Run both frontend and backend simultaneously
npm run dev:all

# Or run separately
npm run dev          # Frontend → http://localhost:5173
npm run dev:backend  # Backend  → http://localhost:4000
```

### Default accounts after seed

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@clofit.com  | admin123 |
| User  | user@clofit.com   | user123  |

---

## Environment Variables

### `server/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clofit
AUTO_CREATE_DB=true
PORT=4000
```

### `.env` (frontend — optional)

```env
# Only needed if deploying to a remote server
# VITE_API_URL=http://localhost:4000/api
```

---

## Design Patterns

### 1. Singleton — `CartService` & `ProductCatalog`

Ensures only **one instance** exists throughout the application lifecycle.

```typescript
// src/services/CartService.ts
class CartService {
  private static instance: CartService;

  private constructor() {
    this.loadFromLocalStorage();
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }
}
```

**Java equivalent:**
```java
public class CartService {
    private static CartService instance;
    private CartService() {}
    public static CartService getInstance() {
        if (instance == null) instance = new CartService();
        return instance;
    }
}
```

---

### 2. Observer — `NotificationContext`

When a new event occurs (new order, new product), all subscribers are notified automatically. The client polls every 30 seconds.

```typescript
// src/context/NotificationContext.tsx
useEffect(() => {
  const id = setInterval(async () => {
    await refresh(); // notify all observers
  }, 30_000);
  return () => clearInterval(id);
}, [user]);
```

- **AdminObserver**: receives notifications when a new order is placed (`audience = 'admin'`)
- **CustomerObserver**: receives notifications when a new product is added (`audience = 'customer'`)

**Java equivalent:**
```java
interface NotificationObserver {
    void update(String event, String message);
}
class AdminObserver implements NotificationObserver { ... }
class CustomerObserver implements NotificationObserver { ... }
```

---

### 3. Strategy — `ProductFilterContext`

Allows **flexible swapping** of filtering algorithms without modifying existing code.

```typescript
// src/filters/ProductFilterContext.ts
class ProductFilterContext {
  private strategy: FilterStrategy;

  setStrategy(strategy: FilterStrategy) {
    this.strategy = strategy;
  }

  executeFilter(products: Product[]): Product[] {
    return this.strategy.execute(products);
  }
}

// Usage
const ctx = new ProductFilterContext();
ctx.setStrategy(new CategoryFilterStrategy("hoodies"));
const filtered = ctx.executeFilter(allProducts);
```

Supported strategies: `CategoryFilterStrategy`, `PriceFilterStrategy`, `RatingFilterStrategy`.

**Java equivalent:**
```java
interface FilterStrategy {
    List<Product> execute(List<Product> products);
}
class CategoryFilterStrategy implements FilterStrategy { ... }
class PriceFilterStrategy implements FilterStrategy { ... }
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Log in and receive a token |

### Products — `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filter: `?gender=`, `?category=`) |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create a product (admin) |
| PUT | `/api/products/:id` | Update a product (admin) |
| DELETE | `/api/products/:id` | Delete a product (admin) |

### Reviews — `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/:id/reviews` | Get reviews for a product |
| POST | `/api/products/:id/reviews` | Submit a new review |
| DELETE | `/api/reviews/:id` | Delete a review |

### Orders — `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Place a new order |
| PATCH | `/api/orders/:id` | Update order status |

### Notifications — `/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications for the current user |
| PATCH | `/api/notifications/read` | Mark all as read |

### Customers — `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers (admin) |

---

## Database Schema

```
categories          products               product_images
──────────          ────────               ──────────────
id (PK)      ←─── category_id (FK)        id (PK)
name               id (PK)         ──┐    product_id (FK)
                   name              │    url
                   price             │
                   gender            │    product_colors / product_sizes
                   badge             │    ─────────────────────────────
                   stock             │    id (PK)
                                     └──► product_id (FK)
users                                     value
─────
id (PK)           orders                notifications
email             ──────                ─────────────
role              id (PK)               id (PK)
password          customer_id (FK)      audience
                  total                 event
product_reviews   status                is_read
───────────────   created_at            created_at
id (PK)
product_id (FK)
user_id (FK)
rating
comment
```

---

## Scripts

```bash
npm run dev:all      # Run frontend + backend simultaneously
npm run dev          # Frontend only (port 5173)
npm run dev:backend  # Backend only  (port 4000)
npm run build        # Build production frontend
npm run seed         # Initialize DB + seed sample data
npm run test         # Run unit tests (Vitest)
```

---

## Notes

- The Vite dev server automatically proxies `/api` → `http://localhost:4000`, so no extra config is needed for local development.
- All `/admin/*` routes are protected by the `AdminRoute` component — only users with `role = 'admin'` can access them.
- Cart data is persisted to `localStorage` and kept in sync via `CartService.subscribe()`.
