'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Coffee,
  Package,
  BarChart3,
  Users,
  Ticket,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders/new', label: 'New Order', icon: PlusCircle },
  { href: '/admin/menu', label: 'Menu Catalog', icon: Coffee },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/reports', label: 'Analytics & Reports', icon: BarChart3 },
  { href: '/admin/users', label: 'Team & Users', icon: Users },
  { href: '/admin/coupons', label: 'Coupons & Promos', icon: Ticket },
];

export function Sidebar() {
  const pathname = usePathname();
  const { appUser, signOut } = useAuth();

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#24140E',
        borderRight: '1px solid rgba(78, 52, 46, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(78, 52, 46, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4A574 0%, #5C4033 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(212, 165, 116, 0.25)',
          }}
        >
          <Coffee size={22} color="#1A1210" />
        </div>
        <div>
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#F5E6D3',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading)',
            }}
          >
            CREMA
          </h2>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#D4A574',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            Admin Terminal
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#1A1210' : '#F5E6D3',
                background: isActive
                  ? 'linear-gradient(135deg, #D4A574 0%, #C08A56 100%)'
                  : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} color={isActive ? '#1A1210' : '#D4A574'} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} color="#1A1210" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(78, 52, 46, 0.5)',
          backgroundColor: '#1E100A',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#F5E6D3',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {appUser?.name || 'Administrator'}
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(245, 230, 211, 0.5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {appUser?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(239, 83, 80, 0.12)',
            border: '1px solid rgba(239, 83, 80, 0.3)',
            color: '#EF5350',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
