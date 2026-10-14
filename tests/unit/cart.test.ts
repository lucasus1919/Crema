import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '@/lib/calculations';
import type { OrderItem, MenuItem } from '@/types';

describe('Cart Business Logic', () => {
  const sampleItems: OrderItem[] = [
    { menuItemId: 'item-1', name: 'Espresso', unitPrice: 120, quantity: 2 },
    { menuItemId: 'item-2', name: 'Cappuccino', unitPrice: 180, quantity: 1 },
  ];

  it('calculates subtotal correctly for multiple items', () => {
    // 120*2 + 180*1 = 420
    expect(calculateSubtotal(sampleItems)).toBe(420);
  });

  it('calculates subtotal as 0 for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('adds a new item to cart', () => {
    const menuItem: MenuItem = {
      id: 'item-3',
      name: 'Cold Brew',
      price: 200,
      category: 'Cold',
      iconName: 'coffee',
      isAvailable: true,
    };

    const updated = addItemToCart(sampleItems, menuItem, 1);
    expect(updated).toHaveLength(3);
    expect(updated[2].menuItemId).toBe('item-3');
    expect(updated[2].quantity).toBe(1);
    expect(updated[2].unitPrice).toBe(200);
    expect(calculateSubtotal(updated)).toBe(620);
  });

  it('increments quantity when adding existing item', () => {
    const menuItem: MenuItem = {
      id: 'item-1',
      name: 'Espresso',
      price: 120,
      category: 'Hot',
      iconName: 'coffee',
      isAvailable: true,
    };

    const updated = addItemToCart(sampleItems, menuItem, 3);
    expect(updated).toHaveLength(2);
    expect(updated[0].quantity).toBe(5); // 2 + 3
    expect(updated[0].subtotal).toBe(600);
  });

  it('removes item from cart by menuItemId', () => {
    const updated = removeItemFromCart(sampleItems, 'item-1');
    expect(updated).toHaveLength(1);
    expect(updated[0].menuItemId).toBe('item-2');
    expect(calculateSubtotal(updated)).toBe(180);
  });

  it('updates item quantity directly', () => {
    const updated = updateCartItemQuantity(sampleItems, 'item-2', 4);
    expect(updated[1].quantity).toBe(4);
    expect(calculateSubtotal(updated)).toBe(960); // 120*2 + 180*4
  });

  it('removes item if updated quantity is 0 or negative', () => {
    const zeroed = updateCartItemQuantity(sampleItems, 'item-2', 0);
    expect(zeroed).toHaveLength(1);
    expect(zeroed[0].menuItemId).toBe('item-1');

    const negative = updateCartItemQuantity(sampleItems, 'item-1', -1);
    expect(negative).toHaveLength(1);
    expect(negative[0].menuItemId).toBe('item-2');
  });
});
