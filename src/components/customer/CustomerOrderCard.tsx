'use client';

import React from 'react';
import type { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';

export function CustomerOrderCard({ order }: { order: Order }) {
  const getBrewStatusDisplay = () => {
    switch (order.brewStatus) {
      case 'received':
        return {
          title: 'Order Received',
          description: 'Our barista has received your ticket.',
          badge: <Badge variant="warning" pulse>Received</Badge>,
        };
      case 'brewing':
        return {
          title: 'Brewing Your Coffee',
          description: 'Espresso extraction & milk steaming in progress!',
          badge: <Badge variant="gold" pulse>Brewing Now</Badge>,
        };
      case 'ready':
        return {
          title: 'Ready for Pickup!',
          description: 'Fresh & hot at the counter. Show your order #',
          badge: <Badge variant="success">Ready at Counter</Badge>,
        };
    }
  };

  const statusInfo = getBrewStatusDisplay();
  const timeFormatted = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card
      variant="surface"
      padding="md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: order.brewStatus === 'ready' ? '1px solid rgba(102, 187, 106, 0.5)' : undefined,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
              #{order.orderNumber}
            </span>
            {order.isFreeRedemption && (
              <Badge variant="gold" size="sm">
                <Sparkles size={11} style={{ marginRight: '3px' }} /> Free Reward
              </Badge>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)', marginTop: '2px' }}>
            <Clock size={13} />
            <span>{timeFormatted}</span>
            {order.paymentMethod && <span>• {order.paymentMethod.toUpperCase()}</span>}
          </div>
        </div>

        <div>{statusInfo.badge}</div>
      </div>

      {/* Brew Status Message */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Coffee size={18} color="#D4A574" />
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5E6D3' }}>
            {statusInfo.title}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.6)' }}>
            {statusInfo.description}
          </span>
        </div>
      </div>

      {/* Ordered Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '10px' }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#F5E6D3' }}>
              <strong style={{ color: '#D4A574' }}>{item.quantity}x</strong> {item.name}
            </span>
            <span style={{ color: 'rgba(245, 230, 211, 0.6)' }}>
              ₹{(item.unitPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '10px' }}>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245, 230, 211, 0.6)' }}>
          {order.items.reduce((s, i) => s + i.quantity, 0)} items total
        </span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D4A574' }}>
            ₹{order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
