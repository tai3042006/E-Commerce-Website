# CloFit — E-Commerce Fashion Platform

> Nền tảng thương mại điện tử thời trang full-stack xây dựng với React + TypeScript (frontend) và Node.js + MySQL (backend), áp dụng các mẫu thiết kế hướng đối tượng: **Singleton**, **Observer**, **Strategy**.

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Biến môi trường](#biến-môi-trường)
- [Design Patterns](#design-patterns)
- [API Endpoints](#api-endpoints)
- [Sơ đồ cơ sở dữ liệu](#sơ-đồ-cơ-sở-dữ-liệu)

---

## Giới thiệu

**CloFit** là ứng dụng thương mại điện tử thời trang cho phép người dùng duyệt và mua sắm quần áo, giày dép và phụ kiện. Hệ thống bao gồm giao diện người dùng đầy đủ chức năng và bảng quản trị admin để quản lý sản phẩm, đơn hàng và khách hàng.

Dự án được xây dựng trong khuôn khổ môn **Thiết Kế Hướng Đối Tượng (TKHDT)**, tập trung vào việc áp dụng các mẫu thiết kế (Design Patterns) vào bài toán thực tế.

---

## Tính năng

### 👤 Người dùng
- Đăng ký, đăng nhập, đăng xuất
- Duyệt sản phẩm theo danh mục (Men / Women / Hoodies / Tees / Shoes / Accessories)
- Xem chi tiết sản phẩm, chọn size và màu sắc
- Thêm vào giỏ hàng và thanh toán
- Wishlist / Favorites
- Đánh giá sản phẩm (rating + bình luận)
- Tìm kiếm sản phẩm real-time
- Xem lịch sử đơn hàng
- Nhận thông báo từ hệ thống

### ⚙️ Admin
- Dashboard tổng quan (doanh thu, đơn hàng, sản phẩm, khách hàng)
- Quản lý sản phẩm: thêm, sửa, xóa
- Quản lý đơn hàng: xem và cập nhật trạng thái
- Quản lý khách hàng
- Nhận thông báo khi có đơn hàng mới

---

## Công nghệ sử dụng

| Phần | Công nghệ |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI Components | shadcn/ui + Radix UI + Tailwind CSS |
| State Management | React Context API + TanStack Query |
| Routing | React Router DOM v6 |
| Animation | Framer Motion |
| Backend | Node.js + Express.js |
| Database | MySQL 8 |
| ORM/Driver | mysql2 |
| Auth | Token-based (custom) |
| Build Tool | Vite 5 |

---

## Cấu trúc thư mục

```
Website/
├── src/                        # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── clofit/             # Components chính của ứng dụng
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── ...
│   │   └── ui/                 # shadcn/ui components
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
│   │   ├── CartService.ts      # Singleton — quản lý giỏ hàng
│   │   ├── ProductCatalog.ts   # Singleton — cache danh mục sản phẩm
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
        ├── seed.js             # Entry point chạy seed
        ├── seedData.js         # Dữ liệu mẫu
        ├── seedRunner.js       # Logic seed tự động
        ├── migrate.js          # Migration helper
        └── index.js            # Express app entry point
```

---

## Cài đặt & Chạy dự án

### Yêu cầu
- Node.js >= 18
- MySQL 8 đang chạy
- npm >= 9

### 1. Clone repo

```bash
git clone https://github.com/tai3042006/E-Commerce-Website.git
cd E-Commerce-Website/Website
```

### 2. Cài đặt dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Cấu hình môi trường

```bash
# Backend
cp server/.env.example server/.env
# Mở server/.env và điền thông tin MySQL của bạn

# Frontend (tuỳ chọn — chỉ cần cho production build)
cp .env.example .env
```

### 4. Khởi tạo database

```bash
# Tạo schema + seed dữ liệu mẫu
npm run seed
```

> Database và bảng sẽ được tạo tự động nếu chưa tồn tại (biến `AUTO_CREATE_DB=true`).

### 5. Chạy ứng dụng

```bash
# Chạy cả frontend lẫn backend cùng lúc
npm run dev:all

# Hoặc chạy riêng từng phần
npm run dev          # Frontend → http://localhost:5173
npm run dev:backend  # Backend  → http://localhost:4000
```

### Tài khoản mặc định sau seed

| Role | Email | Mật khẩu |
|------|-------|----------|
| Admin | admin@clofit.com | admin123 |
| User  | user@clofit.com  | user123  |

---

## Biến môi trường

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

### `.env` (frontend — tuỳ chọn)

```env
# Chỉ cần nếu deploy production trỏ sang server khác
# VITE_API_URL=http://localhost:4000/api
```

---

## Design Patterns

### 1. Singleton — `CartService` & `ProductCatalog`

Đảm bảo chỉ có **một instance duy nhất** tồn tại trong suốt vòng đời ứng dụng.

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

**Java tương đương:**
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

Khi có sự kiện mới (đơn hàng, sản phẩm mới), tất cả subscriber được thông báo tự động. Backend poll mỗi 30 giây.

```typescript
// src/context/NotificationContext.tsx
useEffect(() => {
  const id = setInterval(async () => {
    await refresh(); // notify all observers
  }, 30_000);
  return () => clearInterval(id);
}, [user]);
```

- **AdminObserver**: nhận thông báo khi có đơn hàng mới (`audience = 'admin'`)
- **CustomerObserver**: nhận thông báo khi có sản phẩm mới (`audience = 'customer'`)

**Java tương đương:**
```java
interface NotificationObserver {
    void update(String event, String message);
}
class AdminObserver implements NotificationObserver { ... }
class CustomerObserver implements NotificationObserver { ... }
```

---

### 3. Strategy — `ProductFilterContext`

Cho phép **hoán đổi linh hoạt** thuật toán lọc sản phẩm mà không sửa code hiện tại.

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

// Sử dụng
const ctx = new ProductFilterContext();
ctx.setStrategy(new CategoryFilterStrategy("hoodies"));
const filtered = ctx.executeFilter(allProducts);
```

Các strategy được hỗ trợ: `CategoryFilterStrategy`, `PriceFilterStrategy`, `RatingFilterStrategy`.

**Java tương đương:**
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

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập, nhận token |

### Products — `/api`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Danh sách sản phẩm (filter: `?gender=`, `?category=`) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/products` | Thêm sản phẩm mới (admin) |
| PUT | `/api/products/:id` | Cập nhật sản phẩm (admin) |
| DELETE | `/api/products/:id` | Xóa sản phẩm (admin) |

### Reviews — `/api`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products/:id/reviews` | Lấy đánh giá của sản phẩm |
| POST | `/api/products/:id/reviews` | Gửi đánh giá mới |
| DELETE | `/api/reviews/:id` | Xóa đánh giá |

### Orders — `/api`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Danh sách đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| PATCH | `/api/orders/:id` | Cập nhật trạng thái đơn hàng |

### Notifications — `/api/notifications`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/notifications` | Lấy thông báo của user hiện tại |
| PATCH | `/api/notifications/read` | Đánh dấu tất cả đã đọc |

### Customers — `/api`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/customers` | Danh sách khách hàng (admin) |

---

## Sơ đồ cơ sở dữ liệu

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
npm run dev:all     # Chạy frontend + backend đồng thời
npm run dev         # Chỉ frontend (port 5173)
npm run dev:backend # Chỉ backend  (port 4000)
npm run build       # Build production frontend
npm run seed        # Khởi tạo DB + seed dữ liệu mẫu
npm run test        # Chạy unit tests (Vitest)
```

---

## Ghi chú

- Vite dev server tự động proxy `/api` → `http://localhost:4000`, không cần cấu hình thêm khi dev local.
- Trang admin được bảo vệ bởi `AdminRoute` component — chỉ user có `role = 'admin'` mới truy cập được.
- Dữ liệu giỏ hàng được lưu vào `localStorage` và đồng bộ qua `CartService.subscribe()`.
