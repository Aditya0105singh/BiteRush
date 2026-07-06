# BiteRush — Online Food Delivery Platform

A full-stack food delivery web app built with **Spring Boot**, **React**, **MongoDB**, **AWS S3**, and **Razorpay** — developed as a placement portfolio project.

[![CI](https://github.com/Aditya0105singh/BiteRush/actions/workflows/build.yml/badge.svg)](https://github.com/Aditya0105singh/BiteRush/actions/workflows/build.yml)

**Live:**
- Customer Storefront → https://bite-rush-omega.vercel.app
- Admin Panel → https://bite-rush-admin.vercel.app
- API Docs (Swagger UI) → https://biterush-api-5x4q.onrender.com/swagger-ui.html

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                           Browser                             │
│   ┌──────────────────┐          ┌────────────────────────┐   │
│   │ Customer Store   │          │     Admin Panel        │   │
│   │ React 18 · Vite  │          │  React 19 · Vite       │   │
│   │ Vercel           │          │  Vercel                │   │
│   └────────┬─────────┘          └──────────┬─────────────┘   │
└────────────│──────────────────────────────-│─────────────────┘
             │   REST / JSON  (JWT Bearer)   │
             ▼                               ▼
┌───────────────────────────────────────────────────────────────┐
│           Spring Boot 3.4  ·  Java 21  ·  Render             │
│                                                               │
│   AuthController  FoodController  OrderController             │
│   CartController  UserController                              │
│                                                               │
│   Spring Security (JWT)  ·  Bean Validation  ·  Swagger UI   │
└──────────┬──────────────────────────┬───────────────┬────────┘
           │                          │               │
           ▼                          ▼               ▼
    ┌─────────────┐          ┌──────────────┐  ┌──────────────┐
    │  MongoDB    │          │   AWS S3     │  │  Razorpay    │
    │  Atlas      │          │  eu-north-1  │  │  Payments    │
    └─────────────┘          └──────────────┘  └──────────────┘
```

---

## Tech Stack

| Layer       | Technology                                                   |
|-------------|--------------------------------------------------------------|
| Backend     | Spring Boot 3.4.3, Java 21, Spring Security, JWT (JJWT)     |
| Database    | MongoDB Atlas (Spring Data MongoDB)                          |
| File Store  | AWS S3 (SDK v2)                                              |
| Payments    | Razorpay — HMAC-SHA256 signature verification                |
| Admin UI    | React 19, Vite, Bootstrap 5, React Router v7                 |
| Customer UI | React 18, Vite, Bootstrap 5, React Router v7                 |
| Deployment  | Render (API) · Vercel (frontends) · MongoDB Atlas            |
| CI/CD       | GitHub Actions — build + test on every push to `main`        |
| API Docs    | SpringDoc OpenAPI 3 / Swagger UI                             |

---

## Features

### Customer Storefront
- Browse 45+ dishes across 10 cuisines (Biryani, North Indian, South Indian, Chinese, Pizza, Burgers, Pasta, Street Food, Desserts, Drinks)
- Swiggy-style food cards — green ADD button overlaps the image, animated qty controller
- Hero search bar + category filter with circular image carousel
- Offer banners row, skeleton loading cards (graceful cold-start handling)
- JWT-authenticated cart, persisted server-side
- Razorpay checkout with client-side payment + server-side signature verification
- Order history with 5-step visual status timeline (Placed → Confirmed → Preparing → Out for Delivery → Delivered)
- Axios 401 interceptor — auto-redirects to login on expired token

### Admin Panel
- Secure login with `ADMIN` role (RBAC via Spring Security)
- Add food items with image upload to S3
- View all customer orders and update delivery status

### Backend API
- RESTful design with proper HTTP status codes
- Bean Validation (`@Valid`) on all request bodies
- Global exception handler — 400 / 401 / 403 / 500 mapped to JSON
- **Pagination** on `GET /api/foods` (`?page=0&size=12&category=Pizza`)
- Swagger UI at `/swagger-ui.html` — JWT auth built into the UI
- 6 JUnit 5 unit tests with Mockito (order service + payment verification)

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | Public | Create customer account |
| POST | `/api/login` | Public | Login — returns JWT |
| GET | `/api/foods/all` | Public | All food items (no pagination) |
| GET | `/api/foods?page=0&size=12&category=Pizza` | Public | Paginated food list |
| POST | `/api/foods` | ADMIN | Add food item + upload image to S3 |
| DELETE | `/api/foods/{id}` | ADMIN | Delete food item |
| GET | `/api/cart` | User | View cart |
| POST | `/api/cart` | User | Add item to cart |
| POST | `/api/orders/create` | User | Place order (creates Razorpay intent) |
| POST | `/api/orders/verify` | User | Verify payment signature |
| GET | `/api/orders` | User | User's order history |
| GET | `/api/orders/all` | ADMIN | All orders |
| PATCH | `/api/orders/status/{id}?status=Delivered` | ADMIN | Update order status |

Full interactive docs: **`/swagger-ui.html`**

---

## Local Setup

### Prerequisites
- Java 21, Maven (or use `./mvnw`)
- Node.js 18+
- MongoDB running locally on port 27017
- AWS S3 bucket + Razorpay test account

### 1. Backend
```powershell
cd foodiesapi
# Set environment variables (PowerShell)
$env:JWT_SECRET   = "<64-char random string>"
$env:AWS_ACCESS_KEY  = "..."
$env:AWS_SECRET_KEY  = "..."
$env:AWS_REGION      = "ap-south-1"
$env:AWS_BUCKET_NAME = "..."
$env:RAZORPAY_KEY    = "rzp_test_..."
$env:RAZORPAY_SECRET = "..."

./mvnw spring-boot:run
```
API → `http://localhost:8080`  
Swagger UI → `http://localhost:8080/swagger-ui.html`

### 2. Customer Storefront
```bash
cd foodies
npm install && npm run dev   # http://localhost:5174
```

### 3. Admin Panel
```bash
cd adminpanel
npm install && npm run dev   # http://localhost:5173
```

### 4. Run Tests
```bash
cd foodiesapi && ./mvnw test
```

---

## Project Structure

```
BiteRush/
├── .github/workflows/build.yml       # GitHub Actions CI
├── foodiesapi/                        # Spring Boot API
│   └── src/main/java/com/biterush/
│       ├── config/          # SecurityConfig, OpenApiConfig
│       ├── controller/      # REST controllers (5 controllers)
│       ├── entity/          # MongoDB @Document classes
│       ├── exception/       # GlobalExceptionHandler
│       ├── filters/         # JwtAuthenticationFilter
│       ├── io/              # Request / Response DTOs
│       ├── repository/      # Spring Data MongoDB repos
│       └── service/         # Business logic + S3 + Razorpay
├── foodies/                           # Customer storefront (React 18)
│   └── src/
│       ├── components/      # Navbar, FoodItem, Header, ExploreMenu
│       ├── pages/           # Home, Cart, MyOrders, FoodDetails
│       ├── context/         # StoreContext (global state)
│       └── service/         # axiosInstance (interceptor) + API calls
└── adminpanel/                        # Admin dashboard (React 19)
```

---

## Security Design

- Passwords hashed with BCrypt
- Stateless JWT — no server-side session storage
- RBAC: `ADMIN` role guards food management and order status endpoints
- CORS restricted to known origins (localhost + Vercel deployments)
- Bean Validation on all request bodies — malformed input returns 400 with per-field errors
- Razorpay payments verified server-side via HMAC-SHA256 before marking as Paid
