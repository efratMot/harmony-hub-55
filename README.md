# 🎵 Harmony Music Store

A full-stack web application for an online musical instruments store, built with React + Node.js/Express.

---

## 📋 Project Description

Harmony Music Store is a modern e-commerce platform for musical instruments. It features:

- **Product browsing** with category filtering and search
- **User authentication** (register/login) with JWT tokens
- **Shopping cart** with persistent localStorage storage
- **Multi-step checkout** with order creation
- **Admin dashboard** for managing product inventory
- **Responsive design** with smooth animations

The backend uses JSON files for data storage (no database required), making it simple and suitable for a student project.

---

## 🚀 How to Install & Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install & Run the Backend Server

```bash
cd server
npm install

# Seed the database with hashed passwords (run once)
node seed.js

# Start the server
npm run dev
```

The server runs on **http://localhost:5000**

### 3. Install & Run the Frontend (React)

Open a new terminal:

```bash
# From the project root
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** (or similar Vite port)

### 4. Configure API URL (optional)

By default, the frontend connects to `http://localhost:5000/api`. To change this, create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

> **Note:** The frontend includes a mock fallback — it works even without the server running (using local data and localStorage).

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| POST   | `/api/auth/register` | Register new user  | No            |
| POST   | `/api/auth/login`    | Login & get token  | No            |

**Register** request body:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Login** request body:
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response** (both):
```json
{
  "token": "eyJhbGciOiJI...",
  "user": { "id": "user-1", "name": "Jane Doe", "email": "jane@example.com", "isAdmin": false }
}
```

### Products

| Method | Endpoint              | Description                     | Auth Required |
|--------|-----------------------|---------------------------------|---------------|
| GET    | `/api/products`       | List all products               | No            |
| GET    | `/api/products/:id`   | Get single product              | No            |
| POST   | `/api/products`       | Add new product                 | Admin only    |
| DELETE | `/api/products/:id`   | Delete a product                | Admin only    |

**Query parameters** for `GET /api/products`:
- `category` — filter by category (e.g., `?category=Guitars`)
- `search` — search by name/description (e.g., `?search=fender`)

### Orders

| Method | Endpoint        | Description              | Auth Required |
|--------|-----------------|--------------------------|---------------|
| POST   | `/api/orders`   | Create a new order       | Yes           |
| GET    | `/api/orders`   | Get user's orders        | Yes           |

**Create order** request body:
```json
{
  "items": [{ "productId": "1", "name": "Fender Stratocaster", "quantity": 1, "price": 1299 }],
  "total": 1299,
  "shipping": { "address": "123 Main St", "city": "New York", "zip": "10001", "phone": "555-0123" }
}
```

### Health Check

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | `/api/health`  | Server status check  |

---

## 🔐 Authentication System

### How It Works

1. **Registration**: User submits name, email, and password → password is hashed with `bcrypt` → user is saved to `users.json` → JWT token is returned
2. **Login**: User submits email and password → password is compared with `bcrypt` → JWT token is generated and returned
3. **Protected Routes**: The JWT token is sent in the `Authorization: Bearer <token>` header → middleware verifies the token → request proceeds or is rejected
4. **Admin Access**: Users with `isAdmin: true` can access admin-only endpoints (POST/DELETE products)

### JWT Token

- Secret key: defined in `server/middleware/auth.js`
- Expiration: 24 hours
- Payload: `{ id, email, isAdmin }`

### Default Users

| Role  | Email                    | Password     |
|-------|--------------------------|--------------|
| Admin | admin@musicstore.com     | admin123     |
| User  | john@example.com         | password123  |

> Run `node seed.js` in the server directory to create these users with properly hashed passwords.

---

## 💾 JSON Storage System

Instead of a database, this project uses JSON files stored in `server/data/`:

| File              | Purpose                                  |
|-------------------|------------------------------------------|
| `products.json`   | All product data (id, name, category, price, image, description, stock) |
| `users.json`      | Registered users with hashed passwords and isAdmin flag |
| `orders.json`     | All placed orders with items, shipping, and timestamps |

### How It Works

- Files are read with `fs.readFileSync()` and parsed with `JSON.parse()`
- Files are written with `fs.writeFileSync()` and `JSON.stringify()`
- Each route handler reads the latest data from the file before responding
- This approach is simple but **not suitable for production** (no concurrent write safety)

---

## 🎨 UI Features

- **Modern warm color palette** with soft gradients and shadows
- **Framer Motion animations** for page transitions, hover effects, and cart interactions
- **Responsive design** — works on desktop, tablet, and mobile
- **Image zoom** on product detail page
- **Multi-step checkout** with form validation
- **Category filtering** and **search** on the home page
- **Animated cart badge** showing item count
- **Admin dashboard** with product management table

---

## 📁 Project Structure

```
├── server/                  # Backend (Node.js + Express)
│   ├── data/
│   │   ├── products.json    # Product catalog
│   │   ├── users.json       # User accounts
│   │   └── orders.json      # Order history
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Login & register routes
│   │   ├── products.js      # Product CRUD routes
│   │   └── orders.js        # Order routes
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Password hashing seed script
│   └── package.json         # Server dependencies
│
├── src/                     # Frontend (React + Vite)
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React contexts (Auth, Cart)
│   ├── data/                # Local product data (fallback)
│   ├── lib/                 # API client utilities
│   ├── pages/               # Page components
│   └── index.css            # Global styles & design tokens
│
├── package.json             # Frontend dependencies
└── README.md                # This file
```

---

## 🛒 Cart System

The shopping cart is managed entirely on the client side using React Context + localStorage:

- **CartContext** provides `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`
- Cart items persist across page refreshes via `localStorage`
- The cart badge in the navbar shows the total item count
- At checkout, the cart items are sent to the server's `/api/orders` endpoint

---

## ⚡ Frontend-Server Integration

The React frontend uses a smart API layer (`src/lib/api.ts`):

1. On app load, it checks if the Express server is running (`/api/health`)
2. If the server is available → all data comes from the server API
3. If the server is unavailable → falls back to local mock data and localStorage
4. This means the **frontend works standalone** (great for development/demos) and **with the server** (full-stack mode)
