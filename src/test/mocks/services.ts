/**
 * @file services.ts
 * @description Mock implementations for frontend services
 *
 * All API service mocks to avoid real backend calls during testing.
 */

import { vi } from 'vitest';
import type { Cart } from '../../types/cart.types';
import type { Order, AdminOrder } from '../../types/order.types';
import type { RepairTicket, AdminRepairTicket } from '../../types/repair.types';
import type { CatalogResult } from '../../types/catalog.types';
import type { Product } from '../../types/product.types';
import type { AuthUser, RegistrationResult } from '../../types/auth.types';

// ============= AUTH SERVICE MOCKS =============

export const mockAuthService = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getProfile: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
};

// ============= PRODUCT SERVICE MOCKS =============

export const mockProductService = {
  getProductCatalog: vi.fn(),
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  getAdminProducts: vi.fn(),
  getAdminProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  updateProductStock: vi.fn(),
  uploadProductImage: vi.fn(),
  deleteProductImage: vi.fn(),
  getProductsByCategory: vi.fn(),
};

// ============= CART SERVICE MOCKS =============

export const mockCartService = {
  getCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
};

// ============= ORDER SERVICE MOCKS =============

export const mockOrderService = {
  createOrder: vi.fn(),
  getOrders: vi.fn(),
  getOrder: vi.fn(),
  cancelOrder: vi.fn(),
  getAdminOrders: vi.fn(),
  getAdminOrder: vi.fn(),
  updateAdminOrderStatus: vi.fn(),
};

// ============= REPAIR SERVICE MOCKS =============

export const mockRepairService = {
  createRepairTicket: vi.fn(),
  getCustomerRepairs: vi.fn(),
  getCustomerRepair: vi.fn(),
  getAdminRepairs: vi.fn(),
  getAdminRepair: vi.fn(),
  approveRepair: vi.fn(),
  rejectRepair: vi.fn(),
  assignRepair: vi.fn(),
  getRepairerRepairs: vi.fn(),
  getRepairerRepair: vi.fn(),
  updateRepairStatus: vi.fn(),
};

// ============= PAYMENT SERVICE MOCKS =============

export const mockPaymentService = {
  initiatePayment: vi.fn(),
  getOrderPayment: vi.fn(),
};

// ============= CHAT SERVICE MOCKS =============

export const mockChatService = {
  getChatSessions: vi.fn(),
  createChat: vi.fn(),
  getChat: vi.fn(),
  getChatMessages: vi.fn(),
  closeChat: vi.fn(),
};

// ============= AI SERVICE MOCKS =============

export const mockAiService = {
  sendProductQuestion: vi.fn(),
};

// ============= CATEGORY SERVICE MOCKS =============

export const mockCategoryService = {
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
};

// ============= LOYALTY SERVICE MOCKS =============

export const mockLoyaltyService = {
  getLoyaltyBalance: vi.fn(),
  getLoyaltyHistory: vi.fn(),
};

// ============= RESET ALL MOCKS =============

export function resetAllServiceMocks(): void {
  Object.values(mockAuthService).forEach((mock) => mock.mockReset());
  Object.values(mockProductService).forEach((mock) => mock.mockReset());
  Object.values(mockCartService).forEach((mock) => mock.mockReset());
  Object.values(mockOrderService).forEach((mock) => mock.mockReset());
  Object.values(mockRepairService).forEach((mock) => mock.mockReset());
  Object.values(mockPaymentService).forEach((mock) => mock.mockReset());
  Object.values(mockChatService).forEach((mock) => mock.mockReset());
  Object.values(mockAiService).forEach((mock) => mock.mockReset());
  Object.values(mockCategoryService).forEach((mock) => mock.mockReset());
  Object.values(mockLoyaltyService).forEach((mock) => mock.mockReset());
}
