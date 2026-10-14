'use client';

import React from 'react';
import type { Coupon } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, Trash2, Calendar, Hash } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface CouponCardProps {
  coupon: Coupon;
  onDelete: (id: string) => void;
}

export function CouponCard({ coupon, onDelete }: CouponCardProps) {
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    showToast(`Copied ${coupon.code} to clipboard`, 'success');
  };

  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  const isMaxedOut = coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses;
  const isInactive = !coupon.active || isExpired || isMaxedOut;

  return (
    <Card variant="surface" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(212, 165, 116, 0.15)',
              border: '1px dashed #D4A574',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#D4A574',
              letterSpacing: '0.05em',
            }}
          >
            {coupon.code}
          </div>
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(245, 230, 211, 0.6)',
              cursor: 'pointer',
              padding: '4px',
            }}
            title="Copy Code"
          >
            <Copy size={16} />
          </button>
        </div>

        {isInactive ? (
          <Badge variant="muted">Inactive / Expired</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5E6D3' }}>
          {coupon.discountType === 'percent'
            ? `${coupon.discountValue}% OFF`
            : `₹${coupon.discountValue.toFixed(2)} OFF`}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(78, 52, 46, 0.4)',
          paddingTop: '12px',
          fontSize: '0.8rem',
          color: 'rgba(245, 230, 211, 0.55)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Hash size={13} />
            Used: {coupon.usedCount ?? 0} {coupon.maxUses ? `/ ${coupon.maxUses}` : '(Unlimited)'}
          </span>
          {coupon.expiresAt && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <Button
          size="sm"
          variant="danger"
          icon={<Trash2 size={14} />}
          onClick={() => onDelete(coupon.id!)}
        >
          Remove
        </Button>
      </div>
    </Card>
  );
}
