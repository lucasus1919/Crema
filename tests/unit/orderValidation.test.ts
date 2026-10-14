import { describe, it, expect } from 'vitest';
import { validateOrder, generateOrderNumber } from '@/lib/calculations';
import type { OrderItem } from '@/types';

describe('Order Validation & Formatting', () => {
  it('rejects an empty cart', () => {
    const res = validateOrder([]);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Cart is empty');
  });

  it('rejects null or undefined cart', () => {
    // @ts-expect-error test invalid inputs
    const res = validateOrder(null);
    expect(res.valid).toBe(false);
  });

  it('rejects items with invalid quantity', () => {
    const badCart: OrderItem[] = [
      { menuItemId: '1', name: 'Latte', unitPrice: 150, quantity: 0 },
    ];
    const res = validateOrder(badCart);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Invalid quantity');
  });

  it('rejects items with negative unit price', () => {
    const badCart: OrderItem[] = [
      { menuItemId: '1', name: 'Latte', unitPrice: -20, quantity: 1 },
    ];
    const res = validateOrder(badCart);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Invalid price');
  });

  it('accepts a valid cart', () => {
    const validCart: OrderItem[] = [
      { menuItemId: '1', name: 'Latte', unitPrice: 150, quantity: 2 },
      { menuItemId: '2', name: 'Mocha', unitPrice: 180, quantity: 1 },
    ];
    const res = validateOrder(validCart);
    expect(res.valid).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('generates order number matching ORD-XXXXXX pattern', () => {
    const orderNo = generateOrderNumber(1710000123456);
    expect(orderNo).toBe('ORD-123456');
    expect(orderNo).toMatch(/^ORD-\d{6}$/);
  });
});
