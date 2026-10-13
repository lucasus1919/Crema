'use client';

import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import type { MenuItem } from '@/types';

export function getItemImageUrl(item: { iconName?: string; name: string }): string {
  if (item.iconName && item.iconName.trim().length > 0) {
    const filename = item.iconName.replace(/^\/+/, '');
    return `/${filename}`;
  }
  const slug = item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_') + '.png';
  return `/${slug}`;
}

interface ItemImageProps {
  item: { iconName?: string; name: string };
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'fill';
  style?: React.CSSProperties;
  className?: string;
}

export function ItemImage({ item, size = 'md', style, className = '' }: ItemImageProps) {
  const [error, setError] = useState(false);
  const src = getItemImageUrl(item);

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: '42px', height: '42px', borderRadius: '10px' };
      case 'md':
        return { width: '56px', height: '56px', borderRadius: '12px' };
      case 'lg':
        return { width: '80px', height: '80px', borderRadius: '14px' };
      case 'hero':
        return { width: '100%', height: '170px', borderRadius: '14px 14px 0 0' };
      case 'fill':
        return { width: '100%', height: '100%', borderRadius: 'inherit' };
    }
  };

  const dims = getDimensions();

  if (error) {
    return (
      <div
        style={{
          ...dims,
          backgroundColor: 'rgba(212, 165, 116, 0.12)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4A574',
          flexShrink: 0,
          ...style,
        }}
        className={className}
      >
        <Coffee size={size === 'hero' ? 36 : size === 'sm' ? 18 : 22} />
      </div>
    );
  }

  return (
    <div
      style={{
        ...dims,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#1E120D',
        flexShrink: 0,
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt={item.name}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.3s ease',
        }}
        loading="lazy"
      />
    </div>
  );
}
