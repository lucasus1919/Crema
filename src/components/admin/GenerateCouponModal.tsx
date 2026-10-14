'use client';

import React, { useState } from 'react';
import type { Coupon } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Ticket, Percent, IndianRupee, Calendar } from 'lucide-react';

interface GenerateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
}

export function GenerateCouponModal({
  isOpen,
  onClose,
  onGenerate,
}: GenerateCouponModalProps) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState('15');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      await onGenerate({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue) || 0,
        maxUses: maxUses ? parseInt(maxUses) : undefined,
        usedCount: 0,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        active: true,
        isGenerated: true,
      });
      setCode('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRandomCode = () => {
    const random = 'CREMA' + Math.floor(1000 + Math.random() * 9000);
    setCode(random);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Promotional Coupon">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Coupon Code"
              placeholder="e.g. MORNING20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              icon={<Ticket size={18} />}
              required
            />
          </div>
          <Button type="button" variant="secondary" size="md" onClick={handleGenerateRandomCode}>
            Random
          </Button>
        </div>

        <div>
          <label
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'rgba(245, 230, 211, 0.8)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Discount Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setDiscountType('percent')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: discountType === 'percent' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.8)',
                background: discountType === 'percent' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                color: '#F5E6D3',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Percent size={16} color={discountType === 'percent' ? '#D4A574' : 'rgba(245, 230, 211, 0.5)'} />
              Percentage (%)
            </button>
            <button
              type="button"
              onClick={() => setDiscountType('flat')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: discountType === 'flat' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.8)',
                background: discountType === 'flat' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                color: '#F5E6D3',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <IndianRupee size={16} color={discountType === 'flat' ? '#D4A574' : 'rgba(245, 230, 211, 0.5)'} />
              Fixed Amount (₹)
            </button>
          </div>
        </div>

        <Input
          label={discountType === 'percent' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
          type="number"
          step="any"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          required
        />

        <Input
          label="Max Usages (Optional)"
          type="number"
          placeholder="Leave blank for unlimited"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
        />

        <Input
          label="Expiration Date (Optional)"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          icon={<Calendar size={18} />}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
