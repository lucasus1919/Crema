import type { OrderItem, MenuItem, Coupon } from '@/types';

/**
 * Calculates subtotal across all items in cart.
 */
export function calculateSubtotal(items: OrderItem[]): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
}

/**
 * Calculates discount amount based on subtotal and coupon rules.
 */
export function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || subtotal <= 0) return 0;
  if (!coupon.active) return 0;
  if (coupon.discountValue <= 0) return 0;

  if (coupon.discountType === 'percent') {
    const calculated = (subtotal * coupon.discountValue) / 100;
    return Math.min(subtotal, Math.round(calculated * 100) / 100);
  }

  // Flat discount
  return Math.min(subtotal, coupon.discountValue);
}

/**
 * Calculates final total after applying discount. Never negative.
 */
export function calculateTotal(subtotal: number, discountAmount: number): number {
  return Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
}

/**
 * Validates a cart before checkout.
 */
export function validateOrder(cart: OrderItem[]): { valid: boolean; error?: string } {
  if (!cart || cart.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  for (const item of cart) {
    if (!item.menuItemId || !item.name) {
      return { valid: false, error: 'Cart contains an invalid item' };
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return { valid: false, error: `Invalid quantity for ${item.name}` };
    }
    if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
      return { valid: false, error: `Invalid price for ${item.name}` };
    }
  }

  return { valid: true };
}

/**
 * Validates whether a coupon can be applied.
 */
export function validateCoupon(
  coupon: Coupon | null,
  referenceDate: Date = new Date()
): { valid: boolean; error?: string } {
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (!coupon.active) {
    return { valid: false, error: 'This coupon is no longer active' };
  }

  if (coupon.expiresAt) {
    const expiry = new Date(coupon.expiresAt);
    if (!isNaN(expiry.getTime()) && expiry < referenceDate) {
      return { valid: false, error: 'This coupon has expired' };
    }
  }

  if (typeof coupon.maxUses === 'number' && typeof coupon.usedCount === 'number') {
    if (coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: 'This coupon has reached its maximum uses' };
    }
  }

  return { valid: true };
}

/**
 * Formats order number consistently.
 */
export function generateOrderNumber(timestamp: number = Date.now()): string {
  const suffix = timestamp.toString().slice(-6);
  return `ORD-${suffix}`;
}

/**
 * Cart immutability helpers.
 */
export function addItemToCart(
  cart: OrderItem[],
  menuItem: MenuItem,
  quantity = 1
): OrderItem[] {
  if (quantity <= 0) return cart;
  const existing = cart.find((i) => i.menuItemId === menuItem.id);
  if (existing) {
    return cart.map((i) =>
      i.menuItemId === menuItem.id
        ? {
            ...i,
            quantity: i.quantity + quantity,
            subtotal: (i.quantity + quantity) * i.unitPrice,
          }
        : i
    );
  }

  return [
    ...cart,
    {
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      subtotal: menuItem.price * quantity,
    },
  ];
}

export function removeItemFromCart(cart: OrderItem[], menuItemId: string): OrderItem[] {
  return cart.filter((i) => i.menuItemId !== menuItemId);
}

export function updateCartItemQuantity(
  cart: OrderItem[],
  menuItemId: string,
  quantity: number
): OrderItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(cart, menuItemId);
  }
  return cart.map((i) =>
    i.menuItemId === menuItemId
      ? {
          ...i,
          quantity,
          subtotal: quantity * i.unitPrice,
        }
      : i
  );
}
