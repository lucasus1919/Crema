'use client';

import React from 'react';
import type { MenuItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemCardProps) {
  return (
    <Card variant="surface" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ItemImage item={item} size="md" />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F5E6D3', fontFamily: 'var(--font-heading)' }}>
              {item.name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.5)' }}>
              {item.category}
            </span>
          </div>
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#D4A574' }}>
          ₹{item.price.toFixed(2)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(78, 52, 46, 0.4)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onToggleAvailability(item)}
            style={{
              background: item.isAvailable ? 'rgba(102, 187, 106, 0.15)' : 'rgba(239, 83, 80, 0.15)',
              border: item.isAvailable ? '1px solid rgba(102, 187, 106, 0.4)' : '1px solid rgba(239, 83, 80, 0.4)',
              color: item.isAvailable ? '#66BB6A' : '#EF5350',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {item.isAvailable ? <Check size={12} /> : <X size={12} />}
            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit2 size={14} />}
            onClick={() => onEdit(item)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 size={14} />}
            onClick={() => onDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
