'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem, StoreMenu } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  storeMenus: StoreMenu[];
  selectedStoreId: string | null;
  setSelectedStoreId: (storeId: string | null) => void;
  loadItems: () => Promise<void>;
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<string>;
  updateItem: (item: MenuItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleAvailability: (item: MenuItem) => Promise<void>;
  createStore: (name: string) => Promise<string>;
  deleteStore: (storeId: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: '1WxAmiRhIQHq4ScHPsVS', name: 'Chocolate Muffin', category: 'Snacks', price: 80, iconName: 'chocolate_muffin.png', isAvailable: true },
  { id: 'DZhnCqD8oJql3YtECmHJ', name: 'Americano', category: 'Espresso', price: 100, iconName: 'americano.png', isAvailable: true },
  { id: 'DcdXTUwAB3SyjoIZYMHy', name: 'Espresso', category: 'Espresso', price: 80, iconName: 'espresso.png', isAvailable: true },
  { id: 'Ha8UsrkmeTiwJCg4qA7k', name: 'Cold Brew', category: 'Cold', price: 180, iconName: 'cold_brew.png', isAvailable: true },
  { id: 'Sk35IBXEv0c2WUb0aRRS', name: 'Cappuccino', category: 'Latte', price: 150, iconName: 'cappuccino.png', isAvailable: true },
  { id: 'WV8M7gvHd346VcoJz7t1', name: 'Croissant', category: 'Snacks', price: 90, iconName: 'croissant.png', isAvailable: true },
  { id: 'lm87JYst5IwySwNQ3cvo', name: 'Caramel Macchiato', category: 'Latte', price: 180, iconName: 'caramel_macchiato.png', isAvailable: true },
  { id: 'nWQsIQ3BXhS8EqBS7Rcs', name: 'Caffe Latte', category: 'Latte', price: 160, iconName: 'caffe_latte.png', isAvailable: true },
  { id: 'tw0sW6cgppiP4yKxJmQ0', name: 'Double Espresso', category: 'Espresso', price: 120, iconName: 'double_espresso.png', isAvailable: true },
  { id: 'ydp1VTHteKhwprIVB89b', name: 'Iced Mocha', category: 'Cold', price: 200, iconName: 'iced_mocha.png', isAvailable: true },
];

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [storeMenus, setStoreMenus] = useState<StoreMenu[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const loadItems = useCallback(async () => {
    try {
      if (selectedStoreId) {
        setLoading(true);
        const fetched = await fbService.getStoreMenuItems(selectedStoreId);
        if (fetched.length > 0) {
          setItems(fetched);
        }
      } else {
        const fetched = await fbService.getMenuItems();
        if (fetched.length > 0) {
          setItems(fetched);
        }
      }
    } catch (err: unknown) {
      console.warn('Menu load error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadStores = useCallback(async () => {
    try {
      const stores = await fbService.getStoreMenus();
      setStoreMenus(stores);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadStores();
    }
  }, [user, loadStores]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (selectedStoreId) {
      loadItems();
      return;
    }

    const unsubscribe = fbService.streamMenuItems(
      (liveItems) => {
        if (liveItems && liveItems.length > 0) {
          setItems(liveItems);
        }
        setLoading(false);
      },
      async (err) => {
        console.warn('Snapshot listener fallback:', err.message);
        try {
          const fallback = await fbService.getMenuItems();
          if (fallback && fallback.length > 0) {
            setItems(fallback);
          }
        } catch {
          // Keep DEFAULT_MENU_ITEMS
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [user, selectedStoreId, loadItems]);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const addItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
    try {
      let id = '';
      if (selectedStoreId) {
        id = await fbService.insertStoreMenuItem(selectedStoreId, item);
      } else {
        id = await fbService.insertMenuItem(item);
      }
      showToast(`Added "${item.name}"`, 'success');
      await loadItems();
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error adding item';
      showToast(message, 'error');
      throw err;
    }
  };

  const updateItem = async (item: MenuItem): Promise<void> => {
    try {
      if (selectedStoreId) {
        await fbService.updateStoreMenuItem(selectedStoreId, item);
      } else {
        await fbService.updateMenuItem(item);
      }
      showToast(`Updated "${item.name}"`, 'success');
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating item';
      showToast(message, 'error');
      throw err;
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      if (selectedStoreId) {
        await fbService.deleteStoreMenuItem(selectedStoreId, id);
      } else {
        await fbService.deleteMenuItem(id);
      }
      showToast('Item deleted', 'info');
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting item';
      showToast(message, 'error');
      throw err;
    }
  };

  const toggleAvailability = async (item: MenuItem): Promise<void> => {
    const updated = { ...item, isAvailable: !item.isAvailable };
    await updateItem(updated);
  };

  const createStore = async (name: string): Promise<string> => {
    try {
      const id = await fbService.createStoreMenu(name);
      showToast(`Store "${name}" created`, 'success');
      await loadStores();
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create store';
      showToast(message, 'error');
      throw err;
    }
  };

  const deleteStore = async (storeId: string): Promise<void> => {
    try {
      await fbService.deleteStoreMenu(storeId);
      if (selectedStoreId === storeId) setSelectedStoreId(null);
      showToast('Store removed', 'info');
      await loadStores();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete store';
      showToast(message, 'error');
      throw err;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        loading,
        storeMenus,
        selectedStoreId,
        setSelectedStoreId,
        loadItems,
        addItem,
        updateItem,
        deleteItem,
        toggleAvailability,
        createStore,
        deleteStore,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}
