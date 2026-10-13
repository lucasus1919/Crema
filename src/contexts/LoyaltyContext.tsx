'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import * as fbService from '@/lib/firebaseService';
import type { MenuItem, Order } from '@/types';

interface LoyaltyContextType {
  points: number;
  freeItemReady: boolean;
  redeemFreeItem: (item: MenuItem) => Promise<string>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: React.ReactNode }) {
  const { appUser, refreshAppUser } = useAuth();
  const { showToast } = useToast();

  const points = appUser?.loyaltyPoints ?? 0;
  const freeItemReady = Boolean(appUser?.freeItemReady || points >= 10);

  const redeemFreeItem = async (item: MenuItem): Promise<string> => {
    if (!appUser?.id) throw new Error('Must be logged in to redeem');
    if (points < 10) throw new Error('Not enough points to redeem (10 points required)');

    try {
      const orderNumber = `REW-${Date.now().toString().slice(-6)}`;
      const rewardOrder: Omit<Order, 'id'> = {
        userId: appUser.id,
        orderNumber,
        items: [
          {
            menuItemId: item.id,
            name: item.name,
            quantity: 1,
            unitPrice: 0,
            subtotal: 0,
          },
        ],
        totalAmount: 0,
        discountAmount: item.price,
        couponCode: 'LOYALTY_REDEEM',
        paymentMethod: 'loyalty_points',
        status: 'pending',
        brewStatus: 'received',
        isFreeRedemption: true,
        createdAt: new Date().toISOString(),
      };

      const orderId = await fbService.redeemFreeItem(appUser.id, rewardOrder, 10);
      await refreshAppUser();
      showToast(`Redeemed free ${item.name}! Order #${orderNumber}`, 'success');
      return orderId;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to redeem reward';
      showToast(msg, 'error');
      throw err;
    }
  };

  return (
    <LoyaltyContext.Provider value={{ points, freeItemReady, redeemFreeItem }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error('useLoyalty must be used within a LoyaltyProvider');
  return context;
}
