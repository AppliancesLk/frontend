/**
 * @file CustomerRepairsTable.test.tsx
 * @description Tests for the CustomerRepairsTable component
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-019: Should render table headers correctly
 * - TC-FE-REPAIR-020: Should display repair ticket reference
 * - TC-FE-REPAIR-021: Should display device brand and model
 * - TC-FE-REPAIR-022: Should display problem description
 * - TC-FE-REPAIR-023: Should display repair status badge
 * - TC-FE-REPAIR-024: Should display formatted update date
 * - TC-FE-REPAIR-025: Should render correct link for each repair
 * - TC-FE-REPAIR-026: Should handle empty repairs array
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CustomerRepairsTable } from './CustomerRepairsTable';
import {
  createMockRepairTicket,
  createMockRepairTickets,
} from '../../../../test/factories';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('CustomerRepairsTable', () => {
  // TC-FE-REPAIR-019
  it('should render table headers correctly', () => {
    // Arrange
    const repairs = createMockRepairTickets(1);

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={repairs} />);

    // Assert
    expect(screen.getByRole('columnheader', { name: /reference/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /device/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /updated/i })).toBeInTheDocument();
  });

  // TC-FE-REPAIR-020
  it('should display repair ticket reference', () => {
    // Arrange
    const repair = createMockRepairTicket({ reference: 'REP-001234' });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('REP-001234')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-021
  it('should display device brand and model', () => {
    // Arrange
    const repair = createMockRepairTicket({
      device: {
        deviceType: 'Washing Machine',
        brand: 'LG',
        model: 'WM3600HWA',
        serialNumber: 'SN12345',
      },
    });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('LG WM3600HWA')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-022
  it('should display problem description', () => {
    // Arrange
    const repair = createMockRepairTicket({
      problemDescription: 'Not spinning properly',
    });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert
    expect(screen.getByText('Not spinning properly')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-023
  it('should display repair status badge', () => {
    // Arrange
    const repair = createMockRepairTicket({ status: 'IN_PROGRESS' });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert
    const badge = document.querySelector('.ui-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-tone-info');
  });

  // TC-FE-REPAIR-024
  it('should display formatted update date', () => {
    // Arrange
    const repair = createMockRepairTicket({
      updatedAt: '2024-06-15T10:30:00.000Z',
    });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert - find the time element directly
    const timeElement = document.querySelector('time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('datetime', '2024-06-15T10:30:00.000Z');
  });

  // TC-FE-REPAIR-025
  it('should render correct link for each repair', () => {
    // Arrange
    const repair = createMockRepairTicket({
      id: 'repair-123',
      reference: 'REP-000123',
    });

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={[repair]} />);

    // Assert
    const link = screen.getByRole('link', { name: 'REP-000123' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('repair-123'));
  });

  // TC-FE-REPAIR-026
  it('should handle empty repairs array', () => {
    // Arrange & Act
    renderWithRouter(<CustomerRepairsTable repairs={[]} />);

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
      createMockRepairTicket({ reference: 'REP-000001', status: 'PENDING' }),
      createMockRepairTicket({ reference: 'REP-000002', status: 'IN_PROGRESS' }),
      createMockRepairTicket({ reference: 'REP-000003', status: 'COMPLETED' }),
    ];

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={repairs} />);

    // Assert
    expect(screen.getByText('REP-000001')).toBeInTheDocument();
    expect(screen.getByText('REP-000002')).toBeInTheDocument();
    expect(screen.getByText('REP-000003')).toBeInTheDocument();
  });

  it('should display different status badges for different statuses', () => {
    // Arrange
    const repairs = [
      createMockRepairTicket({ reference: 'REP-001', status: 'PENDING' }),
      createMockRepairTicket({ reference: 'REP-002', status: 'COMPLETED' }),
    ];

    // Act
    renderWithRouter(<CustomerRepairsTable repairs={repairs} />);

    // Assert
    const badges = document.querySelectorAll('.ui-badge');
    expect(badges.length).toBe(2);
    expect(badges[0]).toHaveClass('ui-tone-warning'); // PENDING
    expect(badges[1]).toHaveClass('ui-tone-success'); // COMPLETED
  });
});
