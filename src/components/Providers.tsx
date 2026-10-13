'use client';

import React from 'react';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { InventoryProvider } from '@/contexts/InventoryContext';
import { LoyaltyProvider } from '@/contexts/LoyaltyContext';
import { ReportProvider } from '@/contexts/ReportContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <MenuProvider>
          <OrderProvider>
            <InventoryProvider>
              <LoyaltyProvider>
                <ReportProvider>
                  {children}
                </ReportProvider>
              </LoyaltyProvider>
            </InventoryProvider>
          </OrderProvider>
        </MenuProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
