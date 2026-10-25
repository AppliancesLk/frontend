/**
 * @file Rating.test.tsx
 * @description Tests for Rating component
 *
 * Test Case IDs:
 * - TC-FE-RATING-001: Renders correct number of stars
 * - TC-FE-RATING-002: Shows average rating value
 * - TC-FE-RATING-003: Shows review count
 * - TC-FE-RATING-004: Shows no ratings message when count is 0
 * - TC-FE-RATING-005: Has accessible aria-label
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rating } from './Rating';

describe('Rating', () => {
  // TC-FE-RATING-001
  it('should render 5 star SVGs', () => {
    render(<Rating average={4} count={10} />);

    const stars = document.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  // TC-FE-RATING-002
  it('should show formatted average rating value', () => {
    render(<Rating average={4.5} count={10} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should format average to one decimal place', () => {
    render(<Rating average={4.567} count={10} />);

    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  // TC-FE-RATING-003
  it('should show review count in parentheses', () => {
    render(<Rating average={4} count={150} />);

    expect(screen.getByText('(150)')).toBeInTheDocument();
  });

  it('should format large review counts with locale', () => {
    render(<Rating average={4} count={1500} />);

    // Should show localized format (e.g., "1,500")
    expect(screen.getByText(/1,?500/)).toBeInTheDocument();
  });

  // TC-FE-RATING-004
  it('should show no ratings message when count is 0', () => {
    render(<Rating average={0} count={0} />);

    // The text is shown in fg-muted class
    const noRatingsText = document.querySelector('.text-fg-muted');
    expect(noRatingsText).toBeInTheDocument();
  });

  // TC-FE-RATING-005
  it('should have accessible aria-label with rating info', () => {
    render(<Rating average={4.5} count={100} />);

    const container = screen.getByLabelText(/4\.5 out of 5.*100 reviews/i);
    expect(container).toBeInTheDocument();
  });

  it('should have appropriate aria-label when count is 0', () => {
    render(<Rating average={0} count={0} />);

    // When count is 0, there's still an aria-label
    const container = document.querySelector('[aria-label]');
    expect(container).toBeInTheDocument();
  });

  it('should clamp average to max of 5', () => {
    render(<Rating average={6} count={10} />);

    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('should clamp average to min of 0', () => {
    render(<Rating average={-1} count={10} />);

    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('should accept string for average', () => {
    render(<Rating average="4.5" count={10} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should hide stars from screen readers', () => {
    render(<Rating average={4} count={10} />);

    const starsContainer = document.querySelector('[aria-hidden="true"]');
    expect(starsContainer).toBeInTheDocument();
  });
});
