'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coffee, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const profile = await signUp(email.trim(), password, name.trim());
      showToast(`Welcome to Crema, ${profile.name}!`, 'success');
      router.push('/customer/menu');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      showToast(msg, 'error');
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
            }}
          >
            Join Crema
          </h1>
          <p
            style={{
              color: 'rgba(245, 230, 211, 0.6)',
              fontSize: '0.95rem',
              marginTop: '4px',
            }}
          >
            Create your account to start ordering
          </p>
        </div>

        <Card variant="surface" padding="lg">
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={18} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password (min 6 chars)"
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
              style={{ width: '100%', marginTop: '6px' }}
            >
              Create Account
            </Button>
          </form>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'rgba(245, 230, 211, 0.6)',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: '#D4A574',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
