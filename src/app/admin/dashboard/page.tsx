'use client';

import React from 'react';
import Link from 'next/link';
import { IndianRupee, ShoppingBag, Coffee, TrendingUp, Plus, Clock } from 'lucide-react';
import { useReports } from '@/contexts/ReportContext';
import { useOrders } from '@/contexts/OrderContext';
import { StatCard } from '@/components/admin/StatCard';
import { ActiveOrderCard } from '@/components/admin/ActiveOrderCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminDashboardPage() {
  const { todayRevenue, todayOrders, weekRevenue, loading: loadingReports } = useReports();
  const { activeOrders, completedOrders, updateBrewStatus, loadingOrders } = useOrders();

  const activeBrewCount = activeOrders.filter((o) => o.brewStatus === 'brewing').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Live metrics, brewing queue, and POS status
          </p>
        </div>
        <Link href="/admin/orders/new">
          <Button variant="primary" size="md" icon={<Plus size={18} />}>
            Create New Order
          </Button>
        </Link>
      </div>

      {/* 4 KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toFixed(2)}`}
          subtitle="Cleared from completed orders"
          icon={<IndianRupee size={22} />}
          trend="+12% from yesterday"
          isPositive
        />
        <StatCard
          title="Today's Orders"
          value={todayOrders}
          subtitle="Transactions today"
          icon={<ShoppingBag size={22} />}
        />
        <StatCard
          title="Weekly Revenue"
          value={`₹${weekRevenue.toFixed(2)}`}
          subtitle="Past 7 days volume"
          icon={<TrendingUp size={22} />}
        />
        <StatCard
          title="Active Brewing Queue"
          value={activeOrders.length}
          subtitle={`${activeBrewCount} currently brewing`}
          icon={<Coffee size={22} />}
        />
      </div>

      {/* Active Orders Queue */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#F5E6D3',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Active Brewing Queue
            </h2>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(212, 165, 116, 0.2)',
                color: '#D4A574',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {activeOrders.length}
            </span>
          </div>
        </div>

        {loadingOrders ? (
          <Spinner />
        ) : activeOrders.length === 0 ? (
          <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
            <Coffee size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Queue is clear</p>
            <span style={{ fontSize: '0.85rem' }}>No active coffee orders waiting to be brewed right now.</span>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {activeOrders.map((order) => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onUpdateBrewStatus={updateBrewStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed Orders */}
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6D3',
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Recent Completed Orders
        </h2>

        {completedOrders.length === 0 ? (
          <Card variant="surface" padding="md" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
            <p>No completed orders yet today.</p>
          </Card>
        ) : (
          <Card variant="surface" padding="none" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(78, 52, 46, 0.6)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(245, 230, 211, 0.7)',
                    fontSize: '0.825rem',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>Order #</th>
                  <th style={{ padding: '14px 20px' }}>Time</th>
                  <th style={{ padding: '14px 20px' }}>Items</th>
                  <th style={{ padding: '14px 20px' }}>Payment</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.slice(0, 8).map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid rgba(78, 52, 46, 0.3)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#D4A574' }}>
                      #{order.orderNumber}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'rgba(245, 230, 211, 0.6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#F5E6D3' }}>
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td style={{ padding: '14px 20px', textTransform: 'capitalize', color: 'rgba(245, 230, 211, 0.7)' }}>
                      {order.paymentMethod || 'Cash'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#F5E6D3' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
