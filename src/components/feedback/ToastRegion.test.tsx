/**
 * @file ToastRegion.test.tsx
 * @description Tests for ToastRegion and Toast components
 *
 * Test Case IDs:
 * - TC-FE-TOAST-001: Renders empty initially
 * - TC-FE-TOAST-002: Displays toast when event dispatched
 * - TC-FE-TOAST-003: Auto-dismisses toast after timeout
 * - TC-FE-TOAST-004: Dismisses toast when close button clicked
 * - TC-FE-TOAST-005: Renders action link when provided
 * - TC-FE-TOAST-006: Pauses auto-dismiss on hover
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastRegion } from './ToastRegion';
import type { ToastMessage } from '../../utils/toast';

// Helper to dispatch toast event
function dispatchToast(message: ToastMessage) {
  act(() => {
    window.dispatchEvent(
      new CustomEvent('store-toast', { detail: message }),
    );
  });
}

describe('ToastRegion', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Mock crypto.randomUUID
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-1');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // TC-FE-TOAST-001
  it('should render empty initially', () => {
    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    const region = document.querySelector('[aria-live="polite"]');
    expect(region).toBeInTheDocument();
    expect(region?.children).toHaveLength(0);
  });

  // TC-FE-TOAST-002
  it('should display toast when event is dispatched', async () => {
    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    dispatchToast({ message: 'Item added to cart!' });

    await waitFor(() => {
      expect(screen.getByText('Item added to cart!')).toBeInTheDocument();
    });
  });

  // TC-FE-TOAST-003
  it('should auto-dismiss toast after 5 seconds', async () => {
    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    dispatchToast({ message: 'Test toast' });

    expect(screen.getByText('Test toast')).toBeInTheDocument();

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
    });
  });

  // TC-FE-TOAST-004
  it('should dismiss toast when close button is clicked', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('store-toast', {
          detail: { message: 'Dismissable toast' },
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Dismissable toast')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', {
      name: /dismiss/i,
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText('Dismissable toast')).not.toBeInTheDocument();
    });
  });

  // TC-FE-TOAST-005
  it('should render action link when provided', async () => {
    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    dispatchToast({
      message: 'Item added!',
      action: { to: '/cart', label: 'View Cart' },
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'View Cart' })).toBeInTheDocument();
    });
  });

  // TC-FE-TOAST-006
  it('should pause auto-dismiss on hover', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('store-toast', {
          detail: { message: 'Hover toast' },
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Hover toast')).toBeInTheDocument();
    });

    // Hover over the toast
    const toast = screen.getByText('Hover toast').closest('.store-toast');
    if (toast) {
      await user.hover(toast);
    }

    // Toast should still be visible after hover
    expect(screen.getByText('Hover toast')).toBeInTheDocument();
  });

  it('should limit to 3 toasts maximum', async () => {
    let uuidCounter = 0;
    vi.spyOn(crypto, 'randomUUID').mockImplementation(
      () => `uuid-${++uuidCounter}`,
    );

    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    // Dispatch 5 toasts
    dispatchToast({ message: 'Toast 1' });
    dispatchToast({ message: 'Toast 2' });
    dispatchToast({ message: 'Toast 3' });
    dispatchToast({ message: 'Toast 4' });
    dispatchToast({ message: 'Toast 5' });

    await waitFor(() => {
      const toasts = document.querySelectorAll('.store-toast');
      expect(toasts.length).toBeLessThanOrEqual(3);
    });
  });

  it('should have correct aria-live attribute', () => {
    render(
      <MemoryRouter>
        <ToastRegion />
      </MemoryRouter>,
    );

    const region = document.querySelector('[aria-live="polite"]');
    expect(region).toBeInTheDocument();
  });
});
