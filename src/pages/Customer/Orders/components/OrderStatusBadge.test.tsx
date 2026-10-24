/**
 * @file OrderStatusBadge.test.tsx
 * @description Tests for the OrderStatusBadge component
 *
 * Test Case IDs:
 * - TC-FE-ORDER-001: Should render PENDING_PAYMENT status with warning styling
 * - TC-FE-ORDER-002: Should render CONFIRMED status with info styling
 * - TC-FE-ORDER-003: Should render PROCESSING status with info styling
 * - TC-FE-ORDER-004: Should render SHIPPED status with info styling
 * - TC-FE-ORDER-005: Should render DELIVERED status with success styling
 * - TC-FE-ORDER-006: Should render CANCELLED status with danger styling
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { OrderStatus } from '../../../../types/order.types';

describe('OrderStatusBadge', () => {
  const orderStatuses: OrderStatus[] = [
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  // TC-FE-ORDER-001
  it('should render PENDING_PAYMENT status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="PENDING_PAYMENT" />);

    // Assert - the badge should contain the translated status text
    const badge = screen.getByText(/pending payment/i);
    expect(badge).toBeInTheDocument();
  });

  // TC-FE-ORDER-002
  it('should render CONFIRMED status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="CONFIRMED" />);

    // Assert
    const badge = screen.getByText(/confirmed/i);
    expect(badge).toBeInTheDocument();
  });

  // TC-FE-ORDER-003
  it('should render PROCESSING status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="PROCESSING" />);

    // Assert
    const badge = screen.getByText(/processing/i);
    expect(badge).toBeInTheDocument();
  });

  // TC-FE-ORDER-004
  it('should render SHIPPED status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="SHIPPED" />);

    // Assert
    const badge = screen.getByText(/shipped/i);
    expect(badge).toBeInTheDocument();
  });

  // TC-FE-ORDER-005
  it('should render DELIVERED status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="DELIVERED" />);

    // Assert
    const badge = screen.getByText(/delivered/i);
    expect(badge).toBeInTheDocument();
  });

  // TC-FE-ORDER-006
  it('should render CANCELLED status with translated text', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="CANCELLED" />);

    // Assert
    const badge = screen.getByText(/cancelled/i);
    expect(badge).toBeInTheDocument();
  });

  it('should render all order statuses without errors', () => {
    // Act & Assert - all statuses should render without throwing
    for (const status of orderStatuses) {
      const { unmount } = render(<OrderStatusBadge status={status} />);
      expect(document.querySelector('.ui-badge')).toBeInTheDocument();
      unmount();
    }
  });

  it('should apply correct CSS class for badge styling', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="DELIVERED" />);

    // Assert - check for the badge class
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-success');
  });

  it('should apply warning tone for PENDING_PAYMENT', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="PENDING_PAYMENT" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-warning');
  });

  it('should apply info tone for CONFIRMED', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="CONFIRMED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-info');
  });

  it('should apply danger tone for CANCELLED', () => {
    // Arrange & Act
    render(<OrderStatusBadge status="CANCELLED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-danger');
  });
});
