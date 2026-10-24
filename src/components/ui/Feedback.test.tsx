/**
 * @file Feedback.test.tsx
 * @description Tests for feedback UI components (Spinner, LoadingState, ErrorState, EmptyState, Alert)
 *
 * Test Case IDs:
 * - TC-FE-UI-001: Spinner should render with correct styling
 * - TC-FE-UI-002: LoadingState should show spinner and message
 * - TC-FE-UI-003: LoadingState compact mode should hide skeletons
 * - TC-FE-UI-004: ErrorState should display error message
 * - TC-FE-UI-005: ErrorState should show retry button when provided
 * - TC-FE-UI-006: EmptyState should display title and description
 * - TC-FE-UI-007: Alert should render with correct role based on severity
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Spinner, LoadingState, ErrorState, EmptyState, Alert } from './Feedback';

describe('Feedback Components', () => {
  describe('Spinner', () => {
    // TC-FE-UI-001
    it('should render with aria-hidden for accessibility', () => {
      // Arrange & Act
      const { container } = render(<Spinner />);

      // Assert
      const spinner = container.querySelector('.ui-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should accept custom className', () => {
      // Arrange & Act
      const { container } = render(<Spinner className="custom-class" />);

      // Assert
      const spinner = container.querySelector('.ui-spinner');
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('LoadingState', () => {
    // TC-FE-UI-002
    it('should show spinner and loading message', () => {
      // Arrange & Act
      render(<LoadingState label="Loading data..." />);

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    // TC-FE-UI-003
    it('should hide skeleton elements in compact mode', () => {
      // Arrange & Act
      const { container } = render(<LoadingState compact={true} />);

      // Assert
      expect(screen.getByRole('status')).toHaveClass('ui-loading-compact');
      expect(container.querySelector('.ui-skeleton')).not.toBeInTheDocument();
    });

    it('should show skeleton elements when not compact', () => {
      // Arrange & Act
      const { container } = render(<LoadingState compact={false} />);

      // Assert
      expect(container.querySelectorAll('.ui-skeleton').length).toBeGreaterThan(0);
    });

    it('should use default label when none provided', () => {
      // Arrange & Act
      render(<LoadingState />);

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    // TC-FE-UI-004
    it('should display error message', () => {
      // Arrange & Act
      render(<ErrorState message="Unable to load data" title="Error occurred" />);

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Error occurred' })).toBeInTheDocument();
      expect(screen.getByText('Unable to load data')).toBeInTheDocument();
    });

    // TC-FE-UI-005
    it('should show retry button when retry handler is provided', async () => {
      // Arrange
      const mockRetry = vi.fn();
      const user = userEvent.setup();

      // Act
      render(<ErrorState message="Failed to load" retry={mockRetry} />);

      // Assert
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();

      await user.click(retryButton);
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('should not show retry button when no retry handler provided', () => {
      // Arrange & Act
      render(<ErrorState message="Error occurred" />);

      // Assert
      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('should display custom title', () => {
      // Arrange & Act
      render(<ErrorState message="Error details" title="Custom Error Title" />);

      // Assert
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    // TC-FE-UI-006
    it('should display title and description', () => {
      // Arrange & Act
      render(
        <EmptyState
          title="No items found"
          description="Try adjusting your filters"
        />
      );

      // Assert
      expect(screen.getByRole('heading', { name: 'No items found' })).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });

    it('should render action element when provided', () => {
      // Arrange & Act
      render(
        <EmptyState
          title="Empty"
          action={<button>Add Item</button>}
        />
      );

      // Assert
      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });

    it('should use default title when none provided', () => {
      // Arrange & Act
      render(<EmptyState />);

      // Assert
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should render with custom heading level', () => {
      // Arrange & Act
      render(<EmptyState title="Empty" headingAs="h1" />);

      // Assert
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Empty');
    });
  });

  describe('Alert', () => {
    // TC-FE-UI-007
    it('should render with alert role for danger severity', () => {
      // Arrange & Act
      render(<Alert severity="danger">Error message</Alert>);

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render with status role for success severity', () => {
      // Arrange & Act
      render(<Alert severity="success">Success message</Alert>);

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should render with status role for info severity', () => {
      // Arrange & Act
      render(<Alert severity="info">Info message</Alert>);

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should use danger severity by default', () => {
      // Arrange & Act
      render(<Alert>Default alert</Alert>);

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      // Arrange & Act
      render(<Alert className="custom-alert">Alert content</Alert>);

      // Assert
      expect(screen.getByRole('alert')).toHaveClass('custom-alert');
    });
  });
});
