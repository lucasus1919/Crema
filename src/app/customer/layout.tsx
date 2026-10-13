'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, ShoppingBag, Clock, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { PaymentModal } from '@/components/customer/PaymentModal';
import { Spinner } from '@/components/ui/Spinner';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading, signOut } = useAuth();
  const { cart } = useOrders();
  const pathname = usePathname();
  const router = useRouter();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#24140E',
          borderBottom: '1px solid rgba(78, 52, 46, 0.7)',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link href="/customer/menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D4A574 0%, #5C4033 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coffee size={20} color="#1A1210" />
          </div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#F5E6D3',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)',
            }}
          >
            CREMA
          </span>
        </Link>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/customer/menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: pathname === '/customer/menu' ? '#1A1210' : '#F5E6D3',
              background: pathname === '/customer/menu' ? '#D4A574' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <Coffee size={16} />
            <span>Menu</span>
          </Link>

          <Link
            href="/customer/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: pathname === '/customer/orders' ? '#1A1210' : '#F5E6D3',
              background: pathname === '/customer/orders' ? '#D4A574' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={16} />
            <span>My Orders</span>
          </Link>

          <Link
            href="/customer/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: pathname === '/customer/profile' ? '#1A1210' : '#F5E6D3',
              background: pathname === '/customer/profile' ? '#D4A574' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={16} />
            <span>Loyalty & Profile</span>
          </Link>
        </nav>

        {/* Right Action Icons: Cart & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {appUser?.role === 'admin' && (
            <Link
              href="/admin/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#D4A574',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(212, 165, 116, 0.12)',
              }}
            >
              <Shield size={14} />
              Admin Mode
            </Link>
          )}

          <button
            onClick={() => setCartDrawerOpen(true)}
            style={{
              position: 'relative',
              background: '#3D2317',
              border: '1px solid rgba(78, 52, 46, 0.8)',
              color: '#F5E6D3',
              borderRadius: '10px',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            <ShoppingBag size={18} color="#D4A574" />
            <span>Bag</span>
            {totalCartCount > 0 && (
              <span
                style={{
                  background: '#D4A574',
                  color: '#1A1210',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => signOut()}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(245, 230, 211, 0.6)',
              cursor: 'pointer',
              padding: '6px',
            }}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Page Body */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {loading ? <Spinner size={36} /> : children}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceedToPayment={() => {
          setCartDrawerOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
}
