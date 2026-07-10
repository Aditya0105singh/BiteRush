# BiteRush — Online Food Delivery App

Full-stack food delivery platform with a Spring Boot REST API, React admin panel, and React customer-facing storefront.

## Project Structure

```
BiteRush/
├── online-food-delivery-project/online-food-delivery-project/
│   ├── adminpanel/     # React 19 + Vite — Admin Dashboard (port 5173)
│   ├── foodies/        # React 18 + Vite — Customer Storefront (port 5174)
│   └── foodiesapi/     # Spring Boot 3.4.3 + Java 21 — REST API (port 9090)
└── Foodies API.postman_collection.json   # Postman collection for API testing
```

## Tech Stack

| Layer     | Technology                                         |
|-----------|----------------------------------------------------|
| Backend   | Spring Boot 3.4.3, Java 21, MongoDB, JWT, AWS S3   |
| Payment   | Razorpay                                           |
| Admin UI  | React 19, Vite, Bootstrap 5, React Router v7       |
| Customer  | React 18, Vite, Bootstrap 5, React Router v7       |

## Prerequisites

- **Java 21** (project compiles with Java 21; Java 25 is installed — verify compatibility)
- **Maven** (use the included `mvnw` wrapper inside `foodiesapi/`)
- **MongoDB** running locally on `mongodb://localhost:27017/foodies`
- **Node.js 18+** / npm
- **AWS account** with an S3 bucket (for food item image uploads)
- **Razorpay account** (test keys are fine for development)

## Running the Project

### 1. Backend — Spring Boot API

Fill in `foodiesapi/.env` (copy from `.env.example`), then set environment variables before starting:

```powershell
# In PowerShell, from the foodiesapi/ directory
$env:AWS_ACCESS_KEY="..."
$env:AWS_SECRET_KEY="..."
$env:AWS_REGION="ap-south-1"
$env:AWS_BUCKET_NAME="..."
$env:JWT_SECRET="<64-char random string>"
$env:RAZORPAY_KEY="rzp_test_..."
$env:RAZORPAY_SECRET="..."
.\mvnw spring-boot:run
# OR run the pre-built jar:
java -jar target/foodiesapi-0.0.1-SNAPSHOT.jar
```

API runs at `http://localhost:9090`.

### 2. Admin Panel

```bash
cd adminpanel
# .env.local is already created — no setup needed
npm run dev        # http://localhost:5173
```

### 3. Customer Storefront (Foodies)

Before starting, edit `foodies/src/util/contants.js` and replace `razor_pay_key` with your Razorpay test key:

```js
export const RAZORPAY_KEY = "rzp_test_xxxxxxxxxxxxxxxx";
```

```bash
cd foodies
npm run dev        # http://localhost:5174
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `foodiesapi/src/main/resources/application.properties` | Spring Boot config — reads env vars |
| `foodiesapi/.env` | Local env vars (gitignored — fill from `.env.example`) |
| `foodies/src/util/contants.js` | Razorpay public key for the storefront |
| `adminpanel/vite.config.js` | Vite dev server pinned to port 5173 |
| `foodies/vite.config.js` | Vite dev server pinned to port 5174 |

## API Overview

Controllers under `foodiesapi/src/main/java/com/biterush/foodiesapi/controller/`:

- `AuthController` — register / login (JWT)
- `UserController` — user profile
- `FoodController` — CRUD for food items (images stored in S3)
- `CartController` — add/remove/view cart
- `OrderController` — place order, Razorpay payment flow

See `Foodies API.postman_collection.json` at the project root for all endpoint examples.

## MongoDB

Database name: `foodies` (default). Override in `application.properties`:

```
spring.data.mongodb.uri=mongodb://localhost:27017/foodies
```

No migrations needed — Spring Data MongoDB creates collections on first use.
