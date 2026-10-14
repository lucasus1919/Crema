'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'gold',
  size = 'md',
  pulse = false,
}: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return { bg: 'rgba(212, 165, 116, 0.15)', color: '#D4A574', border: 'rgba(212, 165, 116, 0.4)' };
      case 'success':
        return { bg: 'rgba(102, 187, 106, 0.15)', color: '#66BB6A', border: 'rgba(102, 187, 106, 0.4)' };
      case 'warning':
        return { bg: 'rgba(255, 167, 38, 0.15)', color: '#FFA726', border: 'rgba(255, 167, 38, 0.4)' };
      case 'danger':
        return { bg: 'rgba(239, 83, 80, 0.15)', color: '#EF5350', border: 'rgba(239, 83, 80, 0.4)' };
      case 'muted':
        return { bg: 'rgba(245, 230, 211, 0.1)', color: 'rgba(245, 230, 211, 0.7)', border: 'rgba(245, 230, 211, 0.2)' };
    }
  };

  const c = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        borderRadius: '9999px',
        fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {pulse && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: c.color,
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
      {children}
    </span>
  );
}
