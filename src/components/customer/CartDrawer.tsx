'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, Ticket, ShoppingBag, ArrowRight } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ItemImage } from '@/components/ui/ItemImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export function CartDrawer({ isOpen, onClose, onProceedToPayment }: CartDrawerProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
  } = useOrders();

  const [couponCode, setCouponCode] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      const ok = await applyCouponCode(couponCode);
      if (ok) setCouponCode('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#2C1A12',
          borderLeft: '1px solid rgba(78, 52, 46, 0.8)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(78, 52, 46, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#D4A574" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5E6D3', fontFamily: 'var(--font-heading)' }}>
              Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(245, 230, 211, 0.6)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245, 230, 211, 0.4)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>Your bag is empty</p>
              <span style={{ fontSize: '0.85rem' }}>Choose your favorite coffee to get brewing!</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItemId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: '#24140E',
                  border: '1px solid rgba(78, 52, 46, 0.5)',
                }}
              >
                <ItemImage item={item} size="sm" />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F5E6D3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#D4A574', fontWeight: 600 }}>
                    ₹{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#3D2317', borderRadius: '8px', padding: '2px' }}>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F5E6D3',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F5E6D3',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#EF5350',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid rgba(78, 52, 46, 0.5)',
              backgroundColor: '#1E100A',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Coupon */}
            <div>
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(212, 165, 116, 0.12)',
                    border: '1px dashed #D4A574',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4A574' }}>
                      {appliedCoupon.code}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.6)', marginLeft: '6px' }}>
                      ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`} OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#EF5350',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="Promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    icon={<Ticket size={16} />}
                  />
                  <Button size="sm" type="submit" variant="secondary">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(245, 230, 211, 0.6)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#66BB6A' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F5E6D3', fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                <span>Total</span>
                <span style={{ color: '#D4A574' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              size="lg"
              variant="primary"
              onClick={onProceedToPayment}
              icon={<ArrowRight size={18} />}
              style={{ width: '100%' }}
            >
              Checkout (₹{total.toFixed(2)})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
