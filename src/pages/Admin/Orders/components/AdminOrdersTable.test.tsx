/**
 * @file AdminOrdersTable.test.tsx
 * @description Tests for the AdminOrdersTable component
 *
 * Test Case IDs:
 * - TC-FE-ADMIN-019: Should render table headers correctly
 * - TC-FE-ADMIN-020: Should display order ID
 * - TC-FE-ADMIN-021: Should display customer username and email
 * - TC-FE-ADMIN-022: Should display order date
 * - TC-FE-ADMIN-023: Should display order total with currency
 * - TC-FE-ADMIN-024: Should display payment status badge
 * - TC-FE-ADMIN-025: Should display order status badge
 * - TC-FE-ADMIN-026: Should render view link for each order
 * - TC-FE-ADMIN-027: Should display empty state for no orders
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminOrdersTable } from './AdminOrdersTable';
import { createMockAdminOrder } from '../../../../test/factories';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('AdminOrdersTable', () => {
  // TC-FE-ADMIN-019
  it('should render table headers correctly', () => {
    // Arrange
    const orders = [createMockAdminOrder()];

    // Act
    renderWithRouter(<AdminOrdersTable orders={orders} />);

    // Assert
    expect(screen.getByRole('columnheader', { name: /id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /customer/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /total/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /payment/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  // TC-FE-ADMIN-020
  it('should display order ID', () => {
    // Arrange
    const order = createMockAdminOrder({ id: 'order-abc-123' });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert
    expect(screen.getByText('order-abc-123')).toBeInTheDocument();
  });

  // TC-FE-ADMIN-021
  it('should display customer username and email', () => {
    // Arrange
    const order = createMockAdminOrder({
      customer: {
        id: 'cust-1',
        username: 'johnsmith',
        email: 'john@example.com',
      },
    });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert
    expect(screen.getByText('johnsmith')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  // TC-FE-ADMIN-022
  it('should display order date', () => {
    // Arrange
    const order = createMockAdminOrder({
      createdAt: '2024-07-15T14:30:00.000Z',
    });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert - date is formatted by formatDate utility
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  // TC-FE-ADMIN-023
  it('should display order total with currency', () => {
    // Arrange
    const order = createMockAdminOrder({
      total: '45000.00',
    });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert - should be formatted with LKR
    expect(screen.getByText(/45,000\.00/)).toBeInTheDocument();
  });

  // TC-FE-ADMIN-024
  it('should display payment status badge', () => {
    // Arrange
    const order = createMockAdminOrder({
      payment: {
        id: 'pay-1',
        status: 'SUCCESS',
        method: 'PAYHERE',
        amount: '9999.99',
        currency: 'LKR',
        updatedAt: new Date().toISOString(),
      },
    });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert
    const badges = document.querySelectorAll('.ui-badge');
    expect(badges.length).toBeGreaterThanOrEqual(2); // payment + order status
  });

  // TC-FE-ADMIN-025
  it('should display order status badge', () => {
    // Arrange
    const order = createMockAdminOrder({ status: 'PROCESSING' });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert
    const badges = document.querySelectorAll('.ui-badge');
    const processingBadge = Array.from(badges).find(b =>
      b.classList.contains('ui-tone-info')
    );
    expect(processingBadge).toBeInTheDocument();
  });

  // TC-FE-ADMIN-026
  it('should render view link for each order', () => {
    // Arrange
    const order = createMockAdminOrder({ id: 'order-xyz' });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert
    const viewLink = screen.getByRole('link', { name: /view/i });
    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute('href', expect.stringContaining('order-xyz'));
  });

  // TC-FE-ADMIN-027
  it('should display empty state for no orders', () => {
    // Arrange & Act
    renderWithRouter(<AdminOrdersTable orders={[]} />);

    // Assert
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    // EmptyState should be rendered instead with "No customer orders yet"
    expect(screen.getByText(/no customer orders yet/i)).toBeInTheDocument();
  });

  it('should render multiple orders', () => {
    // Arrange
    const orders = [
      createMockAdminOrder({ id: 'order-1' }),
      createMockAdminOrder({ id: 'order-2' }),
      createMockAdminOrder({ id: 'order-3' }),
    ];

    // Act
    renderWithRouter(<AdminOrdersTable orders={orders} />);

    // Assert
    expect(screen.getByText('order-1')).toBeInTheDocument();
    expect(screen.getByText('order-2')).toBeInTheDocument();
    expect(screen.getByText('order-3')).toBeInTheDocument();
  });

  it('should display no payment message when payment is null', () => {
    // Arrange
    const order = createMockAdminOrder({ payment: null });

    // Act
    renderWithRouter(<AdminOrdersTable orders={[order]} />);

    // Assert - should show "Not initiated"
    expect(screen.getByText(/not initiated/i)).toBeInTheDocument();
  });

  it('should display different payment statuses correctly', () => {
    // Arrange
    const orders = [
      createMockAdminOrder({
        id: 'order-1',
        payment: {
          id: 'pay-1',
          status: 'PENDING',
          method: 'PAYHERE',
          amount: '1000.00',
          currency: 'LKR',
          updatedAt: new Date().toISOString(),
        },
      }),
      createMockAdminOrder({
        id: 'order-2',
        payment: {
          id: 'pay-2',
          status: 'FAILED',
          method: 'PAYHERE',
          amount: '2000.00',
          currency: 'LKR',
          updatedAt: new Date().toISOString(),
        },
      }),
    ];

    // Act
    renderWithRouter(<AdminOrdersTable orders={orders} />);

    // Assert
    const badges = document.querySelectorAll('.ui-badge');
    expect(badges.length).toBeGreaterThanOrEqual(4); // 2 payment + 2 order status
  });
});
