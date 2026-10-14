import { describe, it, expect } from 'vitest';
import { validateCoupon } from '@/lib/calculations';
import type { Coupon } from '@/types';

describe('Coupon Validation Logic', () => {
  const baseCoupon: Coupon = {
    id: 'c1',
    code: 'SAVE20',
    discountType: 'percent',
    discountValue: 20,
    active: true,
    maxUses: 10,
    usedCount: 2,
    expiresAt: '2026-12-31T23:59:59Z',
  };

  it('rejects null coupon', () => {
    const res = validateCoupon(null);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Invalid coupon code');
  });

  it('rejects inactive coupon', () => {
    const coupon: Coupon = { ...baseCoupon, active: false };
    const res = validateCoupon(coupon);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('This coupon is no longer active');
  });

  it('rejects expired coupon', () => {
    const coupon: Coupon = {
      ...baseCoupon,
      expiresAt: '2025-01-01T00:00:00Z',
    };
    const now = new Date('2026-06-01T00:00:00Z');
    const res = validateCoupon(coupon, now);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('This coupon has expired');
  });

  it('accepts coupon before expiration date', () => {
    const coupon: Coupon = {
      ...baseCoupon,
      expiresAt: '2026-12-31T00:00:00Z',
    };
    const now = new Date('2026-06-01T00:00:00Z');
    const res = validateCoupon(coupon, now);
    expect(res.valid).toBe(true);
  });

  it('rejects coupon when usedCount equals or exceeds maxUses', () => {
    const atMax: Coupon = { ...baseCoupon, maxUses: 5, usedCount: 5 };
    expect(validateCoupon(atMax).valid).toBe(false);
    expect(validateCoupon(atMax).error).toBe('This coupon has reached its maximum uses');

    const overMax: Coupon = { ...baseCoupon, maxUses: 5, usedCount: 6 };
    expect(validateCoupon(overMax).valid).toBe(false);
  });

  it('accepts coupon when usedCount is below maxUses', () => {
    const valid: Coupon = { ...baseCoupon, maxUses: 5, usedCount: 4 };
    expect(validateCoupon(valid).valid).toBe(true);
  });

  it('accepts coupon with no maxUses and no expiresAt', () => {
    const openCoupon: Coupon = {
      code: 'ALWAYSVALID',
      discountType: 'flat',
      discountValue: 10,
      active: true,
    };
    expect(validateCoupon(openCoupon).valid).toBe(true);
  });
});
