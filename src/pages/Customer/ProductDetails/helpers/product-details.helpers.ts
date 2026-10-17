import { translations } from '../../../../utils/translations';
export const isProductId = (id?: string): id is string =>
  !!id &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export function getProductImages(images: string[]): string[] {
  return [...new Set(images.map((image) => image.trim()).filter(Boolean))];
}
export function formatSpecificationValue(value: unknown): string {
  const t = translations.productDetails;
  if (value == null || value === '') return t.notSpecified;
  if (typeof value === 'boolean') return value ? t.yes : t.no;
  if (Array.isArray(value))
    return value.length
      ? value.map(formatSpecificationValue).join(', ')
      : t.notSpecified;
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    return entries.length
      ? entries
          .map(([label, item]) => `${label}: ${formatSpecificationValue(item)}`)
          .join('; ')
      : t.notSpecified;
  }
  return String(value);
}
