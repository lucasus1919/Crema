# Crema DevOps — Implementation & Delivery Report

## Project Details
- **Project Name:** Crema Web POS & Customer Portal
- **Repository:** `Nextjs/crema-web`
- **Course / Assignment:** Cloud & DevOps Engineering
- **Date:** October 2026

---

## 1. Git Workflow & Version Control
Crema Web adopts a feature-branch and trunk-based workflow with automated CI validation:
- **`main` Branch:** Protected production branch. All merges require passing CI (lint, tests, build).
- **Commit Conventions:** Conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `ci:`, `docs:`).
- **PR Checks:** GitHub Actions triggers on all PRs targeting `main` to prevent breaking changes.

---

## 2. CI Pipeline Implementation
Continuous Integration is orchestrated via `.github/workflows/ci.yml`.

### Key Pipeline Stages:
1. **Dependency Resolution:** Utilizes `npm ci` with caching on Node.js 20.
2. **Linting & Code Quality:** ESLint with React 19 and Next.js 16 core web vitals.
3. **Automated Unit & Component Tests:** Vitest runner with 7 test suites (36 test cases) covering:
   - Discount calculations (percentage, flat, subtotal bounds).
   - Cart item mutation and quantity updates.
   - Order validation and order numbering.
   - Coupon lifecycle, expirations, and max usage thresholds.
   - Core UI component rendering and interactions (Badge, Button, Spinner).
4. **Standalone Production Build:** Compiles the complete Next.js app with `next build --webpack` and `output: 'standalone'`.

### Screenshot Placeholder: CI Pipeline Execution
```
[Insert Screenshot: GitHub Actions CI workflow run showing green checks for lint, test, and build]
```

---

## 3. Containerization (Docker)
The application is packaged using a multi-stage Dockerfile based on `node:20-alpine`:
- **Stage 1 (`deps`):** Downloads and caches production npm packages.
- **Stage 2 (`builder`):** Compiles the Next.js standalone server and bundles client assets.
- **Stage 3 (`runner`):** Minimal runtime container running as a non-privileged `nextjs` user on port 3000.
- **Healthcheck:** Embedded `wget --spider http://localhost:3000/api/health` probe.

### Multi-Container Orchestration (`docker-compose.yml`)
- **`crema-web`:** Port `3000` (Next.js Application)
- **`prometheus`:** Port `9090` (Scrapes `/api/metrics` every 10s)
- **`grafana`:** Port `3001` (Pre-provisioned dashboards)

### Local Launch Command:
```bash
docker compose up -d --build
```

### Screenshot Placeholder: Docker Containers Running
```
[Insert Screenshot: `docker compose ps` output or Docker Desktop showing crema-web, prometheus, and grafana]
```

---

## 4. Deployment Pipeline
The continuous delivery workflow is codified in `.github/workflows/deploy.yml`:
- Triggered automatically on push to `main`.
- Authenticates with GitHub Container Registry (`ghcr.io`).
- Builds and tags the multi-stage image with the commit SHA and `latest`.
- Pushes the image to `ghcr.io/<owner>/crema-web:latest`.
- Provides an automated deployment hook to pull the new image onto production VMs via SSH.

### Screenshot Placeholder: GHCR Package Published
```
[Insert Screenshot: GitHub Packages UI displaying the pushed crema-web container image]
```

---

## 5. Monitoring & Observability
A real-time telemetry stack was embedded directly into the application:
1. **Health Endpoint (`/api/health`):** Returns uptime, service status, and current timestamp.
2. **Prometheus Metrics (`/api/metrics`):**
   - `http_requests_total`: Request counter tagged by HTTP method, route, and status code.
   - `http_request_duration_seconds`: Latency summary.
   - `process_uptime_seconds`: Application uptime gauge.
   - `nodejs_heap_used_bytes` / `nodejs_heap_total_bytes`: Memory consumption metrics.
3. **Grafana Dashboards:** Auto-provisioned dashboard displaying app health, request volume, latency curves, and heap allocation.

### Screenshot Placeholder: Grafana Dashboard
```
[Insert Screenshot: Grafana dashboard at localhost:3001 showing metrics graphs during application usage]
```

---

## 6. Team Contributions Matrix

| Member Name | Role / Focus Area | Key Contributions |
|-------------|-------------------|-------------------|
| *Team Member 1* | *Full-Stack / Next.js* | *State management, cart/checkout flows, UI styling* |
| *Team Member 2* | *DevOps & CI/CD* | *GitHub Actions pipelines, Docker multi-stage build* |
| *Team Member 3* | *QA & Testing* | *Vitest suites, calculation test cases, edge cases* |
| *Team Member 4* | *Observability & Deployment*| *Prometheus scraping, Grafana provisioning, VM rollout* |
