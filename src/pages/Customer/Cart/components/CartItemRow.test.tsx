/**
 * @file CartItemRow.test.tsx
 * @description Tests for the CartItemRow component
 *
 * Test Case IDs:
 * - TC-FE-CART-001: Should display product name and price
 * - TC-FE-CART-002: Should show quantity controls
 * - TC-FE-CART-003: Should call onQuantity when increase button clicked
 * - TC-FE-CART-004: Should call onQuantity when decrease button clicked
 * - TC-FE-CART-005: Should call onRemove when remove button clicked
 * - TC-FE-CART-006: Should disable buttons when disabled prop is true
 * - TC-FE-CART-007: Should show unavailable state for out-of-stock items
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartItemRow } from './CartItemRow';
import {
  createMockCartItem,
  createMockUnavailableCartItem,
} from '../../../../test/factories';

// Wrapper component with router
function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('CartItemRow', () => {
  const defaultProps = {
    item: createMockCartItem(),
    disabled: false,
    updating: false,
    removing: false,
    onQuantity: vi.fn(),
    onRemove: vi.fn(),
  };

  // TC-FE-CART-001
  it('should display product name and price', () => {
    // Arrange
    const item = createMockCartItem({
      name: 'Test Refrigerator',
      unitPrice: '25000.00',
      lineTotal: '25000.00'
    });

    // Act
    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} />
    );

    // Assert
    expect(screen.getByText('Test Refrigerator')).toBeInTheDocument();
    // Currency is formatted as "LKR 25,000.00"
    expect(screen.getByText(/LKR\s*25,000\.00/)).toBeInTheDocument();
  });

  // TC-FE-CART-002
  it('should show quantity controls', () => {
    // Arrange
    const item = createMockCartItem({ quantity: 2 });

    // Act
    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} />
    );

    // Assert
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase/i })).toBeInTheDocument();
  });

  // TC-FE-CART-003
  it('should call onQuantity with 1 when increase button clicked', async () => {
    // Arrange
    const mockOnQuantity = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(
      <CartItemRow {...defaultProps} onQuantity={mockOnQuantity} />
    );

    // Act
    await user.click(screen.getByRole('button', { name: /increase/i }));

    // Assert
    expect(mockOnQuantity).toHaveBeenCalledWith(1);
  });

  // TC-FE-CART-004
  it('should call onQuantity with -1 when decrease button clicked', async () => {
    // Arrange
    const mockOnQuantity = vi.fn();
    const item = createMockCartItem({ quantity: 2 });
    const user = userEvent.setup();

    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} onQuantity={mockOnQuantity} />
    );

    // Act
    await user.click(screen.getByRole('button', { name: /decrease/i }));

    // Assert
    expect(mockOnQuantity).toHaveBeenCalledWith(-1);
  });

  // TC-FE-CART-005
  it('should call onRemove when remove button clicked', async () => {
    // Arrange
    const mockOnRemove = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(
      <CartItemRow {...defaultProps} onRemove={mockOnRemove} />
    );

    // Act
    await user.click(screen.getByRole('button', { name: /remove/i }));

    // Assert
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  // TC-FE-CART-006
  it('should disable buttons when disabled prop is true', () => {
    // Arrange & Act
    renderWithRouter(
      <CartItemRow {...defaultProps} disabled={true} />
    );

    // Assert
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
  });

  // TC-FE-CART-007
  it('should show unavailable state for out-of-stock items', () => {
    // Arrange
    const item = createMockUnavailableCartItem();

    // Act
    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} />
    );

    // Assert - shows "Out of stock" text and unavailable message
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByText(/no longer available/i)).toBeInTheDocument();
  });

  it('should show updating state', () => {
    // Arrange & Act
    renderWithRouter(
      <CartItemRow {...defaultProps} updating={true} />
    );

    // Assert
    expect(screen.getByText(/updating/i)).toBeInTheDocument();
  });

  it('should show removing state', () => {
    // Arrange & Act
    renderWithRouter(
      <CartItemRow {...defaultProps} removing={true} />
    );

    // Assert
    expect(screen.getByText(/removing/i)).toBeInTheDocument();
  });

  it('should display line total', () => {
    // Arrange
    const item = createMockCartItem({ lineTotal: '50000.00' });

    // Act
    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} />
    );

    // Assert - format includes LKR prefix
    expect(screen.getByText(/LKR\s*50,000\.00/)).toBeInTheDocument();
  });

  it('should show stock warning when quantity exceeds available stock', () => {
    // Arrange - item is unavailable when quantity > stockQty
    const item = createMockCartItem({
      quantity: 5,
      stockQty: 3,
      isAvailable: false  // This triggers the warning display
    });

    // Act
    renderWithRouter(
      <CartItemRow {...defaultProps} item={item} />
    );

    // Assert - should show stock changed warning
    expect(screen.getByText(/stock has changed/i)).toBeInTheDocument();
  });
});
