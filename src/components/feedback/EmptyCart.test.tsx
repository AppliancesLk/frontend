/**
 * @file EmptyCart.test.tsx
 * @description Tests for EmptyCart component
 *
 * Test Case IDs:
 * - TC-FE-EMPTYCART-001: Renders empty cart message
 * - TC-FE-EMPTYCART-002: Renders continue shopping link
 * - TC-FE-EMPTYCART-003: Uses correct heading level
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { EmptyCart } from './EmptyCart';

describe('EmptyCart', () => {
  // TC-FE-EMPTYCART-001
  it('should render empty cart message', () => {
    renderWithProviders(<EmptyCart />);

    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  // TC-FE-EMPTYCART-002
  it('should render continue shopping link pointing to products', () => {
    renderWithProviders(<EmptyCart />);

    const link = screen.getByRole('link', { name: /continue shopping/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
  });

  // TC-FE-EMPTYCART-003
  it('should use h2 heading by default', () => {
    renderWithProviders(<EmptyCart />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should use h1 heading when specified', () => {
    renderWithProviders(<EmptyCart headingAs="h1" />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render description text', () => {
    renderWithProviders(<EmptyCart />);

    // Should have some descriptive text about empty cart
    // The text says "Find something for your home. Add an appliance to see it here."
    expect(screen.getByText(/find something/i)).toBeInTheDocument();
  });
});
