/**
 * @file SeasonalGreeting.test.tsx
 * @description Tests for SeasonalGreeting component
 *
 * Test Case IDs:
 * - TC-FE-GREETING-001: Returns null for DEFAULT theme
 * - TC-FE-GREETING-002: Returns null when showGreeting is false
 * - TC-FE-GREETING-003: Renders greeting content for active theme
 * - TC-FE-GREETING-004: Shows motion toggle when animations enabled
 * - TC-FE-GREETING-005: Applies compact class when compact prop is true
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeasonalGreeting } from './SeasonalGreeting';
import { SeasonalThemeContext } from '../../context/seasonal-theme-context';
import type { ActiveSeasonalTheme } from '../../types/seasonal-theme.types';

// Mock the useSeasonalMotion hook
vi.mock('./useSeasonalMotion', () => ({
  useSeasonalMotion: vi.fn(() => ({
    ref: { current: null },
    running: false,
    controllable: false,
    paused: false,
    toggle: vi.fn(),
  })),
}));

// Mock SeasonalScene components
vi.mock('./SeasonalScene', () => ({
  SeasonalScene: () => <div data-testid="seasonal-scene">Scene</div>,
  SeasonalParticles: () => <div data-testid="seasonal-particles">Particles</div>,
}));

import { useSeasonalMotion } from './useSeasonalMotion';

const mockUseSeasonalMotion = vi.mocked(useSeasonalMotion);

const defaultTheme: ActiveSeasonalTheme = {
  theme: 'DEFAULT',
  showGreeting: false,
  headline: '',
  message: '',
  decorations: false,
  animations: false,
};

const christmasTheme: ActiveSeasonalTheme = {
  theme: 'CHRISTMAS',
  showGreeting: true,
  headline: 'Merry Christmas!',
  message: 'Wishing you joy and happiness',
  decorations: true,
  animations: true,
};

const easterTheme: ActiveSeasonalTheme = {
  theme: 'EASTER',
  showGreeting: true,
  headline: 'Happy Easter!',
  message: 'Cheers to a new beginning',
  decorations: true,
  animations: false,
};

function renderWithTheme(
  theme: ActiveSeasonalTheme,
  appearance?: ActiveSeasonalTheme,
  compact = false,
) {
  return render(
    <SeasonalThemeContext.Provider
      value={{ active: theme, refresh: async () => {} }}
    >
      <SeasonalGreeting appearance={appearance} compact={compact} />
    </SeasonalThemeContext.Provider>,
  );
}

describe('SeasonalGreeting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSeasonalMotion.mockReturnValue({
      ref: { current: null },
      running: false,
      controllable: false,
      paused: false,
      toggle: vi.fn(),
    });
  });

  // TC-FE-GREETING-001
  it('should return null for DEFAULT theme', () => {
    const { container } = renderWithTheme(defaultTheme);

    expect(container.firstChild).toBeNull();
  });

  // TC-FE-GREETING-002
  it('should return null when showGreeting is false', () => {
    const themeWithoutGreeting = {
      ...christmasTheme,
      showGreeting: false,
    };

    const { container } = renderWithTheme(themeWithoutGreeting);

    expect(container.firstChild).toBeNull();
  });

  // TC-FE-GREETING-003
  it('should render greeting content for active theme', () => {
    renderWithTheme(christmasTheme);

    expect(screen.getByText('Merry Christmas!')).toBeInTheDocument();
    expect(
      screen.getByText('Wishing you joy and happiness'),
    ).toBeInTheDocument();
  });

  // TC-FE-GREETING-004
  it('should show motion toggle when animations enabled and controllable', () => {
    mockUseSeasonalMotion.mockReturnValue({
      ref: { current: null },
      running: true,
      controllable: true,
      paused: false,
      toggle: vi.fn(),
    });

    renderWithTheme(christmasTheme);

    expect(
      screen.getByRole('button', { name: /pause|play/i }),
    ).toBeInTheDocument();
  });

  // TC-FE-GREETING-005
  it('should apply compact class when compact prop is true', () => {
    renderWithTheme(christmasTheme, undefined, true);

    const greeting = screen.getByRole('complementary');
    expect(greeting).toHaveClass('season-greeting-compact');
  });

  it('should not show motion toggle when not controllable', () => {
    mockUseSeasonalMotion.mockReturnValue({
      ref: { current: null },
      running: false,
      controllable: false,
      paused: false,
      toggle: vi.fn(),
    });

    renderWithTheme(christmasTheme);

    expect(
      screen.queryByRole('button', { name: /pause|play/i }),
    ).not.toBeInTheDocument();
  });

  it('should use appearance prop over context theme', () => {
    renderWithTheme(defaultTheme, christmasTheme);

    expect(screen.getByText('Merry Christmas!')).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    renderWithTheme(christmasTheme);

    const greeting = screen.getByRole('complementary');
    expect(greeting).toHaveAttribute('aria-label');
  });

  it('should render SeasonalScene when decorations enabled', () => {
    renderWithTheme(christmasTheme);

    expect(screen.getByTestId('seasonal-scene')).toBeInTheDocument();
  });

  it('should render SeasonalParticles when both decorations and animations enabled', () => {
    renderWithTheme(christmasTheme);

    expect(screen.getByTestId('seasonal-particles')).toBeInTheDocument();
  });

  it('should not render SeasonalParticles when animations disabled', () => {
    renderWithTheme(easterTheme);

    expect(screen.queryByTestId('seasonal-particles')).not.toBeInTheDocument();
  });

  it('should set data-motion attribute based on running state', () => {
    mockUseSeasonalMotion.mockReturnValue({
      ref: { current: null },
      running: true,
      controllable: true,
      paused: false,
      toggle: vi.fn(),
    });

    renderWithTheme(christmasTheme);

    const greeting = screen.getByRole('complementary');
    expect(greeting).toHaveAttribute('data-motion', 'running');
  });

  it('should show play icon when paused', () => {
    mockUseSeasonalMotion.mockReturnValue({
      ref: { current: null },
      running: false,
      controllable: true,
      paused: true,
      toggle: vi.fn(),
    });

    renderWithTheme(christmasTheme);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should render occasion text', () => {
    renderWithTheme(christmasTheme);

    // Should render the occasion from seasonalPresets
    const occasion = document.querySelector('.season-occasion');
    expect(occasion).toBeInTheDocument();
  });
});
