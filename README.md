# Crema — Coffee Shop Management System

Crema is a modern, responsive coffee shop ordering and operations management web platform built with Next.js, React, TypeScript, and Firebase Firestore. It includes a customer portal for browsing items, placing orders, and earning loyalty points, along with an administrative back-office for inventory tracking, order fulfillment, coupon generation, and sales reporting.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Client Browser (Next.js)  |
                      |   Customer & Admin Portals  |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
+-----------------------------+               +-----------------------------+
|    Firebase Authentication  |               |      Cloud Firestore        |
|  - Email/Password Auth      |               |  - orders / users           |
|  - Role-based Access        |               |  - menu / inventory         |
+-----------------------------+               |  - coupons / categories     |
                                              +-----------------------------+
                                                             |
+-----------------------------+               +-----------------------------+
|      Next.js Middleware     |               |      Prometheus & Grafana   |
|  - /api/metrics collection  | ------------> |  - /api/metrics scrape      |
|  - /api/health endpoint     |               |  - Real-time dashboards     |
+-----------------------------+               +-----------------------------+
```

### Core Technologies
- **Frontend / Framework**: Next.js 16 (App Router), React 19, TypeScript
- **State Management & Auth**: React Context (`AuthContext`, `OrderContext`, `ToastContext`, `ReportContext`), Firebase Auth
- **Database**: Cloud Firestore (NoSQL, transactions for atomic inventory deductions)
- **Styling**: Vanilla CSS Modules & theme tokens (warm coffee aesthetic)
- **Analytics & Visualizations**: Recharts, Lucide Icons, SheetJS (xlsx export)
- **Containerization**: Multi-stage Docker (`node:20-alpine`) with standalone output
- **Observability**: Custom Prometheus metrics middleware (`/api/metrics`), health endpoint (`/api/health`), Grafana dashboard
- **CI/CD**: GitHub Actions (lint, typecheck, unit/component tests, Docker build & push)

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+ and npm
- Firebase project credentials

### 1. Environment Setup
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev --webpack` | Start local development server |
| `npm run build` | `next build --webpack` | Compile standalone production build |
| `npm run start` | `next start` | Launch production server |
| `npm run lint` | `next lint` | Execute ESLint checks across codebase |
| `npm test` | `vitest run` | Run all unit and component test suites |
| `npm run test:watch` | `vitest` | Run tests in interactive watch mode |

---

## Running with Docker Compose

Crema includes a full Docker stack containing the application, Prometheus metrics scraper, and Grafana monitoring dashboard.

```bash
# Build and run the entire stack
docker compose up --build -d

# Check service status
docker compose ps

# View application logs
docker compose logs -f crema-web
```

### Stack Endpoints
- **Crema Web Application**: [http://localhost:3000](http://localhost:3000)
- **Application Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Prometheus Metrics**: [http://localhost:3000/api/metrics](http://localhost:3000/api/metrics)
- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboard**: [http://localhost:3001](http://localhost:3001) (default login: `admin` / `crema2026`)

---

## Observability & Monitoring

The application instruments HTTP requests via Next.js middleware and surfaces standard Prometheus exposition metrics at `/api/metrics`:
- `http_requests_total`: Counter partitioned by HTTP method, route, and status code
- `http_request_duration_seconds`: Histogram measuring end-to-end request latency
- `http_requests_active`: Current gauge of in-flight requests
- `app_info`: System metadata and uptime

Pre-configured Grafana dashboards are automatically provisioned under `grafana/provisioning/` to visualize request rates, latency percentiles, error rates (4xx/5xx), and health status out-of-the-box.

---

## Automated CI/CD Pipeline

The repository integrates two GitHub Actions workflows:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggers on pull requests and pushes to `main`
   - Runs ESLint validation
   - Executes TypeScript typechecking (`tsc --noEmit`)
   - Executes Vitest unit & component test suites with coverage
   - Validates multi-stage Docker build

2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - Triggers on pushes/tags to `main` following successful CI
   - Builds production Docker image and publishes to GitHub Container Registry (GHCR)
   - Performs automated rolling deployment to the target host via SSH
