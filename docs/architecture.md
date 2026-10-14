# Crema Web — System Architecture

## 1. Overview
Crema Web is a modern, high-performance coffee-shop Point-of-Sale (POS) and ordering web application. It translates the original Crema Flutter mobile/desktop experience into a responsive, full-featured web application deployed as a containerized microservice with dedicated monitoring.

---

## 2. Architecture Diagram

```mermaid
graph TD
    Client[Browser / Customer & Admin Devices] -->|HTTP / HTTPS| Ingress[Next.js 16 Web Server :3000]
    
    subgraph Crema Web Application
        Ingress --> Pages[App Router Pages]
        Pages --> CustomerFlow[Customer Shell: Menu, Orders, Loyalty Profile]
        Pages --> AdminFlow[Admin Shell: Dashboard, Inventory, Reports, Users]
        
        CustomerFlow --> Contexts[React Context State Layer]
        AdminFlow --> Contexts
        
        Contexts --> PureLogic[src/lib/calculations.ts]
        Contexts --> FBSvc[src/lib/firebaseService.ts]
        
        Ingress --> HealthRoute[/api/health]
        Ingress --> MetricsRoute[/api/metrics]
        MetricsRoute --> Collector[src/lib/metricsCollector.ts]
    end

    subgraph Observability Stack
        Prometheus[Prometheus :9090] -->|Scrapes /api/metrics| MetricsRoute
        Grafana[Grafana Dashboard :3001] -->|Queries| Prometheus
    end

    subgraph Firebase Cloud Backend
        FBSvc -->|Auth SDK| FBAuth[(Firebase Authentication)]
        FBSvc -->|Firestore SDK| FBDb[(Firestore Cloud Database)]
        FBDb --> Collections[(users, orders, menu_items, inventory, coupons)]
    end
```

---

## 3. Technology Stack Justification

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Core Framework** | Next.js 16 (App Router) | Server-side rendering, standalone container builds, zero-config API routing, dynamic caching. |
| **Language** | TypeScript 5 | Strict end-to-end type safety matching Flutter Dart models. |
| **State Management** | React Context (7 contexts) | Modular, decoupled domain boundaries (Auth, Menu, Order, Inventory, Coupon, Report, Toast) without external boilerplate. |
| **Styling** | Vanilla CSS + CSS Variables | Pixel-perfect brand control, zero CSS runtime overhead, rich coffee theme (`#1A1210`, `#D4A574`). |
| **Database & Auth** | Firebase 13 (Auth + Firestore) | Realtime document listeners (`onSnapshot`), distributed transactions, offline fallbacks. |
| **Visualizations** | Recharts & SheetJS (xlsx) | Interactive sales analytics and direct Excel report exports for POS managers. |
| **Containerization** | Docker (Alpine Multi-Stage) | Standalone Node.js runner with minimal image footprint (<180MB) and non-root execution. |
| **Observability** | Prometheus & Grafana | Standard Prometheus scrape format (`/api/metrics`) with pre-provisioned dashboards. |

---

## 4. Component Interaction & Data Flow

1. **Authentication & Authorization:**
   - User signs in with Firebase Auth.
   - `AuthContext` queries the `users/{uid}` document to determine role (`admin` or `customer`).
   - Role gates access between the customer shell (`/customer/*`) and admin shell (`/admin/*`).

2. **Realtime Order Lifecycle:**
   - Customer adds items to cart → discount & order validation computed via `src/lib/calculations.ts`.
   - Checkout invokes `placeOrderTransaction` in `firebaseService.ts`.
   - Atomic Firestore transaction checks inventory stock levels (`currentStock >= required`), deducts ingredients, increments customer loyalty points, and records order status as `pending` / `received`.
   - Admin dashboard receives real-time order update via Firestore snapshot listener.
   - Admin changes brew status (`received` → `brewing` → `ready`), which streams instantly to customer screen.

3. **Telemetry & Metrics Pipeline:**
   - Every incoming request passes through route handlers and middleware.
   - Metrics are recorded in `src/lib/metricsCollector.ts`.
   - Prometheus scrapes `/api/metrics` every 10 seconds.
   - Grafana queries Prometheus to render real-time request rates, latency distribution, and memory utilization.
