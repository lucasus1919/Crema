'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { InventoryItem } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  lowStockItems: InventoryItem[];
  loadInventory: () => Promise<void>;
  updateStock: (item: InventoryItem, newStock: number) => Promise<void>;
  restockItem: (item: InventoryItem, addedAmount: number) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { appUser } = useAuth();

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fbService.getInventoryItems();
      setItems(data);
    } catch {
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      loadInventory();
    } else {
      setLoading(false);
    }
  }, [appUser?.role, loadInventory]);

  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.currentStock <= item.minStock);
  }, [items]);

  const updateStock = async (item: InventoryItem, newStock: number) => {
    try {
      const updated: InventoryItem = {
        ...item,
        currentStock: Math.max(0, newStock),
      };
      await fbService.updateInventoryItem(updated);
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      showToast(`Updated stock for ${item.name}`, 'success');
    } catch {
      showToast('Failed to update stock', 'error');
    }
  };

  const restockItem = async (item: InventoryItem, addedAmount: number) => {
    try {
      const updated: InventoryItem = {
        ...item,
        currentStock: item.currentStock + addedAmount,
        lastRestocked: new Date().toISOString(),
      };
      await fbService.updateInventoryItem(updated);
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      showToast(`Restocked ${item.name} (+${addedAmount} ${item.unit})`, 'success');
    } catch {
      showToast('Failed to restock item', 'error');
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        lowStockItems,
        loadInventory,
        updateStock,
        restockItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
}
