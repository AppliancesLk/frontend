/**
 * @file CatalogFeedback.test.tsx
 * @description Tests for CatalogFeedback component
 *
 * Test Case IDs:
 * - TC-FE-FEEDBACK-001: Renders LoadingState when loading is true
 * - TC-FE-FEEDBACK-002: Renders ErrorState when error is present
 * - TC-FE-FEEDBACK-003: Renders nothing when not loading and no error
 * - TC-FE-FEEDBACK-004: Calls retry function when retry button clicked
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogFeedback } from './CatalogFeedback';

describe('CatalogFeedback', () => {
  // TC-FE-FEEDBACK-001
  it('should render LoadingState when loading is true', () => {
    render(<CatalogFeedback loading={true} error="" retry={() => {}} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // TC-FE-FEEDBACK-002
  it('should render ErrorState with message when error is present', () => {
    render(
      <CatalogFeedback
        loading={false}
        error="Failed to load products"
        retry={() => {}}
      />,
    );

    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
  });

  // TC-FE-FEEDBACK-003
  it('should render nothing when not loading and no error', () => {
    const { container } = render(
      <CatalogFeedback loading={false} error="" retry={() => {}} />,
    );

    expect(container.firstChild).toBeNull();
  });

  // TC-FE-FEEDBACK-004
  it('should call retry function when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();

    render(
      <CatalogFeedback
        loading={false}
        error="Network error"
        retry={mockRetry}
      />,
    );

    // The button might have text like "Try again" instead of "Retry"
    const retryButton = screen.getByRole('button', { name: /try again|retry/i });
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should prioritize loading over error state', () => {
    render(
      <CatalogFeedback
        loading={true}
        error="Some error"
        retry={() => {}}
      />,
    );

    // Should show loading, not error
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Some error')).not.toBeInTheDocument();
  });
});
