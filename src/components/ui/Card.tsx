'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'surface-2' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'surface',
  padding = 'md',
  className = '',
  style,
  ...props
}: CardProps) {
  const getBg = () => {
    switch (variant) {
      case 'surface':
        return '#2C1A12';
      case 'surface-2':
        return '#3D2317';
      case 'glow':
        return '#2C1A12';
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '12px';
      case 'md':
        return '20px';
      case 'lg':
        return '28px';
    }
  };

  return (
    <div
      style={{
        background: getBg(),
        borderRadius: '16px',
        border: '1px solid rgba(78, 52, 46, 0.6)',
        boxShadow: variant === 'glow' ? '0 0 24px rgba(212, 165, 116, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.35)',
        padding: getPadding(),
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
      className={`crema-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
