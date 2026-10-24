import type { Category } from '../../types/category.types';
import type { Product } from '../../types/product.types';

let productCounter = 0;
let categoryCounter = 0;

/**
 * Create a mock category for testing.
 */
export function createMockCategory(
  overrides: Partial<Category> = {},
): Category {
  categoryCounter++;
  return {
    categoryID: `cat-${categoryCounter}`,
    name: `Test Category ${categoryCounter}`,
    imageUrl: null,
    isActive: true,
    parent: null,
    ...overrides,
  };
}

/**
 * Create a mock product for testing.
 */
export function createMockProduct(overrides: Partial<Product> = {}): Product {
  productCounter++;
  const defaultCategory = createMockCategory();
  return {
    productID: `prod-${productCounter}`,
    name: `Test Product ${productCounter}`,
    SKU: `SKU-${productCounter}`,
    price: '9999.99',
    stockQty: 10,
    images: [`https://example.com/image${productCounter}.jpg`],
    specifications: null,
    isActive: true,
    category: defaultCategory,
    description: `Description for Test Product ${productCounter}`,
    features: ['Feature 1', 'Feature 2'],
    boxContents: ['Product', 'Manual'],
    warranty: '1 year',
    ratingAverage: '4.5',
    ratingCount: 10,
    brand: 'Test Brand',
    subtitle: 'Test Subtitle',
    badge: null,
    compareAtPrice: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create multiple mock products.
 */
export function createMockProducts(
  count: number,
  overrides: Partial<Product> = {},
): Product[] {
  return Array.from({ length: count }, () => createMockProduct(overrides));
}

/**
 * Create a mock out-of-stock product.
 */
export function createMockOutOfStockProduct(
  overrides: Partial<Product> = {},
): Product {
  return createMockProduct({ stockQty: 0, ...overrides });
}

/**
 * Create a mock inactive product.
 */
export function createMockInactiveProduct(
  overrides: Partial<Product> = {},
): Product {
  return createMockProduct({ isActive: false, ...overrides });
}

/**
 * Reset the product and category counters (for test isolation).
 */
export function resetProductFactory(): void {
  productCounter = 0;
  categoryCounter = 0;
}
