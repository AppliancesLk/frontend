/**
 * @file Icon.test.tsx
 * @description Tests for Icon component
 *
 * Test Case IDs:
 * - TC-FE-ICON-001: Renders SVG element
 * - TC-FE-ICON-002: Has correct path for each icon name
 * - TC-FE-ICON-003: Applies default className
 * - TC-FE-ICON-004: Applies custom className
 * - TC-FE-ICON-005: Has aria-hidden for accessibility
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, type IconName } from './Icon';

describe('Icon', () => {
  // TC-FE-ICON-001
  it('should render an SVG element', () => {
    render(<Icon name="home" />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // TC-FE-ICON-002
  it('should render correct path for each icon', () => {
    const iconNames: IconName[] = [
      'mail',
      'copy',
      'menu',
      'close',
      'chat',
      'info',
      'trash',
      'bag',
      'shield',
      'truck',
      'lock',
      'phone',
      'laptop',
      'headphones',
      'watch',
      'appliance',
      'filter',
      'home',
      'cart',
      'orders',
      'repair',
      'user',
      'search',
      'arrow',
      'grid',
      'check',
    ];

    for (const name of iconNames) {
      const { container } = render(<Icon name={name} />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
      // Path should not be empty
      expect(path?.getAttribute('d')?.length).toBeGreaterThan(0);
    }
  });

  // TC-FE-ICON-003
  it('should apply default className of h-5 w-5', () => {
    render(<Icon name="home" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('h-5');
    expect(svg).toHaveClass('w-5');
  });

  // TC-FE-ICON-004
  it('should apply custom className', () => {
    render(<Icon name="home" className="h-8 w-8 text-red-500" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('h-8');
    expect(svg).toHaveClass('w-8');
    expect(svg).toHaveClass('text-red-500');
  });

  // TC-FE-ICON-005
  it('should have aria-hidden="true" for accessibility', () => {
    render(<Icon name="home" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have correct viewBox', () => {
    render(<Icon name="home" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should have correct stroke properties', () => {
    render(<Icon name="home" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '1.75');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('should render different paths for different icons', () => {
    const { container: container1 } = render(<Icon name="home" />);
    const path1 = container1.querySelector('path')?.getAttribute('d');

    const { container: container2 } = render(<Icon name="cart" />);
    const path2 = container2.querySelector('path')?.getAttribute('d');

    expect(path1).not.toBe(path2);
  });
});
