import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  writeBatch,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  MenuItem,
  OrderItem,
  Order,
  AppUser,
  InventoryItem,
  Coupon,
  StoreMenu,
  ErrorLog,
  TopItem,
  DailyRevenue,
  CategoryBreakdown,
  PeakHourData,
} from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function orderFromDoc(docData: DocumentData, id: string): Order {
  const d = docData;
  const rawItems: OrderItem[] = (d.items as DocumentData[] | undefined)?.map((i) => ({
    id: i.id,
    orderId: i.orderId,
    menuItemId: i.menuItemId as string,
    name: i.name as string,
    quantity: Number(i.quantity),
    unitPrice: Number(i.unitPrice),
  })) ?? [];

  return {
    id,
    userId: d.userId as string | undefined,
    orderNumber: d.orderNumber as string,
    items: rawItems,
    totalAmount: Number(d.totalAmount),
    discountAmount: Number(d.discountAmount ?? 0),
    couponCode: d.couponCode as string | undefined,
    paymentMethod: d.paymentMethod as string | undefined,
    status: (d.status as Order['status']) ?? 'completed',
    brewStatus: (d.brewStatus as Order['brewStatus']) ?? 'ready',
    isFreeRedemption: Boolean(d.isFreeRedemption),
    createdAt: d.createdAt as string,
  };
}

function menuItemFromDoc(docData: DocumentData, id: string): MenuItem {
  return {
    id,
    name: docData.name as string,
    category: docData.category as string,
    price: Number(docData.price),
    iconName: (docData.iconName as string) ?? '',
    isAvailable: Boolean(docData.isAvailable ?? true),
  };
}

function inventoryFromDoc(docData: DocumentData, id: string): InventoryItem {
  return {
    id,
    name: docData.name as string,
    unit: docData.unit as string,
    currentStock: Number(docData.currentStock ?? 0),
    minStock: Number(docData.minStock ?? docData.minimumStock ?? 0),
    lastRestocked: docData.lastRestocked as string | undefined,
  };
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export async function getMenuItems(): Promise<MenuItem[]> {
  const snap = await getDocs(collection(db, 'menu_items'));
  return snap.docs.map((d) => menuItemFromDoc(d.data(), d.id));
}

export function streamMenuItems(
  callback: (items: MenuItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'menu_items'),
    (snap) => {
      callback(snap.docs.map((d) => menuItemFromDoc(d.data(), d.id)));
    },
    (err) => {
      console.warn('Menu stream warning:', err.message);
      if (onError) onError(err);
    }
  );
}

export async function insertMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'menu_items'), item);
  return ref.id;
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  const { id, ...data } = item;
  await updateDoc(doc(db, 'menu_items', id!), data);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menu_items', id));
}

// ─── Store Menus ──────────────────────────────────────────────────────────────

export async function getStoreMenus(): Promise<StoreMenu[]> {
  const snap = await getDocs(collection(db, 'store_menus'));
  return snap.docs.map((d) => ({ id: d.id, name: d.data().name as string }));
}

export async function getStoreMenuItems(storeId: string): Promise<MenuItem[]> {
  const snap = await getDocs(collection(db, 'store_menus', storeId, 'items'));
  return snap.docs.map((d) => menuItemFromDoc(d.data(), d.id));
}

export async function createStoreMenu(name: string): Promise<string> {
  const ref = await addDoc(collection(db, 'store_menus'), { name });
  return ref.id;
}

export async function insertStoreMenuItem(storeId: string, item: Omit<MenuItem, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'store_menus', storeId, 'items'), item);
  return ref.id;
}

export async function updateStoreMenuItem(storeId: string, item: MenuItem): Promise<void> {
  const { id, ...data } = item;
  await updateDoc(doc(db, 'store_menus', storeId, 'items', id!), data);
}

export async function deleteStoreMenuItem(storeId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'store_menus', storeId, 'items', itemId));
}

export async function deleteStoreMenu(storeId: string): Promise<void> {
  // Delete all items first
  const snap = await getDocs(collection(db, 'store_menus', storeId, 'items'));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'store_menus', storeId));
  await batch.commit();
}

export async function importStoreMenuItems(storeId: string, items: Omit<MenuItem, 'id'>[]): Promise<void> {
  const batch = writeBatch(db);
  items.forEach((item) => {
    const ref = doc(collection(db, 'store_menus', storeId, 'items'));
    batch.set(ref, item);
  });
  await batch.commit();
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(userId?: string): Promise<Order[]> {
  const col = collection(db, 'orders');
  const q = userId
    ? query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    : query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => orderFromDoc(d.data(), d.id));
}

export function streamOrders(
  callback: (orders: Order[]) => void,
  userId?: string
): () => void {
  const col = collection(db, 'orders');
  const q = userId
    ? query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    : query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => orderFromDoc(d.data(), d.id)));
    },
    () => {
      // gracefully handles offline/reconnection events
    }
  );
}

export async function placeOrderTransaction(params: {
  order: Omit<Order, 'id'>;
  userId?: string;
  coffeeItemCount: number;
  coffeeBeansGrams: number;
  milkMl: number;
}): Promise<string> {
  const { order, userId, coffeeItemCount, coffeeBeansGrams, milkMl } = params;

  // Pre-query inventory document references outside the transaction
  const itemsToDeduct = [
    { name: 'Coffee Beans', amount: coffeeBeansGrams / 1000 },
    ...(milkMl > 0 ? [{ name: 'Milk', amount: milkMl / 1000 }] : []),
    { name: 'Cups (Small)', amount: 1.0 },
  ];

  const inventoryRefs = await Promise.all(
    itemsToDeduct.map(async (item) => {
      try {
        const snap = await getDocs(
          query(collection(db, 'inventory'), where('name', '==', item.name), limit(1))
        );
        return {
          amount: item.amount,
          ref: snap.empty ? null : snap.docs[0].ref,
        };
      } catch {
        return { amount: item.amount, ref: null };
      }
    })
  );

  let docId = '';
  await runTransaction(db, async (tx) => {
    // -------------------------------------------------------------
    // PHASE 1: ALL TRANSACTIONAL READS FIRST
    // -------------------------------------------------------------
    const userRef = userId && coffeeItemCount > 0 ? doc(db, 'users', userId) : null;
    const userSnap = userRef ? await tx.get(userRef) : null;

    const inventoryReads: { ref: DocumentReference; updatedStock: number }[] = [];
    for (const inv of inventoryRefs) {
      if (inv.ref) {
        const snap = await tx.get(inv.ref);
        if (snap.exists()) {
          const current = Number(snap.data().currentStock ?? 0);
          if (current < inv.amount) {
            throw new Error(`Insufficient stock for ingredient ${inv.ref.id}: requires ${inv.amount}, only ${current} available`);
          }
          const updated = current - inv.amount;
          inventoryReads.push({ ref: inv.ref, updatedStock: updated });
        }
      }
    }

    // -------------------------------------------------------------
    // PHASE 2: ALL TRANSACTIONAL WRITES AFTER ALL READS
    // -------------------------------------------------------------
    for (const inv of inventoryReads) {
      tx.update(inv.ref, { currentStock: inv.updatedStock });
    }

    if (userRef && userSnap && userSnap.exists()) {
      const current = Number(userSnap.data().loyaltyPoints ?? 0);
      const newPoints = current + coffeeItemCount;
      const freeItemReady = newPoints >= 10;
      tx.update(userRef, { loyaltyPoints: newPoints, freeItemReady });
    }

    const orderRef = doc(collection(db, 'orders'));
    docId = orderRef.id;

    const cleanOrderData: Record<string, unknown> = {
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      discountAmount: Number(order.discountAmount ?? 0),
      status: order.status ?? 'pending',
      brewStatus: order.brewStatus ?? 'received',
      paymentMethod: order.paymentMethod ?? 'cash',
      isFreeRedemption: Boolean(order.isFreeRedemption),
      createdAt: order.createdAt ?? new Date().toISOString(),
      items: order.items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
      id: docId,
    };

    if (order.userId) cleanOrderData.userId = order.userId;
    if (order.couponCode) cleanOrderData.couponCode = order.couponCode;

    tx.set(orderRef, cleanOrderData);
  });

  return docId;
}

export async function updateBrewStatus(orderId: string, brewStatus: string): Promise<void> {
  const updates: Record<string, string> = { brewStatus };
  if (brewStatus === 'ready') updates.status = 'completed';
  await updateDoc(doc(db, 'orders', orderId), updates);
}

export async function getMostOrderedItem(userId: string): Promise<Record<string, unknown> | null> {
  const userSnap = await getDoc(doc(db, 'users', userId));
  if (!userSnap.exists()) return null;
  const freq = userSnap.data().orderFrequency as Record<string, { count: number; lastOrderedAt: string }>;
  if (!freq || Object.keys(freq).length === 0) return null;
  const sorted = Object.entries(freq).sort((a, b) => b[1].count - a[1].count);
  return { menuItemId: sorted[0][0], ...sorted[0][1] };
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const snap = await getDocs(collection(db, 'inventory'));
  return snap.docs.map((d) => inventoryFromDoc(d.data(), d.id));
}

export async function updateInventoryItem(item: InventoryItem): Promise<void> {
  const { id, ...data } = item;
  await updateDoc(doc(db, 'inventory', id!), data);
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getAllCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, 'coupons'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon));
}

export async function generateCoupon(coupon: Omit<Coupon, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'coupons'), coupon);
  return ref.id;
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', id));
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const snap = await getDocs(query(collection(db, 'coupons'), where('code', '==', code)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Coupon;
}

export async function applyCoupon(couponId: string): Promise<void> {
  const ref = doc(db, 'coupons', couponId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const used = Number(snap.data().usedCount ?? 0);
  await updateDoc(ref, { usedCount: used + 1 });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function streamUsers(callback: (users: AppUser[]) => void): () => void {
  return onSnapshot(
    collection(db, 'users'),
    (snap) => {
      callback(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name as string,
            email: data.email as string,
            role: (data.role as AppUser['role']) ?? 'customer',
            loyaltyPoints: Number(data.loyaltyPoints ?? 0),
            freeItemReady: Boolean(data.freeItemReady),
            orderFrequency: (data.orderFrequency as AppUser['orderFrequency']) ?? {},
          };
        })
      );
    },
    () => {
      // gracefully handles offline/reconnection events
    }
  );
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { role });
}

export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export async function redeemFreeItem(
  userId: string,
  rewardOrder: Omit<Order, 'id'>,
  pointsToRedeem = 10
): Promise<string> {
  let docId = '';
  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error('User not found');
    const current = Number(userSnap.data().loyaltyPoints ?? 0);
    const newPoints = Math.max(0, current - pointsToRedeem);
    tx.update(userRef, { loyaltyPoints: newPoints, freeItemReady: newPoints >= 10 });

    const orderRef = doc(collection(db, 'orders'));
    docId = orderRef.id;
    tx.set(orderRef, {
      ...rewardOrder,
      id: docId,
      isFreeRedemption: true,
    });
  });
  return docId;
}

// ─── Error Logging ────────────────────────────────────────────────────────────

export async function logError(orderId: string, errorType: string): Promise<void> {
  try {
    await addDoc(collection(db, 'errors'), {
      orderId,
      errorType,
      timestamp: new Date().toISOString(),
      resolved: false,
    });
  } catch (_) {
    // best-effort
  }
}

export function streamUnresolvedErrors(callback: (errors: ErrorLog[]) => void): () => void {
  return onSnapshot(
    query(collection(db, 'errors'), where('resolved', '==', false)),
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          orderId: d.data().orderId as string,
          errorType: d.data().errorType as string,
          timestamp: d.data().timestamp as string,
          resolved: false,
        }))
      );
    },
    () => {
      // gracefully handles offline/reconnection events
    }
  );
}

export async function resolveError(errorId: string): Promise<void> {
  await updateDoc(doc(db, 'errors', errorId), { resolved: true });
}

export async function resolveAllErrors(errorIds: string[]): Promise<void> {
  if (errorIds.length === 0) return;
  const BATCH_SIZE = 500;
  for (let i = 0; i < errorIds.length; i += BATCH_SIZE) {
    const chunk = errorIds.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((id) => batch.update(doc(db, 'errors', id), { resolved: true }));
    await batch.commit();
  }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getRevenueForDateRange(start: Date, end: Date): Promise<number> {
  const snap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'completed')));
  return snap.docs.reduce((total, d) => {
    const createdAt = new Date(d.data().createdAt as string);
    if (createdAt >= start && createdAt < end) {
      return total + Number(d.data().totalAmount ?? 0);
    }
    return total;
  }, 0);
}

export async function getOrderCountForDateRange(start: Date, end: Date): Promise<number> {
  const snap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'completed')));
  return snap.docs.filter((d) => {
    const createdAt = new Date(d.data().createdAt as string);
    return createdAt >= start && createdAt < end;
  }).length;
}

export async function getTopSellingItems(limitCount = 5): Promise<TopItem[]> {
  const snap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'completed')));
  const stats: Record<string, TopItem> = {};
  snap.docs.forEach((d) => {
    const items = (d.data().items as DocumentData[] | undefined) ?? [];
    items.forEach((i) => {
      const name = i.name as string;
      const qty = Number(i.quantity);
      const unitPrice = Number(i.unitPrice);
      if (!stats[name]) stats[name] = { name, totalQty: 0, totalRevenue: 0 };
      stats[name].totalQty += qty;
      stats[name].totalRevenue += qty * unitPrice;
    });
  });
  return Object.values(stats)
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, limitCount);
}

export async function getDailyRevenue(days: number): Promise<DailyRevenue[]> {
  const start = new Date();
  start.setDate(start.getDate() - days);
  const snap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'completed')));
  const stats: Record<string, DailyRevenue> = {};
  snap.docs.forEach((d) => {
    const dateStr = d.data().createdAt as string;
    const date = new Date(dateStr);
    if (date < start) return;
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!stats[dayKey]) stats[dayKey] = { day: dayKey, revenue: 0, orderCount: 0 };
    stats[dayKey].revenue += Number(d.data().totalAmount ?? 0);
    stats[dayKey].orderCount += 1;
  });
  return Object.values(stats).sort((a, b) => a.day.localeCompare(b.day));
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  const [ordersSnap, menuSnap] = await Promise.all([
    getDocs(query(collection(db, 'orders'), where('status', '==', 'completed'))),
    getDocs(collection(db, 'menu_items')),
  ]);
  const itemToCategory: Record<string, string> = {};
  menuSnap.docs.forEach((d) => { itemToCategory[d.id] = d.data().category as string; });
  const stats: Record<string, CategoryBreakdown> = {};
  ordersSnap.docs.forEach((d) => {
    const items = (d.data().items as DocumentData[] | undefined) ?? [];
    items.forEach((i) => {
      const menuItemId = i.menuItemId as string;
      const qty = Number(i.quantity);
      const unitPrice = Number(i.unitPrice);
      const category = itemToCategory[menuItemId] ?? 'Unknown';
      if (!stats[category]) stats[category] = { category, totalQty: 0, totalRevenue: 0 };
      stats[category].totalQty += qty;
      stats[category].totalRevenue += qty * unitPrice;
    });
  });
  return Object.values(stats).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

export async function getPeakHourData(): Promise<PeakHourData[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const snap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'completed')));
  const hourCounts: Record<number, number> = {};
  snap.docs.forEach((d) => {
    const dateStr = d.data().createdAt as string;
    const date = new Date(dateStr);
    if (date < cutoff) return;
    hourCounts[date.getHours()] = (hourCounts[date.getHours()] ?? 0) + 1;
  });
  return Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hourCounts[h] ?? 0 }));
}
