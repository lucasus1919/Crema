import { describe, it, expect } from 'vitest';
import { calculateDiscount, calculateTotal } from '@/lib/calculations';
import type { Coupon } from '@/types';

describe('Discount Calculations', () => {
  it('returns 0 if coupon is null', () => {
    expect(calculateDiscount(200, null)).toBe(0);
  });

  it('returns 0 if subtotal is zero or negative', () => {
    const coupon: Coupon = {
      code: 'OFF10',
      discountType: 'percent',
      discountValue: 10,
      active: true,
    };
    expect(calculateDiscount(0, coupon)).toBe(0);
    expect(calculateDiscount(-50, coupon)).toBe(0);
  });

  it('returns 0 if coupon is inactive', () => {
    const coupon: Coupon = {
      code: 'INACTIVE',
      discountType: 'percent',
      discountValue: 20,
      active: false,
    };
    expect(calculateDiscount(150, coupon)).toBe(0);
  });

  it('calculates percentage discounts correctly', () => {
    const coupon: Coupon = {
      code: 'SAVE15',
      discountType: 'percent',
      discountValue: 15,
      active: true,
    };
    expect(calculateDiscount(200, coupon)).toBe(30);
    expect(calculateDiscount(150, coupon)).toBe(22.5);
  });

  it('calculates flat discounts correctly', () => {
    const coupon: Coupon = {
      code: 'FLAT50',
      discountType: 'flat',
      discountValue: 50,
      active: true,
    };
    expect(calculateDiscount(120, coupon)).toBe(50);
  });

  it('caps flat discount to subtotal to prevent negative totals', () => {
    const coupon: Coupon = {
      code: 'BIGFLAT',
      discountType: 'flat',
      discountValue: 200,
      active: true,
    };
    expect(calculateDiscount(80, coupon)).toBe(80);
    expect(calculateTotal(80, calculateDiscount(80, coupon))).toBe(0);
  });

  it('calculates final total correctly', () => {
    expect(calculateTotal(250, 50)).toBe(200);
    expect(calculateTotal(100, 150)).toBe(0);
    expect(calculateTotal(99.99, 10)).toBe(89.99);
  });
});
