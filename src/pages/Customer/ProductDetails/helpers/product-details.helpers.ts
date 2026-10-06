import { translations } from '../../../../utils/translations';
export { isUuid as isProductId } from '../../../../utils/validation';
const keySpecifications = [
  'display',
  'processor',
  'ram',
  'storage',
  'rear camera',
  'front camera',
  'battery',
  'connectivity',
  'capacity',
  'power',
  'output',
];
export function formatSpecificationLabel(label: string): string {
  return label.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
}
export function getSpecificationEntries(
  specifications: Record<string, unknown> | null | undefined,
): [string, unknown][] {
  const rank = (key: string) => {
    const index = keySpecifications.indexOf(
      formatSpecificationLabel(key).toLowerCase(),
    );
    return index < 0 ? keySpecifications.length : index;
  };
  return Object.entries(specifications ?? {})
    .filter(([key]) => key !== 'Dataset')
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));
}
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
