/**
 * @file OfflineBanner.test.tsx
 * @description Tests for OfflineBanner component
 *
 * Test Case IDs:
 * - TC-FE-OFFLINE-001: Renders nothing when online
 * - TC-FE-OFFLINE-002: Renders offline message when offline
 * - TC-FE-OFFLINE-003: Has correct accessibility attributes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner', () => {
  const originalNavigator = window.navigator;
  let onlineGetter: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock navigator.onLine
    onlineGetter = vi.spyOn(window.navigator, 'onLine', 'get');
  });

  afterEach(() => {
    onlineGetter.mockRestore();
  });

  // TC-FE-OFFLINE-001
  it('should render nothing when online', () => {
    onlineGetter.mockReturnValue(true);

    const { container } = render(<OfflineBanner />);

    expect(container.firstChild).toBeNull();
  });

  // TC-FE-OFFLINE-002
  it('should render offline message when offline', () => {
    onlineGetter.mockReturnValue(false);

    render(<OfflineBanner />);

    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  // TC-FE-OFFLINE-003
  it('should have role="status" for accessibility', () => {
    onlineGetter.mockReturnValue(false);

    render(<OfflineBanner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should update when online status changes', () => {
    onlineGetter.mockReturnValue(true);

    const { rerender } = render(<OfflineBanner />);
    expect(screen.queryByRole('status')).toBeNull();

    // Simulate going offline
    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // Force rerender to pick up state change
    rerender(<OfflineBanner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
