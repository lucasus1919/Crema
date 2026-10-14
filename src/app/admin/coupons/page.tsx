'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Plus } from 'lucide-react';
import type { Coupon } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { useToast } from '@/contexts/ToastContext';
import { CouponCard } from '@/components/admin/CouponCard';
import { GenerateCouponModal } from '@/components/admin/GenerateCouponModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'inactive'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fbService.getAllCoupons();
      setCoupons(data);
    } catch {
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleGenerate = async (newCoupon: Omit<Coupon, 'id'>) => {
    try {
      await fbService.generateCoupon(newCoupon);
      showToast(`Coupon ${newCoupon.code} created!`, 'success');
      await loadCoupons();
    } catch {
      showToast('Failed to create coupon', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fbService.deleteCoupon(id);
      showToast('Coupon deleted', 'info');
      await loadCoupons();
    } catch {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const activeCoupons = coupons.filter((c) => {
    const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
    const isMaxed = c.maxUses && (c.usedCount ?? 0) >= c.maxUses;
    return c.active && !isExpired && !isMaxed;
  });

  const inactiveCoupons = coupons.filter((c) => {
    const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
    const isMaxed = c.maxUses && (c.usedCount ?? 0) >= c.maxUses;
    return !c.active || isExpired || isMaxed;
  });

  const displayList = tab === 'active' ? activeCoupons : inactiveCoupons;

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
            Promotional Coupons
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Generate promo codes, percentage discounts, and redemption caps
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={18} />}
          onClick={() => setModalOpen(true)}
        >
          Create Coupon
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setTab('active')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: tab === 'active' ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
            background: tab === 'active' ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
            color: tab === 'active' ? '#D4A574' : '#F5E6D3',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Active Codes ({activeCoupons.length})
        </button>
        <button
          onClick={() => setTab('inactive')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: tab === 'inactive' ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
            background: tab === 'inactive' ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
            color: tab === 'inactive' ? '#D4A574' : '#F5E6D3',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Expired / Exhausted ({inactiveCoupons.length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner />
      ) : displayList.length === 0 ? (
        <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
          <Ticket size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No {tab} coupons found.</p>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {displayList.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Generate Modal */}
      <GenerateCouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
