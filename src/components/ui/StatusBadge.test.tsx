/**
 * @file StatusBadge.test.tsx
 * @description Tests for the StatusBadge UI component
 *
 * Test Case IDs:
 * - TC-FE-UI-001: Should render children content
 * - TC-FE-UI-002: Should apply success tone for success statuses
 * - TC-FE-UI-003: Should apply warning tone for pending statuses
 * - TC-FE-UI-004: Should apply danger tone for error statuses
 * - TC-FE-UI-005: Should apply info tone for processing statuses
 * - TC-FE-UI-006: Should apply neutral tone for unknown statuses
 * - TC-FE-UI-007: Should override status tone with explicit tone prop
 * - TC-FE-UI-008: Should include status indicator dot
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  // TC-FE-UI-001
  it('should render children content', () => {
    // Arrange & Act
    render(<StatusBadge>Test Status</StatusBadge>);

    // Assert
    expect(screen.getByText('Test Status')).toBeInTheDocument();
  });

  // TC-FE-UI-002
  it('should apply success tone for success statuses', () => {
    // Arrange
    const successStatuses = ['SUCCESS', 'PAID', 'DELIVERED', 'COMPLETED', 'IN_STOCK'];

    // Act & Assert
    for (const status of successStatuses) {
      const { unmount } = render(
        <StatusBadge status={status}>{status}</StatusBadge>,
      );
      const badge = document.querySelector('.ui-badge');
      expect(badge).toHaveClass('ui-tone-success');
      unmount();
    }
  });

  // TC-FE-UI-003
  it('should apply warning tone for pending statuses', () => {
    // Arrange
    const warningStatuses = ['PENDING', 'PENDING_PAYMENT', 'AWAITING_PARTS', 'LOW_STOCK'];

    // Act & Assert
    for (const status of warningStatuses) {
      const { unmount } = render(
        <StatusBadge status={status}>{status}</StatusBadge>,
      );
      const badge = document.querySelector('.ui-badge');
      expect(badge).toHaveClass('ui-tone-warning');
      unmount();
    }
  });

  // TC-FE-UI-004
  it('should apply danger tone for error statuses', () => {
    // Arrange
    const dangerStatuses = ['FAILED', 'REJECTED', 'CANCELLED', 'OUT_OF_STOCK', 'ERROR'];

    // Act & Assert
    for (const status of dangerStatuses) {
      const { unmount } = render(
        <StatusBadge status={status}>{status}</StatusBadge>,
      );
      const badge = document.querySelector('.ui-badge');
      expect(badge).toHaveClass('ui-tone-danger');
      unmount();
    }
  });

  // TC-FE-UI-005
  it('should apply info tone for processing statuses', () => {
    // Arrange
    const infoStatuses = ['PROCESSING', 'IN_PROGRESS', 'SHIPPED', 'ACTIVE', 'CONFIRMED'];

    // Act & Assert
    for (const status of infoStatuses) {
      const { unmount } = render(
        <StatusBadge status={status}>{status}</StatusBadge>,
      );
      const badge = document.querySelector('.ui-badge');
      expect(badge).toHaveClass('ui-tone-info');
      unmount();
    }
  });

  // TC-FE-UI-006
  it('should apply neutral tone for unknown statuses', () => {
    // Arrange & Act
    render(<StatusBadge status="UNKNOWN_STATUS">Unknown</StatusBadge>);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-neutral');
  });

  // TC-FE-UI-007
  it('should override status tone with explicit tone prop', () => {
    // Arrange & Act
    render(
      <StatusBadge status="SUCCESS" tone="danger">
        Override Test
      </StatusBadge>,
    );

    // Assert - tone prop should override status-based tone
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-danger');
    expect(badge).not.toHaveClass('ui-tone-success');
  });

  // TC-FE-UI-008
  it('should include status indicator dot', () => {
    // Arrange & Act
    render(<StatusBadge status="SUCCESS">Status</StatusBadge>);

    // Assert - should have the indicator dot element
    const dot = document.querySelector('.ui-badge span[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('rounded-full');
  });

  it('should apply neutral tone when no status is provided', () => {
    // Arrange & Act
    render(<StatusBadge>No Status</StatusBadge>);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-neutral');
  });

  it('should apply special tone for special statuses', () => {
    // Arrange
    const specialStatuses = ['APPROVED', 'ASSIGNED', 'OPEN', 'AWAITING_REVIEW'];

    // Act & Assert
    for (const status of specialStatuses) {
      const { unmount } = render(
        <StatusBadge status={status}>{status}</StatusBadge>,
      );
      const badge = document.querySelector('.ui-badge');
      expect(badge).toHaveClass('ui-tone-special');
      unmount();
    }
  });

  it('should handle READY_FOR_COLLECTION status', () => {
    // Arrange & Act
    render(<StatusBadge status="READY_FOR_COLLECTION">Ready</StatusBadge>);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-success');
  });

  it('should handle ONLINE status', () => {
    // Arrange & Act
    render(<StatusBadge status="ONLINE">Online</StatusBadge>);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toHaveClass('ui-tone-success');
  });
});
