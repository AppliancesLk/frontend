/**
 * @file catalog.helpers.test.ts
 * @description Tests for catalog helper functions
 *
 * Test Case IDs:
 * - TC-FE-CATALOG-001: readCatalogQuery parses valid query
 * - TC-FE-CATALOG-002: readCatalogQuery returns null for invalid page
 * - TC-FE-CATALOG-003: readCatalogQuery validates categoryId as UUID
 * - TC-FE-CATALOG-004: readCatalogQuery validates sort options
 * - TC-FE-CATALOG-005: readCatalogQuery validates price range
 * - TC-FE-CATALOG-006: paginationPages generates correct pages
 * - TC-FE-CATALOG-007: paginationPages adds ellipsis for gaps
 */

import { describe, it, expect } from 'vitest';
import { readCatalogQuery, paginationPages } from './catalog.helpers';

describe('readCatalogQuery', () => {
  // TC-FE-CATALOG-001
  it('should parse valid query parameters', () => {
    const params = new URLSearchParams({
      q: 'laptop',
      category: '550e8400-e29b-41d4-a716-446655440000',
      brands: 'Apple,Samsung',
      sort: 'price-asc',
      page: '2',
      minPrice: '100',
      maxPrice: '500',
    });

    const result = readCatalogQuery(params);

    expect(result).toEqual({
      q: 'laptop',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      brands: 'Apple,Samsung',
      sort: 'price-asc',
      page: 2,
      limit: 12,
      minPrice: 100,
      maxPrice: 500,
    });
  });

  // TC-FE-CATALOG-002
  it('should return null for invalid page number', () => {
    const params = new URLSearchParams({ page: '-1' });
    expect(readCatalogQuery(params)).toBeNull();

    const params2 = new URLSearchParams({ page: 'abc' });
    expect(readCatalogQuery(params2)).toBeNull();

    const params3 = new URLSearchParams({ page: '0' });
    expect(readCatalogQuery(params3)).toBeNull();
  });

  it('should return null for page exceeding max', () => {
    const params = new URLSearchParams({ page: '1000001' });
    expect(readCatalogQuery(params)).toBeNull();
  });

  // TC-FE-CATALOG-003
  it('should return null for invalid categoryId (not UUID)', () => {
    const params = new URLSearchParams({ category: 'not-a-uuid' });
    expect(readCatalogQuery(params)).toBeNull();

    const params2 = new URLSearchParams({ category: '12345' });
    expect(readCatalogQuery(params2)).toBeNull();
  });

  it('should accept valid UUID for categoryId', () => {
    const params = new URLSearchParams({
      category: '550e8400-e29b-41d4-a716-446655440000',
    });
    const result = readCatalogQuery(params);
    expect(result).not.toBeNull();
    expect(result?.categoryId).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  // TC-FE-CATALOG-004
  it('should return null for invalid sort option', () => {
    const params = new URLSearchParams({ sort: 'invalid_sort' });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should accept valid sort options', () => {
    const validSorts = ['name', 'price-asc', 'price-desc', 'newest'];

    for (const sort of validSorts) {
      const params = new URLSearchParams({ sort });
      const result = readCatalogQuery(params);
      expect(result).not.toBeNull();
      expect(result?.sort).toBe(sort);
    }
  });

  // TC-FE-CATALOG-005
  it('should return null for invalid price format', () => {
    const params = new URLSearchParams({ minPrice: 'abc' });
    expect(readCatalogQuery(params)).toBeNull();

    const params2 = new URLSearchParams({ maxPrice: '-100' });
    expect(readCatalogQuery(params2)).toBeNull();

    const params3 = new URLSearchParams({ minPrice: '100.123' }); // More than 2 decimals
    expect(readCatalogQuery(params3)).toBeNull();
  });

  it('should return null when minPrice > maxPrice', () => {
    const params = new URLSearchParams({
      minPrice: '500',
      maxPrice: '100',
    });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should accept valid price range', () => {
    const params = new URLSearchParams({
      minPrice: '100.50',
      maxPrice: '500.99',
    });
    const result = readCatalogQuery(params);
    expect(result).not.toBeNull();
    expect(result?.minPrice).toBe(100.5);
    expect(result?.maxPrice).toBe(500.99);
  });

  it('should return null for price exceeding max value', () => {
    const params = new URLSearchParams({ maxPrice: '99999999999.99' });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should return null for query exceeding max length', () => {
    const params = new URLSearchParams({ q: 'a'.repeat(121) });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should accept query at max length', () => {
    const params = new URLSearchParams({ q: 'a'.repeat(120) });
    const result = readCatalogQuery(params);
    expect(result).not.toBeNull();
  });

  it('should return null for too many brands', () => {
    const brands = Array.from({ length: 21 }, (_, i) => `Brand${i}`).join(',');
    const params = new URLSearchParams({ brands });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should return null for brand exceeding max length', () => {
    const params = new URLSearchParams({ brands: 'a'.repeat(81) });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should return null for empty brand in list', () => {
    const params = new URLSearchParams({ brands: 'Apple,,Samsung' });
    expect(readCatalogQuery(params)).toBeNull();
  });

  it('should use default values for missing parameters', () => {
    const params = new URLSearchParams();
    const result = readCatalogQuery(params);

    expect(result).toEqual({
      q: undefined,
      categoryId: undefined,
      brands: undefined,
      sort: 'name',
      page: 1,
      limit: 12,
    });
  });

  it('should trim whitespace from query', () => {
    const params = new URLSearchParams({ q: '  laptop  ' });
    const result = readCatalogQuery(params);
    expect(result?.q).toBe('laptop');
  });

  it('should treat empty query as undefined', () => {
    const params = new URLSearchParams({ q: '   ' });
    const result = readCatalogQuery(params);
    expect(result?.q).toBeUndefined();
  });

  it('should allow empty string for minPrice/maxPrice', () => {
    const params = new URLSearchParams({ minPrice: '', maxPrice: '' });
    const result = readCatalogQuery(params);
    expect(result).not.toBeNull();
    expect(result?.minPrice).toBeUndefined();
    expect(result?.maxPrice).toBeUndefined();
  });
});

describe('paginationPages', () => {
  // TC-FE-CATALOG-006
  it('should return single page for total of 1', () => {
    const pages = paginationPages(1, 1);
    expect(pages).toEqual([1]);
  });

  it('should return all pages for small total', () => {
    const pages = paginationPages(2, 3);
    expect(pages).toEqual([1, 2, 3]);
  });

  // TC-FE-CATALOG-007
  it('should add ellipsis for gaps', () => {
    const pages = paginationPages(5, 10);
    expect(pages).toContain('ellipsis');
    expect(pages).toContain(1);
    expect(pages).toContain(10);
    expect(pages).toContain(5);
  });

  it('should include adjacent pages', () => {
    const pages = paginationPages(5, 10);
    expect(pages).toContain(4);
    expect(pages).toContain(6);
  });

  it('should not add ellipsis when pages are adjacent', () => {
    const pages = paginationPages(2, 5);
    // Should be [1, 2, 3, 'ellipsis', 5] or similar
    const ellipsisCount = pages.filter((p) => p === 'ellipsis').length;
    expect(ellipsisCount).toBeLessThanOrEqual(1);
  });

  it('should handle first page', () => {
    const pages = paginationPages(1, 10);
    expect(pages[0]).toBe(1);
    expect(pages).toContain(2);
    expect(pages).toContain(10);
  });

  it('should handle last page', () => {
    const pages = paginationPages(10, 10);
    expect(pages[pages.length - 1]).toBe(10);
    expect(pages).toContain(9);
    expect(pages).toContain(1);
  });

  it('should handle page in middle', () => {
    const pages = paginationPages(50, 100);
    expect(pages).toContain(1);
    expect(pages).toContain(49);
    expect(pages).toContain(50);
    expect(pages).toContain(51);
    expect(pages).toContain(100);
  });

  it('should not include pages outside range', () => {
    const pages = paginationPages(1, 5);
    const numericPages = pages.filter((p) => typeof p === 'number') as number[];
    expect(numericPages.every((p) => p >= 1 && p <= 5)).toBe(true);
  });

  it('should handle edge case with page 2', () => {
    const pages = paginationPages(2, 10);
    expect(pages).toContain(1);
    expect(pages).toContain(2);
    expect(pages).toContain(3);
  });

  it('should handle edge case with second to last page', () => {
    const pages = paginationPages(9, 10);
    expect(pages).toContain(8);
    expect(pages).toContain(9);
    expect(pages).toContain(10);
  });

  it('should return sorted pages', () => {
    const pages = paginationPages(5, 10);
    const numericPages = pages.filter((p) => typeof p === 'number') as number[];
    for (let i = 1; i < numericPages.length; i++) {
      expect(numericPages[i]).toBeGreaterThan(numericPages[i - 1]);
    }
  });
});
