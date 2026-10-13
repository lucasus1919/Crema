'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Order, OrderItem, Coupon, MenuItem } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface OrderContextType {
  orders: Order[];
  loadingOrders: boolean;
  cart: OrderItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  checkout: (paymentMethod: string) => Promise<string>;
  updateBrewStatus: (orderId: string, brewStatus: Order['brewStatus']) => Promise<void>;
  activeOrders: Order[];
  completedOrders: Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const { appUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!appUser) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    const userId = appUser.role === 'customer' ? appUser.id : undefined;
    setLoadingOrders(true);

    const unsubscribe = fbService.streamOrders((liveOrders) => {
      setOrders(liveOrders);
      setLoadingOrders(false);
    }, userId);

    return () => unsubscribe();
  }, [appUser?.role, appUser?.id, appUser]);

  const addToCart = useCallback((menuItem: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity,
          unitPrice: menuItem.price,
          subtotal: menuItem.price * quantity,
        },
      ];
    });
    showToast(`Added ${menuItem.name} to cart`, 'info');
  }, [showToast]);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const coupon = await fbService.getCouponByCode(code.trim().toUpperCase());
      if (!coupon) {
        showToast('Invalid coupon code', 'error');
        return false;
      }
      if (!coupon.active) {
        showToast('This coupon is no longer active', 'error');
        return false;
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        showToast('This coupon has expired', 'error');
        return false;
      }
      if (coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses) {
        showToast('This coupon has reached its maximum uses', 'error');
        return false;
      }

      setAppliedCoupon(coupon);
      showToast(`Coupon "${coupon.code}" applied!`, 'success');
      return true;
    } catch {
      showToast('Error validating coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percent') {
      return (subtotal * appliedCoupon.discountValue) / 100;
    }
    return Math.min(subtotal, appliedCoupon.discountValue);
  }, [subtotal, appliedCoupon]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const checkout = async (paymentMethod = 'cash'): Promise<string> => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const coffeeItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

      const orderData: Omit<Order, 'id'> = {
        userId: appUser?.id,
        orderNumber,
        items: cart,
        totalAmount: total,
        discountAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        status: 'pending',
        brewStatus: 'received',
        isFreeRedemption: false,
        createdAt: new Date().toISOString(),
      };

      const orderId = await fbService.placeOrderTransaction({
        order: orderData,
        userId: appUser?.id,
        coffeeItemCount,
        coffeeBeansGrams: coffeeItemCount * 18,
        milkMl: coffeeItemCount * 150,
      });

      if (appliedCoupon?.id) {
        await fbService.applyCoupon(appliedCoupon.id);
      }

      clearCart();
      showToast(`Order #${orderNumber} placed!`, 'success');
      return orderId;
    } catch (err: unknown) {
      console.error('CHECKOUT EXCEPTION:', err);
      const message = err instanceof Error ? err.message : 'Failed to place order';
      showToast(message, 'error');
      throw err;
    }
  };

  const updateBrewStatus = async (orderId: string, brewStatus: Order['brewStatus']) => {
    try {
      await fbService.updateBrewStatus(orderId, brewStatus);
      showToast(`Status updated to ${brewStatus}`, 'info');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'completed');
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingOrders,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
        checkout,
        updateBrewStatus,
        activeOrders,
        completedOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
}
