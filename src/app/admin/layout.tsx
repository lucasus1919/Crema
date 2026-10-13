'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: '32px 40px',
          overflowY: 'auto',
          maxHeight: '100vh',
          maxWidth: 'calc(100vw - 260px)',
        }}
      >
        {loading ? (
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner size={36} />
          </div>
        ) : appUser && appUser.role !== 'admin' ? (
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              color: '#F5E6D3',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: '#EF5350' }}>Admin Privileges Required</h2>
            <p style={{ color: 'rgba(245, 230, 211, 0.7)', maxWidth: '420px' }}>
              Your account ({appUser.email}) does not have administrative access to this terminal.
            </p>
            <Button onClick={() => router.push('/customer/menu')} variant="primary">
              Switch to Customer View
            </Button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
