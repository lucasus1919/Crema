'use client';

import React from 'react';
import { Package, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { InventoryRow } from '@/components/admin/InventoryRow';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminInventoryPage() {
  const { items, loading, lowStockItems, restockItem, loadInventory } = useInventory();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
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
            Inventory Management
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Real-time ingredient levels, minimum stock alerts, and restocking
          </p>
        </div>
        <Button variant="secondary" size="md" icon={<RotateCw size={16} />} onClick={loadInventory}>
          Refresh Levels
        </Button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 167, 38, 0.12)',
            border: '1px solid rgba(255, 167, 38, 0.4)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#FFA726" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFA726' }}>
                {lowStockItems.length} Low-Stock Alert{lowStockItems.length > 1 ? 's' : ''}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'rgba(245, 230, 211, 0.8)', marginTop: '2px' }}>
                {lowStockItems.map((i) => i.name).join(', ')} require replenishment soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Tracked Items
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F5E6D3', marginTop: '4px' }}>
            {items.length}
          </h3>
        </Card>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Needs Restock
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: lowStockItems.length > 0 ? '#FFA726' : '#66BB6A', marginTop: '4px' }}>
            {lowStockItems.length}
          </h3>
        </Card>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Automatic Deductions
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#66BB6A', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Active on POS Checkout
          </h3>
        </Card>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
          <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No inventory records found in Firestore.</p>
        </Card>
      ) : (
        <Card variant="surface" padding="none" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(78, 52, 46, 0.6)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: 'rgba(245, 230, 211, 0.7)',
                  fontSize: '0.825rem',
                  textTransform: 'uppercase',
                }}
              >
                <th style={{ padding: '14px 20px' }}>Item Name</th>
                <th style={{ padding: '14px 20px' }}>Current Stock</th>
                <th style={{ padding: '14px 20px' }}>Min Threshold</th>
                <th style={{ padding: '14px 20px' }}>Health</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  onRestock={restockItem}
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
