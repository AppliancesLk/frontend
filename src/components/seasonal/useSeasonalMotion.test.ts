/**
 * @file useSeasonalMotion.test.ts
 * @description Tests for useSeasonalMotion hook
 *
 * Test Case IDs:
 * - TC-FE-MOTION-001: Returns not running when disabled
 * - TC-FE-MOTION-002: Returns not controllable when disabled
 * - TC-FE-MOTION-003: Returns paused state from sessionStorage
 * - TC-FE-MOTION-004: Toggle function updates paused state
 * - TC-FE-MOTION-005: Respects prefers-reduced-motion
 * - TC-FE-MOTION-006: Pauses when element not visible
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSeasonalMotion } from './useSeasonalMotion';

describe('useSeasonalMotion', () => {
  const mockMatchMedia = vi.fn();
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock sessionStorage
    const mockStorage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => mockStorage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key, value) => {
        mockStorage[key] = value;
      },
    );

    // Mock matchMedia
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Mock IntersectionObserver as a class
    class MockIntersectionObserver {
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
      constructor() {}
    }
    (window as typeof window & { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    // Mock document.hidden
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TC-FE-MOTION-001
  it('should return running=false when disabled', () => {
    const { result } = renderHook(() => useSeasonalMotion(false));

    expect(result.current.running).toBe(false);
  });

  // TC-FE-MOTION-002
  it('should return controllable=false when disabled', () => {
    const { result } = renderHook(() => useSeasonalMotion(false));

    expect(result.current.controllable).toBe(false);
  });

  // TC-FE-MOTION-003
  it('should read paused state from sessionStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

    const { result } = renderHook(() => useSeasonalMotion(true));

    expect(result.current.paused).toBe(true);
  });

  // TC-FE-MOTION-004
  it('should toggle paused state and save to sessionStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useSeasonalMotion(true));

    expect(result.current.paused).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.paused).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith('al-season-effects-paused', 'true');

    act(() => {
      result.current.toggle();
    });

    expect(result.current.paused).toBe(false);
    expect(setItemSpy).toHaveBeenCalledWith('al-season-effects-paused', 'false');
  });

  // TC-FE-MOTION-005
  it('should respect prefers-reduced-motion', () => {
    mockMatchMedia.mockReturnValue({
      matches: true, // User prefers reduced motion
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useSeasonalMotion(true));

    expect(result.current.controllable).toBe(false);
    expect(result.current.running).toBe(false);
  });

  // TC-FE-MOTION-006
  it('should return running=false when paused is true', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

    const { result } = renderHook(() => useSeasonalMotion(true));

    expect(result.current.paused).toBe(true);
    expect(result.current.running).toBe(false);
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useSeasonalMotion(true));

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('should handle sessionStorage errors gracefully when reading', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useSeasonalMotion(true));

    // Should default to false when storage fails
    expect(result.current.paused).toBe(false);
  });

  it('should handle sessionStorage errors gracefully when writing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useSeasonalMotion(true));

    // Should not throw when storage fails
    expect(() => {
      act(() => {
        result.current.toggle();
      });
    }).not.toThrow();

    // State should still update even if storage fails
    expect(result.current.paused).toBe(true);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useSeasonalMotion(true));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });

  it('should not set up observers when disabled', () => {
    renderHook(() => useSeasonalMotion(false));

    expect(mockObserve).not.toHaveBeenCalled();
    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it('should check connection.saveData if available', () => {
    const mockConnection = {
      saveData: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: mockConnection,
    });

    const { result } = renderHook(() => useSeasonalMotion(true));

    // Should not be allowed due to saveData
    expect(result.current.controllable).toBe(false);

    // Clean up
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
    });
  });
});
