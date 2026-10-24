/**
 * @file AdminOrderBadges.test.tsx
 * @description Tests for the AdminOrderStatusBadge and PaymentBadge components
 *
 * Test Case IDs:
 * - TC-FE-ADMIN-009: AdminOrderStatusBadge should render PENDING_PAYMENT with warning styling
 * - TC-FE-ADMIN-010: AdminOrderStatusBadge should render CONFIRMED with info styling
 * - TC-FE-ADMIN-011: AdminOrderStatusBadge should render PROCESSING with info styling
 * - TC-FE-ADMIN-012: AdminOrderStatusBadge should render SHIPPED with info styling
 * - TC-FE-ADMIN-013: AdminOrderStatusBadge should render DELIVERED with success styling
 * - TC-FE-ADMIN-014: AdminOrderStatusBadge should render CANCELLED with danger styling
 * - TC-FE-ADMIN-015: PaymentBadge should render PENDING with warning styling
 * - TC-FE-ADMIN-016: PaymentBadge should render SUCCESS with success styling
 * - TC-FE-ADMIN-017: PaymentBadge should render FAILED with danger styling
 * - TC-FE-ADMIN-018: PaymentBadge should render CANCELLED with danger styling
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AdminOrderStatusBadge, PaymentBadge } from './AdminOrderBadges';
import type { OrderStatus } from '../../../../types/order.types';

describe('AdminOrderBadges', () => {
  describe('AdminOrderStatusBadge', () => {
    // TC-FE-ADMIN-009
    it('should render PENDING_PAYMENT with warning styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="PENDING_PAYMENT" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-warning');
    });

    // TC-FE-ADMIN-010
    it('should render CONFIRMED with info styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="CONFIRMED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-info');
    });

    // TC-FE-ADMIN-011
    it('should render PROCESSING with info styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="PROCESSING" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-info');
    });

    // TC-FE-ADMIN-012
    it('should render SHIPPED with info styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="SHIPPED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-info');
    });

    // TC-FE-ADMIN-013
    it('should render DELIVERED with success styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="DELIVERED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-success');
    });

    // TC-FE-ADMIN-014
    it('should render CANCELLED with danger styling', () => {
      // Arrange & Act
      render(<AdminOrderStatusBadge status="CANCELLED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-danger');
    });

    it('should render all order statuses without errors', () => {
      // Arrange
      const orderStatuses: OrderStatus[] = [
        'PENDING_PAYMENT',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ];

      // Act & Assert - all statuses should render without throwing
      for (const status of orderStatuses) {
        const { unmount } = render(<AdminOrderStatusBadge status={status} />);
        expect(document.querySelector('.ui-badge')).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('PaymentBadge', () => {
    // TC-FE-ADMIN-015
    it('should render PENDING with warning styling', () => {
      // Arrange & Act
      render(<PaymentBadge status="PENDING" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-warning');
    });

    // TC-FE-ADMIN-016
    it('should render SUCCESS with success styling', () => {
      // Arrange & Act
      render(<PaymentBadge status="SUCCESS" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-success');
    });

    // TC-FE-ADMIN-017
    it('should render FAILED with danger styling', () => {
      // Arrange & Act
      render(<PaymentBadge status="FAILED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-danger');
    });

    // TC-FE-ADMIN-018
    it('should render CANCELLED with danger styling', () => {
      // Arrange & Act
      render(<PaymentBadge status="CANCELLED" />);

      // Assert
      const badge = document.querySelector('.ui-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('ui-tone-danger');
    });

    it('should render all payment statuses without errors', () => {
      // Arrange
      const paymentStatuses: ('PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED')[] = [
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED',
      ];

      // Act & Assert
      for (const status of paymentStatuses) {
        const { unmount } = render(<PaymentBadge status={status} />);
        expect(document.querySelector('.ui-badge')).toBeInTheDocument();
        unmount();
      }
    });
  });
});
