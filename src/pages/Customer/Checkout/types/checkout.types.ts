import type { DeliveryInformation } from '../../../../types/checkout.types';
export type DeliveryDraft = Required<DeliveryInformation>;
export type DeliveryErrors = Partial<Record<keyof DeliveryDraft, string>>;
