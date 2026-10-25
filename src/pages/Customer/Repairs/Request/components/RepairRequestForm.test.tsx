/**
 * @file RepairRequestForm.test.tsx
 * @description Tests for the RepairRequestForm component
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-027: Should render all required form fields
 * - TC-FE-REPAIR-028: Should render optional fields with (optional) label
 * - TC-FE-REPAIR-029: Should display field hints
 * - TC-FE-REPAIR-030: Should display validation errors
 * - TC-FE-REPAIR-031: Should call change handler when input changes
 * - TC-FE-REPAIR-032: Should call submit handler on form submission
 * - TC-FE-REPAIR-033: Should disable form fields when submitting
 * - TC-FE-REPAIR-034: Should show submitting state on button
 * - TC-FE-REPAIR-035: Should display character count for problem description
 * - TC-FE-REPAIR-036: Should display API error message
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepairRequestForm } from './RepairRequestForm';
import type { RepairRequestDraft, RepairRequestErrors } from '../types/repair-request.types';
import type { RepairTicket } from '../../../../../types/repair.types';
import type { useRepairRequest } from '../hooks/useRepairRequest';

type RepairRequestPage = ReturnType<typeof useRepairRequest>;

function createMockPage(overrides: Partial<RepairRequestPage> = {}): RepairRequestPage {
  const defaultDraft: RepairRequestDraft = {
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    problemDescription: '',
  };

  return {
    draft: defaultDraft,
    errors: {} as RepairRequestErrors,
    error: '',
    submitting: false,
    createdTicket: null as RepairTicket | null,
    change: vi.fn(),
    submit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('RepairRequestForm', () => {
  // TC-FE-REPAIR-027
  it('should render all required form fields', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    expect(screen.getByLabelText(/device type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    // Problem description textarea uses a different ID pattern
    expect(document.getElementById('repair-problemDescription')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-028
  it('should render optional fields with (optional) label', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const serialNumberLabel = screen.getByText(/serial number/i).closest('label');
    const purchaseDateLabel = screen.getByText(/purchase date/i).closest('label');

    expect(serialNumberLabel?.textContent).toContain('optional');
    expect(purchaseDateLabel?.textContent).toContain('optional');
  });

  // TC-FE-REPAIR-029
  it('should display field hints', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert - hints contain descriptive text
    // Check that hint elements exist (they have specific IDs)
    expect(document.getElementById('deviceType-hint')).toBeInTheDocument();
    expect(document.getElementById('brand-hint')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-030
  it('should display validation errors', () => {
    // Arrange
    const page = createMockPage({
      errors: {
        deviceType: 'Device type is required',
        brand: 'Brand is required',
        problemDescription: 'Problem description must be at least 10 characters',
      },
    });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    expect(screen.getByText('Device type is required')).toBeInTheDocument();
    expect(screen.getByText('Brand is required')).toBeInTheDocument();
    expect(screen.getByText('Problem description must be at least 10 characters')).toBeInTheDocument();
  });

  // TC-FE-REPAIR-031
  it('should call change handler when input changes', async () => {
    // Arrange
    const mockChange = vi.fn();
    const page = createMockPage({ change: mockChange });
    const user = userEvent.setup();

    // Act
    render(<RepairRequestForm page={page} />);
    const deviceTypeInput = screen.getByLabelText(/device type/i);
    await user.type(deviceTypeInput, 'R');

    // Assert
    expect(mockChange).toHaveBeenCalledWith('deviceType', 'R');
  });

  // TC-FE-REPAIR-032
  it('should call submit handler on form submission', async () => {
    // Arrange
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const page = createMockPage({ submit: mockSubmit });
    const user = userEvent.setup();

    // Act
    render(<RepairRequestForm page={page} />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Assert
    expect(mockSubmit).toHaveBeenCalled();
  });

  // TC-FE-REPAIR-033
  it('should disable form fields when submitting', () => {
    // Arrange
    const page = createMockPage({ submitting: true });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    expect(screen.getByLabelText(/device type/i)).toBeDisabled();
    expect(screen.getByLabelText(/brand/i)).toBeDisabled();
    expect(screen.getByLabelText(/model/i)).toBeDisabled();
    expect(screen.getByLabelText(/serial number/i)).toBeDisabled();
    expect(screen.getByLabelText(/purchase date/i)).toBeDisabled();
    expect(document.getElementById('repair-problemDescription')).toBeDisabled();
  });

  // TC-FE-REPAIR-034
  it('should show submitting state on button', () => {
    // Arrange
    const page = createMockPage({ submitting: true });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  // TC-FE-REPAIR-035
  it('should display character count for problem description', () => {
    // Arrange
    const page = createMockPage({
      draft: {
        deviceType: '',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        problemDescription: 'This is a test problem description',
      },
    });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert - character count is displayed
    expect(screen.getByText(/34 \/ 2000 characters/)).toBeInTheDocument();
  });

  // TC-FE-REPAIR-036
  it('should display API error message', () => {
    // Arrange
    const page = createMockPage({
      error: 'Failed to submit repair request. Please try again.',
    });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('Failed to submit repair request. Please try again.');
  });

  it('should have aria-invalid on fields with errors', () => {
    // Arrange
    const page = createMockPage({
      errors: {
        deviceType: 'Device type is required',
      },
    });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const deviceTypeInput = screen.getByLabelText(/device type/i);
    expect(deviceTypeInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-describedby linking to error message', () => {
    // Arrange
    const page = createMockPage({
      errors: {
        deviceType: 'Device type is required',
      },
    });

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const deviceTypeInput = screen.getByLabelText(/device type/i);
    expect(deviceTypeInput).toHaveAttribute('aria-describedby', 'deviceType-error');
    expect(document.getElementById('deviceType-error')).toHaveTextContent('Device type is required');
  });

  it('should render step numbers for form sections', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render form with proper structure', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert - check for section headings
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper maxLength on problem description', () => {
    // Arrange
    const page = createMockPage();

    // Act
    render(<RepairRequestForm page={page} />);

    // Assert
    const textarea = document.getElementById('repair-problemDescription');
    expect(textarea).toHaveAttribute('maxLength', '2000');
  });
});
