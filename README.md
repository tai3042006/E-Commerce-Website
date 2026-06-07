<div align="center">

# 👗 CloFit — Fashion E-Commerce Platform

**A modern streetwear shopping experience built with React + TypeScript**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwindcss)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design Patterns](#design-patterns)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Team Members](#team-members)

---

## About

CloFit is a full-featured fashion e-commerce frontend application built as a group project for the **Object-Oriented Analysis & Design** course at **Nông Lâm University, Ho Chi Minh City**.

The platform simulates a real-world streetwear shopping experience with customer-facing pages, an admin dashboard, cart management, wishlist, search, and a multi-payment checkout flow — all implemented with clean OOP design patterns.

---

## Features

### Customer
| Feature | Description |
|---------|-------------|
| 🏠 **Home** | Hero section, featured products, collection highlights |
| 🛍️ **Shop** | Filter by category, gender, badge; sort by price/rating/newest; price range slider |
| 🔍 **Search** | Full-text overlay search (Cmd/Ctrl+K shortcut) |
| 📦 **Product Detail** | Gallery, size selector, color swatches, add-to-bag, wishlist toggle |
| 🛒 **Bag/Cart** | Quantity controls, promo code (CLOFIT10), shipping calculation, checkout |
| ❤️ **Wishlist** | Save products, persistent across sessions |
| 🔐 **Auth** | Sign In / Sign Up pages |

### Admin
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Revenue, orders, customers, products KPIs + recent order table |
| 📦 **Products** | Add, edit, delete products with inline management |
| 📋 **Orders** | Filter by status, view customer details |
| 👥 **Customers** | Customer table with spend history and location |

---

## Tech Stack

### Frontend Core
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool & dev server |
| **React Router** | 6.x | Client-side routing |
| **TanStack Query** | 5.x | Server state management |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component library (Radix UI) |
| **Framer Motion** | Page transitions & animations |
| **Lucide React** | Icon library |
| **Recharts** | Admin dashboard charts |

### State & Data
| Technology | Purpose |
|------------|---------|
| **React Context API** | Global state (Cart, Wishlist, UI) |
| **localStorage** | Cart & wishlist persistence |
| **Sonner / Toaster** | Toast notifications |
| **Zod** | Form validation schema |
| **React Hook Form** | Form state management |

---

## Design Patterns

The application is architectured around **6 core design patterns** from OOP:

## Design Patterns

### 🏭 Factory Pattern

**Purpose:** Create payment objects dynamically based on the payment method selected by the user.

**Applied In:**

* `PaymentFactory`
* Checkout module

**Usage:**

* Credit Card Payment
* Cash Payment
* E-Wallet Payment

---

### 🏛️ MVC Pattern

**Purpose:** Separate application data, UI, and business logic for better maintainability.

| Layer          | Location                            |
| -------------- | ----------------------------------- |
| **Model**      | `data/products.ts`, `data/admin.ts` |
| **View**       | `pages/*`, `components/*`           |
| **Controller** | `context/*`                         |

---

### 👁️ Observer Pattern

**Purpose:** Automatically notify users when important events occur.

**Applied In:**

* Product notification system
* Payment notification system

**Examples:**

* New product announcements
* Payment confirmation notifications
* Order status updates

---

### 🔒 Singleton Pattern

**Purpose:** Ensure a single shared instance is used throughout the application lifecycle.

**Applied In:**

* `QueryClient`
* `CartContext`
* `WishlistContext`
* `UIContext`

---

### 🎯 Strategy Pattern

**Purpose:** Allow different algorithms to be selected and switched at runtime.

**Applied In:**

* Payment processing
* Product sorting system

**Strategies:**

* Credit Card Strategy
* Cash Strategy
* E-Wallet Strategy
* Featured Sort
* Price Sort
* Rating Sort
* Newest Sort

---

### 🔄 State Pattern

**Purpose:** Manage order status transitions through predefined states.

**Applied In:**

* Order management module

**Order States:**

| State      |
| ---------- |
| Pending    |
| Processing |
| Shipped    |
| Delivered  |
| Cancelled  |

**Flow:**

`Pending → Processing → Shipped → Delivered`

`Pending → Cancelled`


## Project Structure

```
src/
├── assets/                 # Static images (product photos)
├── components/
│   ├── admin/              # AdminLayout
│   ├── clofit/             # Navbar, Footer, ProductCard, CartDrawer,
│   │                       #   Layout, SearchOverlay, MobileMenu, Logo
│   └── ui/                 # shadcn/ui primitives (button, dialog, etc.)
├── context/
│   ├── CartContext.tsx      # Cart state + operations (Controller)
│   ├── WishlistContext.tsx  # Wishlist state (Controller)
│   └── UIContext.tsx        # UI overlays state (Controller)
├── data/
│   ├── products.ts          # Product catalogue + CRUD helpers (Model)
│   └── admin.ts             # Orders, Customers mock data (Model)
├── hooks/
│   ├── use-mobile.tsx       # Responsive breakpoint hook
│   └── use-toast.ts         # Toast notification hook
├── lib/
│   └── utils.ts             # Tailwind class merge utility
├── pages/
│   ├── Index.tsx            # Home page
│   ├── Shop.tsx             # Product listing + filters
│   ├── Product.tsx          # Product detail
│   ├── Bag.tsx              # Cart / checkout
│   ├── Wishlist.tsx         # Saved items
│   ├── SignIn.tsx           # Login
│   ├── SignUp.tsx           # Register
│   └── admin/
│       ├── Dashboard.tsx    # Admin KPI dashboard
│       ├── AdminProducts.tsx
│       ├── AdminOrders.tsx
│       └── AdminCustomers.tsx
├── test/
│   └── example.test.ts      # Unit test setup
├── App.tsx                  # Router + global providers
└── main.tsx                 # Entry point
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18 or **Bun** ≥ 1.0
- npm / yarn / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/nhom18/clofit-ecommerce.git
cd clofit-ecommerce

# Install dependencies (pick one)
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app runs at **http://localhost:8080**

### Build for Production

```bash
npm run build
npm run preview
```

### Admin Access

Navigate to `/admin` to access the admin dashboard (no login required in demo mode).

### Promo Code

Enter **`CLOFIT10`** in the bag/cart page for 10% off.

---

## Team Members

| Student ID | Full Name | Role |
|-----------|-----------|------|
| **24130270** | Trần Nguyễn Anh Tài | Team Leader & Frontend Developer |
| **24130366** | Đặng Anh Vĩ | Database Developer |
| **19130113** | Trương Huỳnh Anh Kiệt | Frontend Developer |
| **24130375** | Nguyễn Quý Vinh | Backend Developer |
| **24130037** | Nguyễn Công Danh | UI/UX Designer |

---

## Course Information

| | |
|--|--|
| **University** | Nông Lâm University, Ho Chi Minh City |
| **Course** | Object-Oriented Analysis & Design |
| **Group** | Nhóm 18 |
| **Academic Year** | 2025 – 2026 |

---

<div align="center">
Made with ❤️ by Nhóm 18 — Nông Lâm University
</div>
