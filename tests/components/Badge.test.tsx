import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Gold Status</Badge>);
    expect(screen.getByText('Gold Status')).toBeInTheDocument();
  });

  it('renders with different variants without error', () => {
    const { rerender } = render(<Badge variant="success">Completed</Badge>);
    expect(screen.getByText('Completed')).toBeInTheDocument();

    rerender(<Badge variant="danger">Failed</Badge>);
    expect(screen.getByText('Failed')).toBeInTheDocument();

    rerender(<Badge variant="warning">Low Stock</Badge>);
    expect(screen.getByText('Low Stock')).toBeInTheDocument();

    rerender(<Badge variant="muted">Offline</Badge>);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('renders pulse dot when pulse prop is true', () => {
    const { container } = render(<Badge pulse>Active</Badge>);
    const pulseDot = container.querySelector('span > span');
    expect(pulseDot).toBeInTheDocument();
  });
});
