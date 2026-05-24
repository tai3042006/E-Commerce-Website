# CLOFIT — Fashion E-Commerce Website

> *Wear Your Story.* — Modern fashion store for clothes & shirts.

---

## Project Structure

```
CLOFIT/
├── index.html           ← Main HTML page
├── styles.css           ← All custom CSS (Tailwind CDN + custom vars)
├── script.js            ← Vanilla JavaScript (cart, search, theme, etc.)
└── backend/
    └── src/main/java/com/clofit/
        ├── model/
        │   ├── Product.java          (domain model)
        │   └── Order.java            (order + CartItem)
        ├── dao/
        │   ├── DatabaseConnection.java  ← SINGLETON pattern
        │   └── ProductDAO.java          (in-memory data store)
        ├── factory/
        │   └── ProductFactory.java      ← FACTORY METHOD pattern
        ├── observer/
        │   ├── OrderObserver.java       ← OBSERVER interface
        │   ├── ObserverFactory.java     (Email / Inventory / Analytics observers)
        │   └── OrderService.java        ← OBSERVER subject/publisher
        ├── controller/
        │   ├── ApiResponse.java         ← MVC View layer
        │   ├── ProductController.java   ← MVC Controller
        │   └── OrderController.java
        └── server/
            └── Main.java                ← HTTP server entry point
```

---

## ▶ Run the Frontend Locally

### Option A — Direct file open
```bash
# Just open index.html in your browser — no build step needed!
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option B — Local dev server (recommended for best experience)
```bash
# Python 3 (built-in)
python3 -m http.server 3000
# Then open: http://localhost:3000

# OR with Node.js
npx serve .
# OR
npx live-server
```

---

## ▶ Run the Java Backend

### Requirements
- Java 17+ (uses `switch` expressions and `com.sun.net.httpserver`)

### Compile & Run

```bash
cd backend

# Compile all Java files
find src -name "*.java" | xargs javac -d out

# Run the server
java -cp out com.clofit.server.Main
```

Server starts at: **http://localhost:8080**

### API Endpoints

| Method | Endpoint                        | Description               |
|--------|---------------------------------|---------------------------|
| GET    | /api/products                   | List all products         |
| GET    | /api/products?category=shirt    | Filter by category        |
| GET    | /api/products?sort=price-asc    | Sort products             |
| GET    | /api/products/{id}              | Get product by ID         |
| GET    | /api/products/search?q=linen    | Search products           |
| POST   | /api/products                   | Create new product        |
| PUT    | /api/products/{id}              | Update product            |
| DELETE | /api/products/{id}              | Delete product            |
| GET    | /api/orders                     | List all orders           |
| PUT    | /api/orders/{id}/status         | Update order status       |
| GET    | /health                         | Health check              |

### Example API Calls

```bash
# Get all shirts
curl http://localhost:8080/api/products?category=shirt

# Search
curl "http://localhost:8080/api/products/search?q=oxford"

# Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Silk Evening Shirt","category":"formal","price":"195"}'

# Update order status
curl -X PUT http://localhost:8080/api/orders/CLO-XXXXXXXX/status \
  -H "Content-Type: application/json" \
  -d '{"status":"SHIPPED"}'
```

---

## 🎨 Design Patterns Used

### 1. Singleton — `DatabaseConnection`
Only one database connection is created throughout the application lifecycle.
Thread-safe via **double-checked locking** with `volatile`.

```java
DatabaseConnection db = DatabaseConnection.getInstance(); // always same instance
```

### 2. Factory Method — `ProductFactory`
Centralises product creation with type-specific defaults.
Callers don't need to know constructors or default values.

```java
Product shirt   = ProductFactory.createShirt("Oxford Slim", 89.00);
Product limited = ProductFactory.createLimitedEdition("Velvet Blazer", "formal", 280.00);
Product sale    = ProductFactory.createSaleItem("Summer Tee", "tee", 32.00, 0.20);
```

### 3. Observer — `OrderService` + `OrderObserver`
When an order is placed or updated, all registered observers are notified automatically.

```
OrderService (Subject)
   ├── EmailNotificationObserver   → sends confirmation email
   ├── InventoryObserver           → decrements stock
   └── AnalyticsObserver           → tracks revenue metrics
```

### 4. MVC — Controller / Model / View
- **Model**: `Product`, `Order` (domain objects + DAO)
- **Controller**: `ProductController`, `OrderController` (routing + business logic)
- **View**: `ApiResponse<T>` (serialises data to JSON response)

---

## 🌟 Frontend Features

| Feature | Details |
|---------|---------|
| 🌙 Dark / Light Mode | Persisted to localStorage, toggle in navbar |
| 🛒 Cart Drawer | Add/remove/qty, persisted to localStorage |
| 🔍 Search Overlay | Cmd+K shortcut, live results with highlighting |
| 🎯 Product Filter | Filter collection by category with animation |
| 📊 Sort Products | Price asc/desc, top rated |
| 📬 Contact Form | Validated form with success state |
| 📧 Newsletter | Email capture with toast confirmation |
| 🎬 Scroll Animations | IntersectionObserver reveal + counter animations |
| 📱 Responsive | Mobile-first, Tailwind breakpoints |
| ♾️ Load More | Paginated product grid |
