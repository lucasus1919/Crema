# Crema Web — Testing Documentation

## 1. Test Strategy Overview
Crema Web adopts a multi-tiered testing strategy designed to validate core business calculations and critical user interface elements without requiring active database connections or mocking distributed Firebase services.

```
       / \
      /   \
     /     \
    / Comp  \     3 Component Tests (Badge, Button, Spinner)
   /  Tests  \
  /-----------\
 /    Unit     \   4 Unit Suites (Cart, Discount, Order, Coupon)
/     Tests     \  36 automated assertions
-----------------
```

---

## 2. Test Suites & Coverage

### 2.1 Unit Tests (`src/lib/calculations.ts`)
The core calculation routines are isolated into pure, deterministic functions:
- **`tests/unit/discount.test.ts`**:
  - Null/undefined coupon handling (zero discount).
  - Inactive coupon validation.
  - Percentage discount math with floating point precision check.
  - Flat discount application and subtotal cap prevention.
  - Final total calculation with zero-floor clamp.
- **`tests/unit/cart.test.ts`**:
  - Subtotal summation across varied item quantities and prices.
  - Empty cart handling.
  - Adding new items to cart.
  - Updating existing item quantity without item duplication.
  - Item removal and quantity-zero auto-pruning.
- **`tests/unit/orderValidation.test.ts`**:
  - Empty cart rejection with explicit human-readable error messages.
  - Unit price and quantity boundary checks.
  - Order number generation format validation (`ORD-XXXXXX`).
- **`tests/unit/couponValidation.test.ts`**:
  - Coupon active flag verification.
  - Expiration date comparison against reference timestamps.
  - Maximum usage count thresholds (`usedCount >= maxUses`).

### 2.2 Component Tests
Using `@testing-library/react` and `jsdom`:
- **`tests/components/Badge.test.tsx`**: Tests children rendering, all variant styles (gold, success, warning, danger, muted), and animated pulse dot.
- **`tests/components/Button.test.tsx`**: Tests button labels, click callback invocation, disabled state prevention, and loading spinner state.
- **`tests/components/Spinner.test.tsx`**: Tests standalone rendering, SVG dimensions, and custom color props.

---

## 3. Running Tests Locally

### Run All Tests Once (CI Mode)
```bash
npm run test
```

### Run Tests in Watch Mode (Dev Mode)
```bash
npx vitest
```

### Run Tests with Coverage Report
```bash
npx vitest run --coverage
```

---

## 4. Continuous Integration (CI)
Automated testing is integrated directly into `.github/workflows/ci.yml`. On every push or pull request to the `main` branch, the workflow:
1. Installs clean dependencies via `npm ci`
2. Executes `npm run lint` for ESLint rules
3. Executes `npm run test` for all Vitest suites
4. Executes `npm run build` to guarantee compilation and type-safety
