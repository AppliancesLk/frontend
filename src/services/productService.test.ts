/**
 * @file productService.test.ts
 * @description Tests for product service API calls
 *
 * Test Case IDs:
 * - TC-FE-PROD-SVC-001: getProducts calls GET /products
 * - TC-FE-PROD-SVC-002: getProductById calls GET /products/:id
 * - TC-FE-PROD-SVC-003: getProductsByCategory includes category param
 * - TC-FE-PROD-SVC-004: getProductCatalog passes query params
 * - TC-FE-PROD-SVC-005: createProduct calls POST /products
 * - TC-FE-PROD-SVC-006: updateProduct calls PATCH /products/:id
 * - TC-FE-PROD-SVC-007: deleteProduct calls DELETE /products/:id
 * - TC-FE-PROD-SVC-008: updateProductStock calls PATCH /products/:id/stock
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as productService from './productService';
import apiClient from '../api/apiClient';
import type { Product } from '../types/product.types';
import type { CatalogResult } from '../types/catalog.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('productService', () => {
  const mockProduct: Product = {
    productID: 'prod-123',
    name: 'Test Refrigerator',
    description: 'A great refrigerator',
    SKU: 'REF001',
    price: '150000.00',
    stockQty: 10,
    category: { categoryID: 'cat-1', name: 'Refrigerators', parentId: null },
    images: ['https://example.com/image.jpg'],
    specifications: null,
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    // TC-FE-PROD-SVC-001
    it('should call GET /products and return product list', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockProduct] });

      const result = await productService.getProducts();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual([mockProduct]);
    });

    it('should return empty array when no products', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [] });

      const result = await productService.getProducts();

      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    // TC-FE-PROD-SVC-002
    it('should call GET /products/:id and return product', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.getProductById('prod-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/prod-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should pass abort signal', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockProduct });
      const controller = new AbortController();

      await productService.getProductById('prod-123', controller.signal);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/prod-123', {
        signal: controller.signal,
      });
    });

    it('should encode product ID in URL', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockProduct });

      await productService.getProductById('prod/with/slashes');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/products/prod%2Fwith%2Fslashes',
        { signal: undefined },
      );
    });
  });

  describe('getProductsByCategory', () => {
    // TC-FE-PROD-SVC-003
    it('should call GET /products with categoryId param', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockProduct] });

      const result = await productService.getProductsByCategory('cat-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products', {
        signal: undefined,
        params: { categoryId: 'cat-1' },
      });
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getProductCatalog', () => {
    const mockCatalogResult: CatalogResult = {
      items: [mockProduct],
      total: 1,
      page: 1,
      limit: 12,
      totalPages: 1,
      facets: {
        categories: [],
        brands: [],
        allCount: 1,
        price: { min: '0', max: '200000' },
      },
    };

    // TC-FE-PROD-SVC-004
    it('should call GET /products/catalog with query params', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockCatalogResult });

      const query = { page: 1, limit: 12, sort: 'newest' as const };
      const result = await productService.getProductCatalog(query);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/catalog', {
        params: query,
        signal: undefined,
      });
      expect(result).toEqual(mockCatalogResult);
    });

    it('should pass abort signal', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockCatalogResult });
      const controller = new AbortController();

      await productService.getProductCatalog(
        { page: 1, limit: 12, sort: 'newest' },
        controller.signal,
      );

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/catalog', {
        params: { page: 1, limit: 12, sort: 'newest' },
        signal: controller.signal,
      });
    });
  });

  describe('createProduct', () => {
    // TC-FE-PROD-SVC-005
    it('should call POST /products with product data', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockProduct });

      const input = {
        name: 'Test Refrigerator',
        description: 'A great refrigerator',
        SKU: 'REF001',
        price: 150000,
        stockQty: 10,
        categoryID: 'cat-1',
        images: ['https://example.com/image.jpg'],
      };

      const result = await productService.createProduct(input);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/products', input);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    // TC-FE-PROD-SVC-006
    it('should call PATCH /products/:id with updated data', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Refrigerator' };
      mockedApiClient.patch.mockResolvedValue({ data: updatedProduct });

      const result = await productService.updateProduct('prod-123', {
        name: 'Updated Refrigerator',
      });

      expect(mockedApiClient.patch).toHaveBeenCalledWith('/products/prod-123', {
        name: 'Updated Refrigerator',
      });
      expect(result.name).toBe('Updated Refrigerator');
    });
  });

  describe('deleteProduct', () => {
    // TC-FE-PROD-SVC-007
    it('should call DELETE /products/:id', async () => {
      mockedApiClient.delete.mockResolvedValue({});

      await productService.deleteProduct('prod-123');

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/products/prod-123');
    });

    it('should encode product ID in URL', async () => {
      mockedApiClient.delete.mockResolvedValue({});

      await productService.deleteProduct('prod/with/slashes');

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        '/products/prod%2Fwith%2Fslashes',
      );
    });
  });

  describe('updateProductStock', () => {
    // TC-FE-PROD-SVC-008
    it('should call PATCH /products/:id/stock with stockQty', async () => {
      const updatedProduct = { ...mockProduct, stockQty: 20 };
      mockedApiClient.patch.mockResolvedValue({ data: updatedProduct });

      const result = await productService.updateProductStock('prod-123', 20);

      expect(mockedApiClient.patch).toHaveBeenCalledWith('/products/prod-123/stock', {
        stockQty: 20,
      });
      expect(result.stockQty).toBe(20);
    });
  });

  describe('getAdminProducts', () => {
    it('should call GET /products/admin/all', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockProduct] });

      const result = await productService.getAdminProducts();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/admin/all');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getAdminProductById', () => {
    it('should call GET /products/admin/:id', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.getAdminProductById('prod-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/products/admin/prod-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockProduct);
    });
  });
});
