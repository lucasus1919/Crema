'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  isPositive = true,
}: StatCardProps) {
  return (
    <Card variant="surface" padding="md">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 500,
              color: 'rgba(245, 230, 211, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </span>
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#F5E6D3',
              marginTop: '6px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {value}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'rgba(245, 230, 211, 0.5)', marginTop: '4px' }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isPositive ? '#66BB6A' : '#EF5350',
              }}
            >
              {trend}
            </span>
          )}
        </div>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(212, 165, 116, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4A574',
            border: '1px solid rgba(212, 165, 116, 0.25)',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
