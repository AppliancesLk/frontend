/**
 * @file RepairStatusBadge.test.tsx
 * @description Tests for the RepairStatusBadge component
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-010: Should render PENDING status with warning styling
 * - TC-FE-REPAIR-011: Should render APPROVED status with special styling
 * - TC-FE-REPAIR-012: Should render REJECTED status with danger styling
 * - TC-FE-REPAIR-013: Should render ASSIGNED status with special styling
 * - TC-FE-REPAIR-014: Should render IN_PROGRESS status with info styling
 * - TC-FE-REPAIR-015: Should render AWAITING_PARTS status with warning styling
 * - TC-FE-REPAIR-016: Should render READY_FOR_COLLECTION status with success styling
 * - TC-FE-REPAIR-017: Should render COMPLETED status with success styling
 * - TC-FE-REPAIR-018: Should render CANCELLED status with danger styling
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepairStatusBadge } from './RepairStatusBadge';
import type { RepairStatus } from '../../../../types/repair.types';

describe('RepairStatusBadge', () => {
  const repairStatuses: RepairStatus[] = [
    'PENDING',
    'APPROVED',
    'REJECTED',
    'ASSIGNED',
    'IN_PROGRESS',
    'AWAITING_PARTS',
    'READY_FOR_COLLECTION',
    'COMPLETED',
    'CANCELLED',
  ];

  // TC-FE-REPAIR-010
  it('should render PENDING status with warning styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="PENDING" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-warning');
  });

  // TC-FE-REPAIR-011
  it('should render APPROVED status with special styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="APPROVED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-special');
  });

  // TC-FE-REPAIR-012
  it('should render REJECTED status with danger styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="REJECTED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-danger');
  });

  // TC-FE-REPAIR-013
  it('should render ASSIGNED status with special styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="ASSIGNED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-special');
  });

  // TC-FE-REPAIR-014
  it('should render IN_PROGRESS status with info styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="IN_PROGRESS" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-info');
  });

  // TC-FE-REPAIR-015
  it('should render AWAITING_PARTS status with warning styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="AWAITING_PARTS" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-warning');
  });

  // TC-FE-REPAIR-016
  it('should render READY_FOR_COLLECTION status with success styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="READY_FOR_COLLECTION" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-success');
  });

  // TC-FE-REPAIR-017
  it('should render COMPLETED status with success styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="COMPLETED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-success');
  });

  // TC-FE-REPAIR-018
  it('should render CANCELLED status with danger styling', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="CANCELLED" />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-danger');
  });

  it('should render all repair statuses without errors', () => {
    // Act & Assert - all statuses should render without throwing
    for (const status of repairStatuses) {
      const { unmount } = render(<RepairStatusBadge status={status} />);
      expect(document.querySelector('.ui-badge')).toBeInTheDocument();
      unmount();
    }
  });

  it('should display translated status text', () => {
    // Arrange & Act
    render(<RepairStatusBadge status="PENDING" />);

    // Assert - should contain translated text (case-insensitive check)
    const badge = screen.getByText(/pending/i);
    expect(badge).toBeInTheDocument();
  });
});
