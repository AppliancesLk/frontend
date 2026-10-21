import type { AdminUser } from './user.types';
export type PromotionAudience = 'ALL' | 'SELECTED';
export interface PromotionContent {
  subject: string;
  headline: string;
  preheader: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  footerNote: string;
  audience: PromotionAudience;
  userIds: string[];
  productIds: string[];
}
export type PromotionCounts = Record<
  'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED' | 'SKIPPED' | 'UNKNOWN',
  number
>;
export interface PromotionRun {
  id: string;
  campaignVersion: number;
  subject: string;
  recipientCount: number;
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  counts: PromotionCounts;
  createdAt: string;
  finishedAt: string | null;
}
export interface PromotionListItem {
  id: string;
  subject: string;
  headline: string;
  audience: PromotionAudience;
  productCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  latestRun: PromotionRun | null;
}
export interface PromotionList {
  items: PromotionListItem[];
  total: number;
  page: number;
  limit: number;
}
export type PromotionUser = Pick<
  AdminUser,
  'id' | 'username' | 'email' | 'isActive' | 'emailVerifiedAt' | 'deactivatedAt'
>;
export interface PromotionProduct {
  productID: string;
  name: string;
  price: string | number;
  images: string[];
  isActive: boolean;
}
export interface PromotionDetail extends PromotionContent {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  selectedUsers: PromotionUser[];
  selectedProducts: PromotionProduct[];
  runs: PromotionRun[];
}
export interface PromotionPreview {
  subject: string;
  html: string;
  text: string;
  recipientCount: number;
  excludedCount: number;
}
export interface PromotionRunDetail extends PromotionRun {
  preview: Pick<PromotionPreview, 'subject' | 'html' | 'text'>;
  recipients: {
    id: string;
    username: string;
    email: string;
    status: keyof PromotionCounts;
    finishedAt: string | null;
  }[];
  total: number;
  page: number;
  limit: number;
}
