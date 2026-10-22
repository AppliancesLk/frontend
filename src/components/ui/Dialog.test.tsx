/**
 * @file Dialog.test.tsx
 * @description Tests for the Dialog component
 *
 * Test Case IDs:
 * - TC-FE-UI-008: Should not render when open is false
 * - TC-FE-UI-009: Should render title and description when open
 * - TC-FE-UI-010: Should call onClose when close button clicked
 * - TC-FE-UI-011: Should have proper accessibility attributes
 * - TC-FE-UI-012: Should support drawer mode
 * - TC-FE-UI-013: Should disable close button when busy
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

// Helper to get dialog element (dialog elements may not be "visible" in JSDOM without showModal)
function getDialog() {
  return screen.getByRole('dialog', { hidden: true });
}

function queryDialog() {
  return screen.queryByRole('dialog', { hidden: true });
}

describe('Dialog', () => {
  // TC-FE-UI-008
  it('should not render when open is false', () => {
    // Arrange & Act
    render(
      <Dialog open={false} onClose={vi.fn()} title="Test Dialog">
        Dialog content
      </Dialog>
    );

    // Assert
    expect(queryDialog()).not.toBeInTheDocument();
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  // TC-FE-UI-009
  it('should render title and description when open', () => {
    // Arrange & Act
    render(
      <Dialog
        open={true}
        onClose={vi.fn()}
        title="Test Dialog"
        description="This is a test description"
      >
        Dialog content
      </Dialog>
    );

    // Assert
    expect(getDialog()).toBeInTheDocument();
    // Use hidden: true for elements inside dialog which may not be "visible" to a11y tree in JSDOM
    expect(screen.getByRole('heading', { name: 'Test Dialog', hidden: true })).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  // TC-FE-UI-010
  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const mockOnClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog open={true} onClose={mockOnClose} title="Closeable Dialog">
        Content
      </Dialog>
    );

    // Act
    const closeButton = screen.getByRole('button', { name: /close/i, hidden: true });
    await user.click(closeButton);

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // TC-FE-UI-011
  it('should have proper accessibility attributes', () => {
    // Arrange & Act
    render(
      <Dialog
        open={true}
        onClose={vi.fn()}
        title="Accessible Dialog"
        description="Dialog description"
      >
        Content
      </Dialog>
    );

    // Assert
    const dialog = getDialog();
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  // TC-FE-UI-012
  it('should apply drawer class when drawer prop is true', () => {
    // Arrange & Act
    render(
      <Dialog open={true} onClose={vi.fn()} title="Drawer Dialog" drawer={true}>
        Drawer content
      </Dialog>
    );

    // Assert
    const dialog = getDialog();
    expect(dialog).toHaveClass('ui-drawer');
  });

  // TC-FE-UI-013
  it('should disable close button when busy', () => {
    // Arrange & Act
    render(
      <Dialog open={true} onClose={vi.fn()} title="Busy Dialog" busy={true}>
        Processing...
      </Dialog>
    );

    // Assert
    const closeButton = screen.getByRole('button', { name: /close/i, hidden: true });
    expect(closeButton).toBeDisabled();
  });

  it('should not call onClose when busy and close button clicked', async () => {
    // Arrange
    const mockOnClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog open={true} onClose={mockOnClose} title="Busy Dialog" busy={true}>
        Processing...
      </Dialog>
    );

    // Act
    const closeButton = screen.getByRole('button', { name: /close/i, hidden: true });
    await user.click(closeButton);

    // Assert
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render children content', () => {
    // Arrange & Act
    render(
      <Dialog open={true} onClose={vi.fn()} title="Dialog with Form">
        <form>
          <input type="text" placeholder="Enter value" />
          <button type="submit">Submit</button>
        </form>
      </Dialog>
    );

    // Assert
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit', hidden: true })).toBeInTheDocument();
  });

  it('should not have aria-describedby when no description provided', () => {
    // Arrange & Act
    render(
      <Dialog open={true} onClose={vi.fn()} title="No Description Dialog">
        Content
      </Dialog>
    );

    // Assert
    const dialog = getDialog();
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog.getAttribute('aria-describedby')).toBeNull();
  });
});
