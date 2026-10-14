'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

export default function HomePage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (appUser?.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/customer/menu');
      }
    }
  }, [user, appUser, loading, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: 'var(--color-bg)',
      color: 'var(--color-on-surface)'
    }}>
      <Spinner size={36} />
      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
        Brewing Crema POS...
      </p>
    </div>
  );
}
