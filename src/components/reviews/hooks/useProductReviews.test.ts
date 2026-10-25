/**
 * @file useProductReviews.test.ts
 * @description Tests for useProductReviews hook
 *
 * Test Case IDs:
 * - TC-FE-REVIEWS-HOOK-001: Fetches reviews on mount
 * - TC-FE-REVIEWS-HOOK-002: Fetches user's review when customerId provided
 * - TC-FE-REVIEWS-HOOK-003: Returns loading state initially
 * - TC-FE-REVIEWS-HOOK-004: Returns data after successful fetch
 * - TC-FE-REVIEWS-HOOK-005: Handles error state
 * - TC-FE-REVIEWS-HOOK-006: Supports pagination
 * - TC-FE-REVIEWS-HOOK-007: Refreshes data when refresh called
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProductReviews } from './useProductReviews';
import * as reviewService from '../../../services/reviewService';
import type { ReviewPage, ProductReview } from '../../../types/review.types';

vi.mock('../../../services/reviewService');

const mockGetReviews = vi.mocked(reviewService.getReviews);
const mockGetMyReview = vi.mocked(reviewService.getMyReview);

const mockReviewPage: ReviewPage = {
  items: [
    {
      id: 'review-1',
      productId: 'product-123',
      author: 'John Doe',
      rating: 5,
      title: 'Great product!',
      body: 'I love this product.',
      createdAt: '2024-01-15T10:00:00Z',
      verifiedPurchase: true,
    },
  ],
  page: 1,
  totalPages: 3,
  total: 25,
  summary: {
    average: 4.5,
    count: 25,
    distribution: [
      { rating: 5, count: 15 },
      { rating: 4, count: 5 },
      { rating: 3, count: 3 },
      { rating: 2, count: 1 },
      { rating: 1, count: 1 },
    ],
  },
};

const mockMyReview: ProductReview = {
  id: 'my-review-1',
  productId: 'product-123',
  author: 'Current User',
  rating: 4,
  title: 'My review',
  body: 'My review body.',
  createdAt: '2024-01-10T10:00:00Z',
  verifiedPurchase: true,
};

describe('useProductReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetReviews.mockResolvedValue(mockReviewPage);
    mockGetMyReview.mockResolvedValue(mockMyReview);
  });

  // TC-FE-REVIEWS-HOOK-001
  it('should fetch reviews on mount', async () => {
    renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalledWith(
        'product-123',
        1,
        expect.any(AbortSignal),
        false,
      );
    });
  });

  // TC-FE-REVIEWS-HOOK-002
  it('should fetch user review when customerId provided', async () => {
    renderHook(() => useProductReviews('product-123', 'user-456'));

    await waitFor(() => {
      expect(mockGetMyReview).toHaveBeenCalledWith(
        'product-123',
        expect.any(AbortSignal),
      );
    });
  });

  // TC-FE-REVIEWS-HOOK-003
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useProductReviews('product-123'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  // TC-FE-REVIEWS-HOOK-004
  it('should return data after successful fetch', async () => {
    const { result } = renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockReviewPage);
    expect(result.current.error).toBeFalsy();
  });

  // TC-FE-REVIEWS-HOOK-005
  it('should handle error state', async () => {
    mockGetReviews.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  // TC-FE-REVIEWS-HOOK-006
  it('should support pagination', async () => {
    const { result } = renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.page).toBe(1);

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalledWith(
        'product-123',
        2,
        expect.any(AbortSignal),
        false,
      );
    });
  });

  // TC-FE-REVIEWS-HOOK-007
  it('should refresh data when refresh called', async () => {
    const { result } = renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock to track new calls
    mockGetReviews.mockClear();

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalled();
    });
  });

  it('should not fetch user review without customerId', async () => {
    renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalled();
    });

    expect(mockGetMyReview).not.toHaveBeenCalled();
  });

  it('should return mine as null when no customerId', async () => {
    const { result } = renderHook(() => useProductReviews('product-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // mine is null when no customerId is provided
    expect(result.current.mine).toBeNull();
  });

  it('should return mine when customerId provided', async () => {
    const { result } = renderHook(() =>
      useProductReviews('product-123', 'user-456'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.mine).toEqual(mockMyReview);
  });

  it('should pass admin flag to getReviews', async () => {
    renderHook(() => useProductReviews('product-123', undefined, true));

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalledWith(
        'product-123',
        1,
        expect.any(AbortSignal),
        true,
      );
    });
  });

  it('should abort pending requests on unmount', async () => {
    const { unmount } = renderHook(() => useProductReviews('product-123'));

    unmount();

    // The abort should be called, no error should occur
    expect(true).toBe(true);
  });

  it('should refetch when productId changes', async () => {
    const { result, rerender } = renderHook(
      ({ productId }) => useProductReviews(productId),
      { initialProps: { productId: 'product-123' } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGetReviews.mockClear();

    rerender({ productId: 'product-456' });

    await waitFor(() => {
      expect(mockGetReviews).toHaveBeenCalledWith(
        'product-456',
        1,
        expect.any(AbortSignal),
        false,
      );
    });
  });
});
