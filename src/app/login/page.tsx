'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coffee, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('Lauren@wsym.de');
  const [password, setPassword] = useState('Pokerman@2626');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const profile = await signIn(email.trim(), password);
      showToast(`Welcome back, ${profile.name}!`, 'success');
      if (profile.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/menu');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      const profile = await signIn(demoEmail, demoPass);
      showToast(`Logged in as ${profile.role.toUpperCase()}`, 'success');
      if (profile.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/menu');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #2C1A12 0%, #1A1210 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #D4A574 0%, #5C4033 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)',
            }}
          >
            <Coffee size={34} color="#1A1210" />
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#F5E6D3',
              letterSpacing: '0.02em',
            }}
          >
            CREMA
          </h1>
          <p
            style={{
              color: 'rgba(245, 230, 211, 0.6)',
              fontSize: '0.95rem',
              marginTop: '4px',
            }}
          >
            Artisan Coffee POS & Ordering
          </p>
        </div>

        <Card variant="surface" padding="lg">
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#F5E6D3',
                  marginBottom: '6px',
                }}
              >
                Sign In
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245, 230, 211, 0.6)' }}>
                Enter your credentials to access the terminal
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 83, 80, 0.15)',
                  border: '1px solid rgba(239, 83, 80, 0.4)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  color: '#EF5350',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="barista@crema.coffee"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={loading}
              icon={<ArrowRight size={18} />}
              style={{ width: '100%', marginTop: '4px' }}
            >
              Sign In to Crema
            </Button>
          </form>

          <div
            style={{
              margin: '24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(245, 230, 211, 0.3)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'rgba(78, 52, 46, 0.6)' }} />
            <span>OR QUICK LOGIN</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(78, 52, 46, 0.6)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Sparkles size={14} color="#D4A574" />}
              onClick={() => handleDemoLogin('admin@crema.coffee', 'admin123')}
            >
              Admin Demo
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Coffee size={14} color="#D4A574" />}
              onClick={() => handleDemoLogin('Lauren@wsym.de', 'Pokerman@2626')}
            >
              Demo: Lauren
            </Button>
          </div>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'rgba(245, 230, 211, 0.6)',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              style={{
                color: '#D4A574',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
