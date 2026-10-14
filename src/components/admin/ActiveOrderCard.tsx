'use client';

import React from 'react';
import type { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Coffee, CheckCircle2, Flame } from 'lucide-react';

interface ActiveOrderCardProps {
  order: Order;
  onUpdateBrewStatus: (orderId: string, status: Order['brewStatus']) => void;
}

export function ActiveOrderCard({ order, onUpdateBrewStatus }: ActiveOrderCardProps) {
  const getBrewBadge = () => {
    switch (order.brewStatus) {
      case 'received':
        return <Badge variant="warning" pulse>Order Received</Badge>;
      case 'brewing':
        return <Badge variant="gold" pulse>Brewing</Badge>;
      case 'ready':
        return <Badge variant="success">Ready for Pickup</Badge>;
    }
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card variant="surface-2" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
            #{order.orderNumber}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(245, 230, 211, 0.5)', fontSize: '0.75rem', marginTop: '2px' }}>
            <Clock size={13} />
            <span>{formattedTime}</span>
            {order.paymentMethod && <span>• {order.paymentMethod.toUpperCase()}</span>}
          </div>
        </div>
        <div>{getBrewBadge()}</div>
      </div>

      {/* Items list */}
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

      {/* Footer & actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>Total Amount</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5E6D3' }}>
            ₹{order.totalAmount.toFixed(2)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {order.brewStatus === 'received' && (
            <Button
              size="sm"
              variant="secondary"
              icon={<Flame size={14} color="#FFA726" />}
              onClick={() => onUpdateBrewStatus(order.id!, 'brewing')}
            >
              Start Brewing
            </Button>
          )}

          {order.brewStatus === 'brewing' && (
            <Button
              size="sm"
              variant="primary"
              icon={<Coffee size={14} />}
              onClick={() => onUpdateBrewStatus(order.id!, 'ready')}
            >
              Mark Ready
            </Button>
          )}

          {order.brewStatus === 'ready' && (
            <Button
              size="sm"
              variant="outline"
              icon={<CheckCircle2 size={14} color="#66BB6A" />}
              onClick={() => onUpdateBrewStatus(order.id!, 'ready')}
              disabled
            >
              Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
