'use client';

import React from 'react';
import type { AppUser } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { User, Shield, Award, Trash2 } from 'lucide-react';

interface UserCardProps {
  user: AppUser;
  onUpdateRole: (userId: string, role: AppUser['role']) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserCard({ user, onUpdateRole, onDeleteUser }: UserCardProps) {
  return (
    <Card variant="surface" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: user.role === 'admin' ? 'rgba(212, 165, 116, 0.2)' : 'rgba(78, 52, 46, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: user.role === 'admin' ? '#D4A574' : '#F5E6D3',
            }}
          >
            {user.role === 'admin' ? <Shield size={22} /> : <User size={22} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5E6D3', fontFamily: 'var(--font-heading)' }}>
              {user.name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.5)' }}>
              {user.email}
            </span>
          </div>
        </div>

        <Badge variant={user.role === 'admin' ? 'gold' : 'muted'}>
          {user.role.toUpperCase()}
        </Badge>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(78, 52, 46, 0.4)',
          paddingTop: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#D4A574' }}>
          <Award size={16} />
          <span>{user.loyaltyPoints} Loyalty Points</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={user.role}
            onChange={(e) => onUpdateRole(user.id!, e.target.value as AppUser['role'])}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: '#24140E',
              border: '1px solid rgba(78, 52, 46, 0.8)',
              color: '#F5E6D3',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 size={13} />}
            onClick={() => onDeleteUser(user.id!)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
