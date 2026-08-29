<div align="center">

# 🛒 TrustCart

### *Your Trusted Market Advisor*

**A full-stack Romanian e-commerce platform with an AI-powered recommendation engine that transparently suggests competitor platforms when they offer better deals.**

[![Kotlin](https://img.shields.io/badge/Kotlin-2.2-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Docker-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

> 🎓 *Bachelor's Thesis Project — Faculty of Automatic Control and Computer Science, UNSTPB*  

</div>

---

## 💡 What Makes TrustCart Different?

Most e-commerce platforms are designed to keep you on their site, even when better options exist elsewhere. **TrustCart does the opposite.**

When you search for a product, TrustCart's AI engine compares prices across **eMAG**, **Altex**, and **Flanco** in real time. If external platforms offer a significantly better deal, TrustCart tells you — with links and reasoning. No dark patterns. No inflated internal prices pushed to the top. Just honest recommendations.

> *"We'd rather lose a sale than your trust."*

---

## ✨ Features

### 🤖 AI-Powered Recommendation Engine
- **Two-phase Perplexity Sonar strategy** — Phase 1 retrieves verified retailer URLs via real-time web search; Phase 2 extracts prices and specs from those URLs
- **Three recommendation modes**: recommend internal products, external platforms, or both — based on real price comparison
- **Transparent decision logic**: if external is >15% cheaper → recommend external; if internal is >10% cheaper → recommend internal; otherwise show both
- **24-hour DB-backed cache** keyed on normalized query strings to minimize redundant API calls
- **Romanian-language reasoning** generated deterministically from real comparison data (`buildReasoning`)
- **Strategy Pattern abstraction** — AI provider can be swapped in a single configuration line

### 🛍️ Full E-Commerce Platform
- **Product catalog** with 116+ seeded products across 9 categories
- **Shopping Cart** — add, update quantity, remove items, clear cart
- **Wishlist** — save products for later
- **Order management** — checkout, order history, cancellation, real-time status tracking
- **Stock validation** at checkout with automatic stock decrement on order

### 🔐 Authentication & Authorization
- **JWT-based stateless authentication** with role-based access control (`USER` / `ADMIN`)
- Secure password hashing with BCrypt
- Custom `JwtAuthenticationFilter` integrated with Spring Security

### 👨‍💼 Admin Panel
- Manage products, categories, and suppliers (full CRUD)
- View and update all orders with status transitions
- View user feedback submissions
- Monitor all active carts

### 📧 Transactional Emails
- **Welcome email** on registration — branded HTML template
- **Order confirmation email** — itemized receipt with shipping details
- Async sending via Gmail SMTP (`@Async`) — never blocks the request

### 📋 Feedback System
- Structured feedback form (category, experience rating, useful features, suggestions)
- Admin-accessible feedback dashboard

### 👤 User Profile
- View and update personal details
- Change password with current password verification

---

## 🏗️ Architecture

```
trustcart/
├── 🔧 Backend (Kotlin + Spring Boot)
│   ├── ai/
│   │   ├── AIProvider.kt              ← Strategy Pattern interface
│   │   ├── models/                    ← AISearchResult, ExternalProduct
│   │   └── providers/
│   │       └── PerplexityProvider.kt  ← Two-phase Perplexity implementation
│   ├── config/                        ← SecurityConfig, AIConfig
│   ├── controller/                    ← REST endpoints
│   ├── dto/                           ← Request/Response data classes
│   ├── entity/                        ← JPA entities
│   ├── mapper/                        ← Entity ↔ DTO mappers
│   ├── repository/                    ← Spring Data JPA repositories
│   ├── security/                      ← JWT filter & token provider
│   └── service/                       ← Business logic
│
├── 🎨 Frontend (React + Vite + Framer Motion)
│   ├── AI Recommendations page        ← Hero mode, auto-search, animated steps
│   ├── Admin panel
│   ├── Account & profile pages
│   └── Navbar with cart/wishlist dropdowns
│
└── 🗄️ Database (PostgreSQL via Docker)
    └── Flyway migrations              ← V1 schema + V2 feedback table
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Kotlin 2.2 + Java 21 |
| **Backend Framework** | Spring Boot 4.0 |
| **ORM** | JPA / Hibernate |
| **Database Migrations** | Flyway |
| **Database** | PostgreSQL (Docker) |
| **Security** | Spring Security + JWT (jjwt 0.11.5) |
| **AI Provider** | Perplexity Sonar API |
| **JSON Processing** | Gson |
| **Email** | Spring Mail + Gmail SMTP |
| **Frontend** | React + Vite |
| **Animations** | Framer Motion |
| **Build Tool** | Gradle (Kotlin DSL) |
| **Testing** | JUnit 5, MockK, Mockito, k6 (stress tests) |
| **API Docs** | springdoc-openapi (Swagger UI) |

---

## 🗄️ Database Schema

The database is managed entirely through Flyway migrations:

- **`users`** — accounts with JWT auth support
- **`products`** — catalog with category and supplier FK
- **`categories`** / **`suppliers`** — product classification
- **`carts`** + **`cart_items`** — one-to-one cart per user
- **`wishlists`** — unique constraint per user+product pair
- **`orders`** + **`order_items`** — price snapshot at time of purchase
- **`external_recommendations`** — 24h TTL AI result cache
- **`notifications`** — typed in-app notifications
- **`feedbacks`** — structured user feedback

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Docker (for PostgreSQL)
- Node.js 18+ (for frontend)
- A [Perplexity API key](https://www.perplexity.ai/)

### 1. Start the Database

```bash
docker run --name trustcart-db \
  -e POSTGRES_DB=ecommerce_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=parola \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Configure the Backend

Edit `src/main/resources/application.properties`:

```properties
perplexity.api.key=YOUR_PERPLEXITY_KEY_HERE
spring.mail.username=YOUR_GMAIL_HERE
spring.mail.password=YOUR_APP_PASSWORD_HERE
```

### 3. Run the Backend

```bash
./gradlew bootRun
```

Flyway will automatically apply migrations and seed the schema on first run.

> Backend runs on `http://localhost:8080`  
> Swagger UI available at `http://localhost:8080/swagger-ui.html`

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create account |
| `POST` | `/api/auth/login` | Public | Login & get JWT |
| `GET` | `/api/products` | Public | Browse catalog |
| `POST` | `/api/recommendations/search?query=` | User | AI recommendations |
| `GET` | `/api/cart` | User | View cart |
| `POST` | `/api/cart/items` | User | Add to cart |
| `POST` | `/api/orders` | User | Checkout |
| `GET` | `/api/orders` | User | Order history |
| `POST` | `/api/wishlist/{productId}` | User | Add to wishlist |
| `PUT` | `/api/orders/{id}/status` | Admin | Update order status |
| `GET` | `/api/feedback` | Admin | View all feedback |
| `GET` | `/api/users/count` | Admin | User count |

---

## 🧠 How the AI Recommendation Engine Works

```
User searches: "laptop gaming"
        │
        ▼
① Cache check (external_recommendations table, 24h TTL)
        │ miss
        ▼
② Internal catalog search (PostgreSQL full-text)
        │
        ▼
③ Phase 1 — Perplexity Sonar
   → Searches eMAG, Altex, Flanco with Romanian location context
   → Returns real search_results URLs + product metadata
        │
        ▼
④ Phase 2 — Perplexity Sonar
   → Given verified URLs from Phase 1, match products to specific pages
   → Returns name, price (RON), specs, searchResultIndex
        │
        ▼
⑤ Decision Logic
   • External >15% cheaper  → recommendation = "external"
   • Internal >10% cheaper  → recommendation = "internal"
   • Prices comparable       → recommendation = "both"
        │
        ▼
⑥ buildReasoning() generates deterministic Romanian explanation
⑦ Cache result for 24h
⑧ Return RecommendationDTO to frontend
```

---

## 🗂️ Product Categories & Pricing Strategy

The catalog is intentionally seeded with asymmetric pricing to demonstrate the recommendation engine:

| Category | Internal Price | External Signal | Expected Recommendation |
|---|---|---|---|
| 📱 Telefoane & Tablete | Inflated | Much cheaper externally | `external` |
| 🎮 Gaming | Below market | Pricier externally | `internal` |
| 💻 Laptopuri | Competitive | Similar | `both` |
| *(other categories)* | Market rate | Varies | Context-dependent |

---

## 🧪 Testing

```bash
# Unit & integration tests
./gradlew test

# Stress testing (k6 required)
k6 run tests/stress/recommendations.js
```

Integration tests use `@SpringBootTest` + `@MockitoBean` for JWT filter compatibility.

---

## 📁 Project Structure Highlights

```
src/
├── main/
│   ├── kotlin/com/ecommerce/ecommerceapp/
│   │   ├── ai/                  ← Strategy Pattern AI abstraction
│   │   ├── config/              ← Spring & AI configuration
│   │   ├── controller/          ← 10 REST controllers
│   │   ├── dto/                 ← 25+ request/response DTOs
│   │   ├── entity/              ← 12 JPA entities
│   │   ├── exception/           ← Global exception handler
│   │   ├── mapper/              ← Clean entity↔DTO mapping layer
│   │   ├── repository/          ← Spring Data JPA (custom JPQL queries)
│   │   ├── security/            ← JWT filter + token provider
│   │   └── service/             ← Business logic layer
│   └── resources/
│       └── db/migration/        ← Flyway V1 + V2 SQL migrations
└── test/                        ← JUnit 5 integration tests
```

---

## 🔒 Security Notes

- JWT tokens expire after 24 hours
- Passwords hashed with BCrypt
- CORS restricted to `localhost:5173` in development
- CSRF disabled (stateless REST API)
- Role-based route protection (`ROLE_USER` / `ROLE_ADMIN`) enforced at the filter chain level

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

*Faculty of Automatic Control and Computer Science - National University of Science and Technology POLITEHNICA Bucharest*

</div>
