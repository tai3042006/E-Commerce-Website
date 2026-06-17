# CloFit API server

Small Express + MySQL backend for the CloFit e-commerce frontend.

## Prerequisites

- Node.js >= 18
- MySQL 8.x running locally (or via Docker)

## Setup

### 1. Start MySQL

The easiest way is Docker:

```bash
docker run --name clofit-mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=clofit \
  -d mysql:8
```

Or use a local MySQL install and run:

```sql
CREATE DATABASE clofit;
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL user/password
```

### 3. Install + start

```bash
npm install
npm run dev
```

On first start the server:

1. Connects to MySQL
2. Runs `src/schema.sql` (creates 7 tables)
3. Calls `src/seed.js` to populate them from `../src/data/products.ts` and
   `../src/data/admin.ts` — but only when the `products` table is empty.

## Endpoints

| Method | Path               | Returns                              |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/products`    | All products with joined arrays      |
| GET    | `/api/products/:id`| Single product                       |
| GET    | `/api/categories`  | Category list                        |
| GET    | `/api/customers`   | All customers                        |
| GET    | `/api/orders`      | All orders, joined with customer     |

`GET /api/products` accepts query params: `?gender=men&category=hoodies&badge=new`.

## Running alongside the frontend

From the `Website/` root:

```bash
npm run dev:all
```

This runs Vite on `:8080` and the API on `:4000` concurrently.

Set `VITE_API_URL=http://localhost:4000/api` in `Website/.env` so the React app
calls this server. With that var unset, the frontend falls back to the static
`src/data/*.ts` files.
