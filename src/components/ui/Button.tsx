'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #D4A574 0%, #C08A56 100%)',
          color: '#1A1210',
          border: 'none',
          boxShadow: '0 4px 14px rgba(212, 165, 116, 0.3)',
        };
      case 'secondary':
        return {
          background: '#3D2317',
          color: '#F5E6D3',
          border: '1px solid rgba(78, 52, 46, 0.8)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#D4A574',
          border: '1px solid #D4A574',
        };
      case 'danger':
        return {
          background: 'rgba(239, 83, 80, 0.15)',
          color: '#EF5350',
          border: '1px solid rgba(239, 83, 80, 0.4)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#F5E6D3',
          border: 'none',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.825rem', borderRadius: '8px' };
      case 'md':
        return { padding: '10px 18px', fontSize: '0.925rem', borderRadius: '10px' };
      case 'lg':
        return { padding: '14px 24px', fontSize: '1.05rem', borderRadius: '12px' };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        fontFamily: 'var(--font-heading)',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`crema-btn ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : icon}
      {children}
    </button>
  );
}
