'use client';

import React, { useState } from 'react';
import type { InventoryItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InventoryRowProps {
  item: InventoryItem;
  onRestock: (item: InventoryItem, amount: number) => void;
}

export function InventoryRow({ item, onRestock }: InventoryRowProps) {
  const [restockAmount, setRestockAmount] = useState('5');
  const [isRestocking, setIsRestocking] = useState(false);

  const isLowStock = item.currentStock <= item.minStock;

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(restockAmount);
    if (!isNaN(num) && num > 0) {
      onRestock(item, num);
      setIsRestocking(false);
    }
  };

  return (
    <tr
      style={{
        borderBottom: '1px solid rgba(78, 52, 46, 0.4)',
        transition: 'background-color 0.15s ease',
      }}
    >
      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#F5E6D3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLowStock ? (
            <AlertTriangle size={16} color="#FFA726" />
          ) : (
            <CheckCircle2 size={16} color="#66BB6A" />
          )}
          <span>{item.name}</span>
        </div>
      </td>
      <td style={{ padding: '16px 20px', color: '#D4A574', fontWeight: 700 }}>
        {item.currentStock.toFixed(1)} {item.unit}
      </td>
      <td style={{ padding: '16px 20px', color: 'rgba(245, 230, 211, 0.6)' }}>
        {item.minStock.toFixed(1)} {item.unit}
      </td>
      <td style={{ padding: '16px 20px' }}>
        {isLowStock ? (
          <Badge variant="warning" pulse>
            Low Stock
          </Badge>
        ) : (
          <Badge variant="success">Adequate</Badge>
        )}
      </td>
      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
        {isRestocking ? (
          <form
            onSubmit={handleRestockSubmit}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <input
              type="number"
              step="any"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              style={{
                width: '70px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #D4A574',
                background: '#24140E',
                color: '#F5E6D3',
                fontSize: '0.85rem',
              }}
              autoFocus
            />
            <Button size="sm" type="submit">
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setIsRestocking(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            icon={<Plus size={14} />}
            onClick={() => setIsRestocking(true)}
          >
            Restock
          </Button>
        )}
      </td>
    </tr>
  );
}
