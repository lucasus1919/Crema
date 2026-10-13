'use client';

import React, { useState } from 'react';
import {
  Coffee,
  Search,
  Plus,
  Minus,
  Trash2,
  Ticket,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle,
} from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useOrders } from '@/contexts/OrderContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ItemImage } from '@/components/ui/ItemImage';

export default function NewOrderPage() {
  const { items, categories, selectedCategory, setSelectedCategory, loading: menuLoading } = useMenu();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
    checkout,
    clearCart,
  } = useOrders();

  const [search, setSearch] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [processing, setProcessing] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = await applyCouponCode(couponInput);
      if (ok) setCouponInput('');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      await checkout(paymentMethod);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', minHeight: 'calc(100vh - 80px)' }}>
      {/* Left: Menu Catalog Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Terminal POS
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Build order, select discounts, and process payment
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search coffee, tea, pastries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                  background: isSelected ? 'rgba(212, 165, 116, 0.2)' : '#24140E',
                  color: isSelected ? '#D4A574' : '#F5E6D3',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        {menuLoading ? (
          <Spinner />
        ) : filteredItems.length === 0 ? (
          <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
            <Coffee size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No items found matching criteria.</p>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.isAvailable && addToCart(item)}
                style={{
                  cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                  opacity: item.isAvailable ? 1 : 0.5,
                }}
              >
                <Card
                  variant="surface"
                  padding="md"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderColor: item.isAvailable ? 'rgba(78, 52, 46, 0.6)' : 'rgba(239, 83, 80, 0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <ItemImage item={item} size="md" />
                    {!item.isAvailable && <Badge variant="danger" size="sm">Out of Stock</Badge>}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F5E6D3' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#D4A574' }}>
                      ₹{item.price.toFixed(2)}
                    </span>
                    <button
                      disabled={!item.isAvailable}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: '#D4A574',
                        color: '#1A1210',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Cart Builder & Checkout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card variant="surface-2" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F5E6D3', fontFamily: 'var(--font-heading)' }}>
              Current Order
            </h3>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(239, 83, 80, 0.8)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.4)', padding: '24px 0', fontSize: '0.85rem' }}>
                Cart is empty. Tap items to add.
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.menuItemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#24140E',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F5E6D3' }}>
                      {item.name}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#D4A574' }}>
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: '#3D2317',
                        border: 'none',
                        color: '#F5E6D3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: '#3D2317',
                        border: 'none',
                        color: '#F5E6D3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} />
                    </button>
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
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Form */}
          <div style={{ borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '14px' }}>
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
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  icon={<Ticket size={16} />}
                />
                <Button size="sm" type="submit" variant="secondary">
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', display: 'block', marginBottom: '8px' }}>
              Payment Method
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: paymentMethod === 'cash' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                  background: paymentMethod === 'cash' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                  color: '#F5E6D3',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Banknote size={16} color={paymentMethod === 'cash' ? '#D4A574' : 'rgba(245, 230, 211, 0.5)'} />
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: paymentMethod === 'card' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                  background: paymentMethod === 'card' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                  color: '#F5E6D3',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CreditCard size={16} color={paymentMethod === 'card' ? '#D4A574' : 'rgba(245, 230, 211, 0.5)'} />
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: paymentMethod === 'qr' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.6)',
                  background: paymentMethod === 'qr' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
                  color: '#F5E6D3',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <QrCode size={16} color={paymentMethod === 'qr' ? '#D4A574' : 'rgba(245, 230, 211, 0.5)'} />
                QR Code
              </button>
            </div>
          </div>

          {/* Pricing Summary */}
          <div style={{ borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F5E6D3', fontSize: '1.15rem', fontWeight: 800, marginTop: '4px' }}>
              <span>Total</span>
              <span style={{ color: '#D4A574' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            size="lg"
            variant="primary"
            disabled={cart.length === 0}
            loading={processing}
            onClick={handleCheckout}
            icon={<CheckCircle size={18} />}
            style={{ width: '100%' }}
          >
            Process & Brew (₹{total.toFixed(2)})
          </Button>
        </Card>
      </div>
    </div>
  );
}
