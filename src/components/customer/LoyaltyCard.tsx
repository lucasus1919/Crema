'use client';

import React from 'react';
import { Award, Coffee, Sparkles, Check } from 'lucide-react';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface LoyaltyCardProps {
  onOpenRedeemModal: () => void;
}

export function LoyaltyCard({ onOpenRedeemModal }: LoyaltyCardProps) {
  const { points, freeItemReady } = useLoyalty();
  const { appUser } = useAuth();

  const currentStamps = Math.min(10, points % 10 === 0 && points > 0 ? 10 : points % 10);
  const totalFreeDrinksClaimed = Math.floor(points / 10);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #3D2317 0%, #24140E 100%)',
        border: '1px solid rgba(212, 165, 116, 0.4)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: freeItemReady
          ? '0 0 30px rgba(212, 165, 116, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Card Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#D4A574" />
            <span
              style={{
                fontSize: '0.8rem',
                color: '#D4A574',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Crema Rewards Club
            </span>
          </div>
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
              marginTop: '4px',
            }}
          >
            {appUser?.name || 'Coffee Lover'}
          </h2>
        </div>

        <div
          style={{
            textAlign: 'right',
            background: 'rgba(212, 165, 116, 0.12)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 165, 116, 0.3)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.6)' }}>Total Points</span>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#D4A574' }}>
            {points} pts
          </p>
        </div>
      </div>

      {/* 10-Stamp Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
          <span style={{ color: 'rgba(245, 230, 211, 0.7)' }}>
            Buy 10 coffees, get 1 free!
          </span>
          <span style={{ color: '#D4A574', fontWeight: 700 }}>
            {currentStamps} / 10 stamps
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
          }}
        >
          {Array.from({ length: 10 }).map((_, index) => {
            const isStamped = index < currentStamps;
            const isTenth = index === 9;

            return (
              <div
                key={index}
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  background: isStamped
                    ? 'linear-gradient(135deg, #D4A574 0%, #A87B4F 100%)'
                    : 'rgba(0, 0, 0, 0.35)',
                  border: isStamped
                    ? '1px solid #D4A574'
                    : isTenth
                    ? '2px dashed rgba(212, 165, 116, 0.5)'
                    : '1px solid rgba(78, 52, 46, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isStamped ? '#1A1210' : 'rgba(245, 230, 211, 0.3)',
                  boxShadow: isStamped ? '0 4px 12px rgba(212, 165, 116, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {isStamped ? (
                  <Check size={20} strokeWidth={3} />
                ) : isTenth ? (
                  <Sparkles size={20} color="#D4A574" />
                ) : (
                  <Coffee size={18} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeem Action Banner */}
      {freeItemReady ? (
        <div
          style={{
            background: 'rgba(212, 165, 116, 0.18)',
            border: '1px solid #D4A574',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="#D4A574" />
            <div>
              <p style={{ fontWeight: 700, color: '#F5E6D3', fontSize: '0.95rem' }}>
                Free Coffee Ready!
              </p>
              <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.7)' }}>
                You have reached 10 loyalty stamps
              </span>
            </div>
          </div>
          <Button size="sm" variant="primary" onClick={onOpenRedeemModal}>
            Claim Free Coffee
          </Button>
        </div>
      ) : (
        <p style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.5)', textAlign: 'center' }}>
          {10 - currentStamps} more cup{10 - currentStamps > 1 ? 's' : ''} until your next free artisan beverage!
        </p>
      )}
    </div>
  );
}
