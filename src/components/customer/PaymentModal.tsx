'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useOrders } from '@/contexts/OrderContext';
import { Banknote, CreditCard, QrCode, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const router = useRouter();
  const { total, checkout } = useOrders();
  const [method, setMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    try {
      await checkout(method);
      onClose();
      router.push('/customer/orders');
    } catch {
      // toast is already displayed by OrderContext
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Payment Method">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'rgba(245, 230, 211, 0.6)' }}>
            Amount Due
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
            ₹{total.toFixed(2)}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setMethod('cash')}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: method === 'cash' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.7)',
              background: method === 'cash' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#F5E6D3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Banknote size={22} color={method === 'cash' ? '#D4A574' : 'rgba(245, 230, 211, 0.6)'} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Pay at Counter (Cash)</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>Pay the barista upon pickup</span>
              </div>
            </div>
            {method === 'cash' && <CheckCircle2 size={18} color="#D4A574" />}
          </button>

          <button
            type="button"
            onClick={() => setMethod('card')}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: method === 'card' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.7)',
              background: method === 'card' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#F5E6D3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCard size={22} color={method === 'card' ? '#D4A574' : 'rgba(245, 230, 211, 0.6)'} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Credit / Debit Card</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>Tap or insert card terminal</span>
              </div>
            </div>
            {method === 'card' && <CheckCircle2 size={18} color="#D4A574" />}
          </button>

          <button
            type="button"
            onClick={() => setMethod('qr')}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: method === 'qr' ? '2px solid #D4A574' : '1px solid rgba(78, 52, 46, 0.7)',
              background: method === 'qr' ? 'rgba(212, 165, 116, 0.15)' : '#24140E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#F5E6D3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <QrCode size={22} color={method === 'qr' ? '#D4A574' : 'rgba(245, 230, 211, 0.6)'} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Instant QR Payment</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(245, 230, 211, 0.5)' }}>Scan UPI / Apple Pay / Google Pay</span>
              </div>
            </div>
            {method === 'qr' && <CheckCircle2 size={18} color="#D4A574" />}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={processing} onClick={handlePay}>
            Confirm Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
