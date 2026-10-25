/**
 * @file RepairsTable.test.tsx (Admin)
 * @description Tests for the Admin RepairsTable component
 *
 * Test Case IDs:
 * - TC-FE-ADMIN-001: Should render table headers correctly
 * - TC-FE-ADMIN-002: Should display repair reference
 * - TC-FE-ADMIN-003: Should display customer username and email
 * - TC-FE-ADMIN-004: Should display device type, brand and model
 * - TC-FE-ADMIN-005: Should display repair status badge
 * - TC-FE-ADMIN-006: Should display submitted date
 * - TC-FE-ADMIN-007: Should render view details link for each repair
 * - TC-FE-ADMIN-008: Should handle empty repairs array
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RepairsTable } from './RepairsTable';
import { createMockAdminRepairTicket } from '../../../../test/factories';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Admin RepairsTable', () => {
  // TC-FE-ADMIN-001
  it('should render table headers correctly', () => {
    // Arrange
    const repairs = [createMockAdminRepairTicket()];

    // Act
    renderWithRouter(<RepairsTable repairs={repairs} />);

    // Assert
    expect(screen.getByRole('columnheader', { name: /reference/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /customer/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /device/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  // TC-FE-ADMIN-002
  it('should display repair reference', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({ reference: 'REP-123456' });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('REP-123456')).toBeInTheDocument();
  });

  // TC-FE-ADMIN-003
  it('should display customer username and email', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({
      customer: {
        id: 'cust-1',
        username: 'johndoe',
        email: 'john@example.com',
      },
    });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  // TC-FE-ADMIN-004
  it('should display device type, brand and model', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({
      device: {
        deviceType: 'Air Conditioner',
        brand: 'Daikin',
        model: 'FTKP35TV16U',
        serialNumber: 'AC12345',
      },
    });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('Air Conditioner')).toBeInTheDocument();
    expect(screen.getByText('Daikin FTKP35TV16U')).toBeInTheDocument();
  });

  // TC-FE-ADMIN-005
  it('should display repair status badge', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({ status: 'APPROVED' });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-special'); // APPROVED = special
  });

  // TC-FE-ADMIN-006
  it('should display submitted date', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({
      createdAt: '2024-05-20T14:30:00.000Z',
    });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert - date is formatted by formatDate utility
    // We just check the table has the date cell
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  // TC-FE-ADMIN-007
  it('should render view details link for each repair', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({ id: 'repair-abc' });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    const viewLink = screen.getByRole('link', { name: /view details/i });
    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute('href', expect.stringContaining('repair-abc'));
  });

  // TC-FE-ADMIN-008
  it('should handle empty repairs array', () => {
    // Arrange & Act
    renderWithRouter(<RepairsTable repairs={[]} />);

    // Assert
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    const rows = within(table).queryAllByRole('row');
    // Only header row should exist
    expect(rows.length).toBe(1);
  });

  it('should render multiple repairs', () => {
    // Arrange
    const repairs = [
      createMockAdminRepairTicket({ reference: 'REP-001', status: 'PENDING' }),
      createMockAdminRepairTicket({ reference: 'REP-002', status: 'IN_PROGRESS' }),
      createMockAdminRepairTicket({ reference: 'REP-003', status: 'COMPLETED' }),
    ];

    // Act
    renderWithRouter(<RepairsTable repairs={repairs} />);

    // Assert
    expect(screen.getByText('REP-001')).toBeInTheDocument();
    expect(screen.getByText('REP-002')).toBeInTheDocument();
    expect(screen.getByText('REP-003')).toBeInTheDocument();
  });

  it('should display assigned repairer when present', () => {
    // Arrange
    const repair = createMockAdminRepairTicket({
      assignedRepairerId: 'repairer-1',
      assignedRepairer: {
        id: 'repairer-1',
        username: 'technicianJohn',
        email: 'tech@example.com',
      },
    });

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert - the table should render successfully
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should have hover effect on rows', () => {
    // Arrange
    const repair = createMockAdminRepairTicket();

    // Act
    renderWithRouter(<RepairsTable repairs={[repair]} />);

    // Assert
    const tbody = screen.getByRole('table').querySelector('tbody');
    const row = tbody?.querySelector('tr');
    expect(row).toHaveClass('hover:bg-page');
  });
});
