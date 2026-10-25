/**
 * @file Price.test.tsx
 * @description Tests for Price component
 *
 * Test Case IDs:
 * - TC-FE-PRICE-001: Renders LKR currency label
 * - TC-FE-PRICE-002: Formats number value correctly
 * - TC-FE-PRICE-003: Formats string value correctly
 * - TC-FE-PRICE-004: Applies custom className
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Price } from './Price';

describe('Price', () => {
  // TC-FE-PRICE-001
  it('should render LKR currency label', () => {
    render(<Price value={1000} />);

    expect(screen.getByText('LKR')).toBeInTheDocument();
  });

  // TC-FE-PRICE-002
  it('should format number value with commas', () => {
    render(<Price value={1234567} />);

    // Should contain formatted price without the "LKR " prefix
    const priceText = screen.getByText('LKR').parentElement?.textContent;
    expect(priceText).toContain('1,234,567');
  });

  // TC-FE-PRICE-003
  it('should format string value correctly', () => {
    render(<Price value="9999.99" />);

    const priceText = screen.getByText('LKR').parentElement?.textContent;
    expect(priceText).toContain('9,999.99');
  });

  // TC-FE-PRICE-004
  it('should apply custom className', () => {
    render(<Price value={100} className="text-lg font-bold" />);

    const priceElement = screen.getByText('LKR').closest('.price');
    expect(priceElement).toHaveClass('text-lg');
    expect(priceElement).toHaveClass('font-bold');
  });

  it('should have default price class', () => {
    render(<Price value={100} />);

    const priceElement = document.querySelector('.price');
    expect(priceElement).toBeInTheDocument();
  });

  it('should format decimal values', () => {
    render(<Price value={199.5} />);

    const priceText = screen.getByText('LKR').parentElement?.textContent;
    expect(priceText).toContain('199.50') || expect(priceText).toContain('199.5');
  });

  it('should handle zero value', () => {
    render(<Price value={0} />);

    const priceText = screen.getByText('LKR').parentElement?.textContent;
    expect(priceText).toContain('0');
  });

  it('should handle large values', () => {
    render(<Price value={99999999} />);

    const priceText = screen.getByText('LKR').parentElement?.textContent;
    expect(priceText).toContain('99,999,999');
  });

  it('should render non-breaking space between LKR and amount', () => {
    render(<Price value={100} />);

    const priceElement = document.querySelector('.price');
    // Non-breaking space is \u00a0
    expect(priceElement?.textContent).toContain('\u00a0');
  });
});
