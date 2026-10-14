// ─── Core Types (ported from Dart models) ───────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  iconName: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface Order {
  id?: string;
  userId?: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'cancelled';
  brewStatus: 'received' | 'brewing' | 'ready';
  isFreeRedemption: boolean;
  createdAt: string; // ISO string
}

export interface AppUser {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  loyaltyPoints: number;
  freeItemReady: boolean;
  orderFrequency: Record<string, { count: number; lastOrderedAt: string }>;
}

export interface InventoryItem {
  id?: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  lastRestocked?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  maxUses?: number;
  usedCount?: number;
  expiresAt?: string;
  active: boolean;
  isGenerated?: boolean;
}

export interface StoreMenu {
  id: string;
  name: string;
}

export interface ErrorLog {
  id: string;
  orderId: string;
  errorType: string;
  timestamp: string;
  resolved: boolean;
}

// ─── Report Types ─────────────────────────────────────────────────────────────

export interface TopItem {
  name: string;
  totalQty: number;
  totalRevenue: number;
}

export interface DailyRevenue {
  day: string;
  revenue: number;
  orderCount: number;
}

export interface CategoryBreakdown {
  category: string;
  totalQty: number;
  totalRevenue: number;
}

export interface PeakHourData {
  hour: number;
  count: number;
}
