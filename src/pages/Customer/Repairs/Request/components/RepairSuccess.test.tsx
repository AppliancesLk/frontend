/**
 * @file RepairSuccess.test.tsx
 * @description Tests for the RepairSuccess component
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-037: Should display success confirmation heading
 * - TC-FE-REPAIR-038: Should display repair reference number
 * - TC-FE-REPAIR-039: Should display device information
 * - TC-FE-REPAIR-040: Should display repair status
 * - TC-FE-REPAIR-041: Should render view repair link with correct path
 * - TC-FE-REPAIR-042: Should render back to repairs link
 * - TC-FE-REPAIR-043: Should render continue shopping link
 * - TC-FE-REPAIR-044: Should have proper accessibility label
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RepairSuccess } from './RepairSuccess';
import { createMockRepairTicket } from '../../../../../test/factories';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RepairSuccess', () => {
  // TC-FE-REPAIR-037
  it('should display success confirmation heading', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    expect(screen.getByRole('heading', { name: /repair request submitted/i })).toBeInTheDocument();
  });

  // TC-FE-REPAIR-038
  it('should display repair reference number', () => {
    // Arrange
    const ticket = createMockRepairTicket({ reference: 'REP-001234' });

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert - reference appears multiple times (title + row), check at least one exists
    const references = screen.getAllByText('REP-001234');
    expect(references.length).toBeGreaterThanOrEqual(1);
  });

  // TC-FE-REPAIR-039
  it('should display device information', () => {
    // Arrange
    const ticket = createMockRepairTicket({
      device: {
        deviceType: 'Washing Machine',
        brand: 'Samsung',
        model: 'WF45R6100AW',
      },
    });

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    expect(screen.getByText('Samsung WF45R6100AW')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-040
  it('should display repair status', () => {
    // Arrange
    const ticket = createMockRepairTicket({ status: 'PENDING' });

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    // Status should be displayed (translations may vary)
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  // TC-FE-REPAIR-041
  it('should render view repair link with correct path', () => {
    // Arrange
    const ticket = createMockRepairTicket({ id: 'repair-123' });

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    const viewRepairLink = screen.getByRole('link', { name: /view repair/i });
    expect(viewRepairLink).toBeInTheDocument();
    expect(viewRepairLink).toHaveAttribute('href', expect.stringContaining('repair-123'));
  });

  // TC-FE-REPAIR-042
  it('should render back to repairs link', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    const backLink = screen.getByRole('link', { name: /back to your repairs/i });
    expect(backLink).toBeInTheDocument();
  });

  // TC-FE-REPAIR-043
  it('should render continue shopping link', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    const shopLink = screen.getByRole('link', { name: /continue shopping/i });
    expect(shopLink).toBeInTheDocument();
  });

  // TC-FE-REPAIR-044
  it('should have proper accessibility label', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    const section = screen.getByRole('region', { name: /repair request confirmation/i });
    expect(section).toBeInTheDocument();
  });

  it('should display success icon', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert - check for success styling
    const iconContainer = document.querySelector('.bg-success-bg');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should display helpful message', () => {
    // Arrange
    const ticket = createMockRepairTicket();

    // Act
    renderWithRouter(<RepairSuccess ticket={ticket} />);

    // Assert
    expect(screen.getByText(/we have your request/i)).toBeInTheDocument();
  });
});
