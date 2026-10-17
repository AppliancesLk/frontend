import type { Cart } from '../../../../types/cart.types';
import type {
  CheckoutSummary,
  DeliveryInformation,
} from '../../../../types/checkout.types';
import { translations } from '../../../../utils/translations';
import type { DeliveryDraft, DeliveryErrors } from '../types/checkout.types';
const t = translations.checkout;

export function initialDelivery(email: string): DeliveryDraft {
  return {
    firstName: '',
    lastName: '',
    email,
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    countryCode: 'LK',
  };
}
export function normalizeDelivery(draft: DeliveryDraft): DeliveryInformation {
  return {
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    addressLine1: draft.addressLine1.trim(),
    ...(draft.addressLine2.trim()
      ? { addressLine2: draft.addressLine2.trim() }
      : {}),
    city: draft.city.trim(),
    postalCode: draft.postalCode.trim(),
    countryCode: draft.countryCode.trim().toUpperCase(),
  };
}
export function validateDelivery(draft: DeliveryDraft): DeliveryErrors {
  const value = normalizeDelivery(draft);
  const errors: DeliveryErrors = {};
  const limits = {
    firstName: 80,
    lastName: 80,
    addressLine1: 200,
    city: 100,
  } as const;
  for (const field of Object.keys(limits) as (keyof typeof limits)[]) {
    if (!value[field]) errors[field] = t.requiredField;
    else if (value[field].length > limits[field])
      errors[field] = t.fieldTooLong;
  }
  if (value.addressLine2 && value.addressLine2.length > 200)
    errors.addressLine2 = t.addressTooLong;
  if (
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    errors.email = t.invalidEmail;
  const phone = value.phone.replace(/[\s().-]/g, '');
  if (
    value.phone.length > 30 ||
    !/^(?:0[1-9]\d{8}|\+[1-9]\d{7,14})$/.test(phone)
  )
    errors.phone = t.invalidPhone;
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{1,19}$/.test(value.postalCode))
    errors.postalCode = t.invalidPostalCode;
  if (!/^[A-Z]{2}$/.test(value.countryCode))
    errors.countryCode = t.invalidCountry;
  return errors;
}
export function checkoutChanges(cart: Cart, summary: CheckoutSummary) {
  const old = new Map(cart.items.map((item) => [item.productId, item]));
  return {
    pricesChanged: summary.items.some(
      (item) =>
        old.has(item.productId) &&
        old.get(item.productId)?.unitPrice !== item.unitPrice,
    ),
    itemsChanged:
      cart.items.length !== summary.items.length ||
      summary.items.some(
        (item) => old.get(item.productId)?.quantity !== item.quantity,
      ),
  };
}
