'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = '',
  style,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'rgba(245, 230, 211, 0.8)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'rgba(245, 230, 211, 0.5)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </div>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 40px' : '10px 14px',
            backgroundColor: '#24140E',
            border: error ? '1px solid #EF5350' : '1px solid rgba(78, 52, 46, 0.7)',
            borderRadius: '10px',
            color: '#F5E6D3',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
          className={`crema-input ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#EF5350', marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
