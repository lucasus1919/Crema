'use client';

import React, { useState } from 'react';
import { Clock, Coffee, Sparkles } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { CustomerOrderCard } from '@/components/customer/CustomerOrderCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function CustomerOrdersPage() {
  const { orders, loadingOrders } = useOrders();
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const displayList = tab === 'active' ? activeOrders : pastOrders;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#F5E6D3',
            fontFamily: 'var(--font-heading)',
          }}
        >
          My Orders & Brew Status
        </h1>
        <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
          Track real-time extraction, barista brewing status, and past pickups
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setTab('active')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: tab === 'active' ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
            background: tab === 'active' ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
            color: tab === 'active' ? '#D4A574' : '#F5E6D3',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Coffee size={16} />
          Active Brews ({activeOrders.length})
        </button>
        <button
          onClick={() => setTab('history')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: tab === 'history' ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
            background: tab === 'history' ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
            color: tab === 'history' ? '#D4A574' : '#F5E6D3',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={16} />
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {loadingOrders ? (
        <Spinner size={36} />
      ) : displayList.length === 0 ? (
        <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
          <Coffee size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontWeight: 600, fontSize: '1rem' }}>No {tab} orders found</p>
          <span style={{ fontSize: '0.85rem' }}>
            {tab === 'active'
              ? 'When you order a beverage, you can follow its live status here!'
              : 'Your previous receipts will appear here.'}
          </span>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {displayList.map((order) => (
            <CustomerOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
