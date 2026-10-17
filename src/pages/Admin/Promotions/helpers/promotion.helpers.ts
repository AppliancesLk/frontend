import type {
  PromotionContent,
  PromotionDetail,
} from '../../../../types/promotion.types';
export const EMPTY_PROMOTION: PromotionContent = {
  subject: '',
  headline: '',
  preheader: '',
  body: '',
  buttonText: 'Explore products',
  buttonUrl: '',
  footerNote:
    'Prices and availability may change. Visit Appliances.lk for current product details.',
  audience: 'SELECTED',
  userIds: [],
  productIds: [],
};
export function promotionContent(
  value: PromotionDetail | PromotionContent,
): PromotionContent {
  return {
    subject: value.subject,
    headline: value.headline,
    preheader: value.preheader,
    body: value.body,
    buttonText: value.buttonText,
    buttonUrl: value.buttonUrl,
    footerNote: value.footerNote,
    audience: value.audience,
    userIds: value.userIds,
    productIds: value.productIds,
  };
}
export function canReviewPromotion(value: PromotionContent) {
  return Boolean(
    value.subject.trim() &&
    value.headline.trim() &&
    value.body.trim() &&
    value.productIds.length &&
    (value.audience === 'ALL' || value.userIds.length),
  );
}
export function isSending(status?: string) {
  return status === 'QUEUED' || status === 'SENDING';
}
