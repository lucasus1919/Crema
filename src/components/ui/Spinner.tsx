'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 28, color = '#D4A574' }: { size?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Loader2
        style={{
          width: size,
          height: size,
          color,
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
}
