'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck } from 'lucide-react';
import type { AppUser } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { useToast } from '@/contexts/ToastContext';
import { UserCard } from '@/components/admin/UserCard';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = fbService.streamUsers((liveUsers) => {
      setUsers(liveUsers);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateRole = async (userId: string, role: AppUser['role']) => {
    try {
      await fbService.updateUserRole(userId, role);
      showToast(`User role updated to ${role.toUpperCase()}`, 'success');
    } catch {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      await fbService.deleteUser(userId);
      showToast('User removed', 'info');
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
          Team & Customer Directory
        </h1>
        <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
          Role management, loyalty accounts, and permissions
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Total Registered
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F5E6D3', marginTop: '4px' }}>
            {users.length}
          </h3>
        </Card>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Baristas / Admins
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D4A574', marginTop: '4px' }}>
            {adminCount}
          </h3>
        </Card>
        <Card variant="surface" padding="md">
          <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.6)', textTransform: 'uppercase' }}>
            Loyalty Customers
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#66BB6A', marginTop: '4px' }}>
            {customerCount}
          </h3>
        </Card>
      </div>

      {/* Search */}
      <div style={{ maxWidth: '400px' }}>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>

      {/* Users Grid */}
      {loading ? (
        <Spinner />
      ) : filteredUsers.length === 0 ? (
        <Card variant="surface" padding="lg" style={{ textAlign: 'center', color: 'rgba(245, 230, 211, 0.5)' }}>
          <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No users matching query.</p>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onUpdateRole={handleUpdateRole}
              onDeleteUser={handleDeleteUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
