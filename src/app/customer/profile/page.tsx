'use client';

import React, { useState } from 'react';
import { User, Mail, Award, Coffee, LogOut, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { useMenu } from '@/contexts/MenuContext';
import { LoyaltyCard } from '@/components/customer/LoyaltyCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import type { MenuItem } from '@/types';

export default function CustomerProfilePage() {
  const { appUser, signOut } = useAuth();
  const { points, freeItemReady, redeemFreeItem } = useLoyalty();
  const { items, loading: menuLoading } = useMenu();

  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [selectedRewardItem, setSelectedRewardItem] = useState<MenuItem | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const handleConfirmRedeem = async () => {
    if (!selectedRewardItem) return;
    setRedeeming(true);
    try {
      await redeemFreeItem(selectedRewardItem);
      setRedeemModalOpen(false);
      setSelectedRewardItem(null);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
          Loyalty Rewards & Account
        </h1>
        <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
          Your digital stamp card, redeemable rewards, and coffee preferences
        </p>
      </div>

      {/* Golden Loyalty Card */}
      <LoyaltyCard onOpenRedeemModal={() => setRedeemModalOpen(true)} />

      {/* Account Info Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <Card variant="surface" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4A574 0%, #5C4033 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A1210',
              }}
            >
              <User size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5E6D3' }}>
                {appUser?.name || 'Customer'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245, 230, 211, 0.6)' }}>
                {appUser?.email}
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(78, 52, 46, 0.5)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(245, 230, 211, 0.7)' }}>
              <span>Account Type</span>
              <span style={{ color: '#D4A574', fontWeight: 600, textTransform: 'capitalize' }}>
                {appUser?.role || 'Customer'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(245, 230, 211, 0.7)' }}>
              <span>Loyalty Points Available</span>
              <span style={{ color: '#D4A574', fontWeight: 700 }}>{points} pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(245, 230, 211, 0.7)' }}>
              <span>Rewards Status</span>
              <span style={{ color: freeItemReady ? '#66BB6A' : '#FFA726', fontWeight: 600 }}>
                {freeItemReady ? '1 Free Drink Available' : 'Collecting Stamps'}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(78, 52, 46, 0.5)', paddingTop: '16px' }}>
            <Button
              variant="danger"
              size="md"
              icon={<LogOut size={16} />}
              onClick={() => signOut()}
              style={{ width: '100%' }}
            >
              Sign Out of Account
            </Button>
          </div>
        </Card>

        {/* Loyalty Program Information */}
        <Card variant="surface-2" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A574' }}>
            <Award size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F5E6D3' }}>
              How Crema Loyalty Works
            </h3>
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', color: 'rgba(245, 230, 211, 0.75)', fontSize: '0.9rem' }}>
            <li>
              <strong style={{ color: '#F5E6D3' }}>1 Coffee = 1 Stamp:</strong> Every handcrafted coffee or espresso drink purchased earns 1 loyalty point automatically.
            </li>
            <li>
              <strong style={{ color: '#F5E6D3' }}>10 Stamps = 1 Free Drink:</strong> Once you fill all 10 cups on your stamp card, you can redeem any beverage on our menu at ₹0.00.
            </li>
            <li>
              <strong style={{ color: '#F5E6D3' }}>Automatic Cycle:</strong> Once redeemed, points reset towards your next complimentary drink.
            </li>
          </ul>

          {freeItemReady && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setRedeemModalOpen(true)}
              style={{ marginTop: 'auto' }}
            >
              Claim Free Drink Now
            </Button>
          )}
        </Card>
      </div>

      {/* Redeem Modal */}
      <Modal
        isOpen={redeemModalOpen}
        onClose={() => setRedeemModalOpen(false)}
        title="Choose Your Complimentary Beverage"
        maxWidth="540px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(245, 230, 211, 0.7)' }}>
            Select any beverage from the menu below to redeem with your 10 loyalty points:
          </p>

          {menuLoading ? (
            <Spinner />
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items
                .filter((i) => i.isAvailable)
                .map((item) => {
                  const isSelected = selectedRewardItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedRewardItem(item)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                        background: isSelected ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Coffee size={18} color="#D4A574" />
                        <div>
                          <p style={{ fontWeight: 600, color: '#F5E6D3', fontSize: '0.95rem' }}>
                            {item.name}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#D4A574', textDecoration: 'line-through' }}>
                          ₹{item.price.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#66BB6A' }}>
                          FREE
                        </span>
                        {isSelected && <Check size={18} color="#D4A574" />}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="ghost" onClick={() => setRedeemModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedRewardItem}
              loading={redeeming}
              onClick={handleConfirmRedeem}
            >
              Confirm Redemption
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
