/**
 * @file ProductGridSkeleton.test.tsx
 * @description Tests for ProductGridSkeleton component
 *
 * Test Case IDs:
 * - TC-FE-SKELETON-001: Renders default number of skeleton items
 * - TC-FE-SKELETON-002: Renders custom count of skeleton items
 * - TC-FE-SKELETON-003: Has loading status role
 * - TC-FE-SKELETON-004: Has accessible loading label
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGridSkeleton } from './ProductGridSkeleton';

describe('ProductGridSkeleton', () => {
  // TC-FE-SKELETON-001
  it('should render 8 skeleton items by default', () => {
    render(<ProductGridSkeleton />);

    const container = screen.getByRole('status');
    // Each skeleton item is a div with skeleton elements
    const skeletonItems = container.querySelectorAll('.rounded-md.border');
    expect(skeletonItems).toHaveLength(8);
  });

  // TC-FE-SKELETON-002
  it('should render custom count of skeleton items', () => {
    render(<ProductGridSkeleton count={4} />);

    const container = screen.getByRole('status');
    const skeletonItems = container.querySelectorAll('.rounded-md.border');
    expect(skeletonItems).toHaveLength(4);
  });

  // TC-FE-SKELETON-003
  it('should have role="status" for accessibility', () => {
    render(<ProductGridSkeleton />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // TC-FE-SKELETON-004
  it('should have accessible loading label', () => {
    render(<ProductGridSkeleton />);

    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Loading products',
    );
  });

  it('should render visually hidden loading text for screen readers', () => {
    render(<ProductGridSkeleton />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('should render with count of 0', () => {
    render(<ProductGridSkeleton count={0} />);

    const container = screen.getByRole('status');
    const skeletonItems = container.querySelectorAll('.rounded-md.border');
    expect(skeletonItems).toHaveLength(0);
  });

  it('should render with large count', () => {
    render(<ProductGridSkeleton count={20} />);

    const container = screen.getByRole('status');
    const skeletonItems = container.querySelectorAll('.rounded-md.border');
    expect(skeletonItems).toHaveLength(20);
  });
});
