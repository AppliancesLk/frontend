import type {
  Product,
  UpdateProductRequest,
} from '../../../../../types/product.types';
import type {
  ProductEditDraft,
  SpecificationDraft,
  SpecificationEntryDraft,
} from '../types/product-edit.types';
import { buildProductFieldsInput } from '../../helpers/product.helpers';
import { translations } from '../../../../../utils/translations';
const t = translations.productEdit;
export function toSpecificationDraft(
  value: unknown,
  depth = 0,
): SpecificationDraft {
  if (depth > 6) return { kind: 'preserved', value };
  if (value === null || value === undefined) return { kind: 'empty' };
  if (typeof value === 'string') return { kind: 'text', text: value };
  if (typeof value === 'number') return { kind: 'number', text: String(value) };
  if (typeof value === 'boolean') return { kind: 'boolean', value };
  if (Array.isArray(value))
    return {
      kind: 'list',
      items: value.map((item) => toSpecificationDraft(item, depth + 1)),
    };
  if (typeof value === 'object')
    return {
      kind: 'group',
      entries: Object.entries(value).map(([name, item]) => ({
        name,
        value: toSpecificationDraft(item, depth + 1),
      })),
    };
  return { kind: 'preserved', value };
}
export function defaultSpecificationValue(
  kind: SpecificationDraft['kind'],
): SpecificationDraft {
  switch (kind) {
    case 'number':
      return { kind, text: '0' };
    case 'boolean':
      return { kind, value: false };
    case 'group':
      return { kind, entries: [] };
    case 'list':
      return { kind, items: [] };
    case 'empty':
      return { kind };
    default:
      return { kind: 'text', text: '' };
  }
}
export function specificationEntriesToObject(
  entries: SpecificationEntryDraft[],
): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  const names = new Set<string>();
  for (const entry of entries) {
    if (!entry.name.trim()) throw new Error(t.missingSpecificationName);
    if (names.has(entry.name)) throw new Error(t.duplicateSpecification);
    names.add(entry.name);
    Object.defineProperty(output, entry.name, {
      value: specificationDraftValue(entry.value),
      enumerable: true,
      configurable: true,
    });
  }
  return output;
}
export function specificationDraftValue(draft: SpecificationDraft): unknown {
  switch (draft.kind) {
    case 'text':
      return draft.text;
    case 'number': {
      if (!draft.text.trim() || !Number.isFinite(Number(draft.text)))
        throw new Error(t.invalidNumber);
      return Number(draft.text);
    }
    case 'boolean':
      return draft.value;
    case 'empty':
      return null;
    case 'list':
      return draft.items.map(specificationDraftValue);
    case 'group':
      return specificationEntriesToObject(draft.entries);
    case 'preserved':
      return draft.value;
  }
}
export function createProductEditDraft(product: Product): ProductEditDraft {
  return {
    name: product.name,
    brand: product.brand ?? '',
    subtitle: product.subtitle ?? '',
    badge: product.badge ?? '',
    compareAtPrice:
      product.compareAtPrice != null ? String(product.compareAtPrice) : '',
    SKU: product.SKU,
    price: String(product.price),
    categoryID: product.category.categoryID,
    imageUrls: product.images.join('\n'),
    isActive: product.isActive,
    specifications: Object.entries(product.specifications ?? {}).map(
      ([name, value]) => ({ name, value: toSpecificationDraft(value) }),
    ),
    specificationsMode: 'preserve',
  };
}
function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object')
    return false;
  if (Array.isArray(a) || Array.isArray(b))
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, index) => sameValue(value, b[index]))
    );
  const left = Object.entries(a);
  const right = Object.entries(b);
  return (
    left.length === right.length &&
    left.every(
      ([key, value]) =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        sameValue(value, Reflect.get(b, key)),
    )
  );
}
function changedSpecifications(
  draft: ProductEditDraft,
  original: Product,
): { changed: boolean; value: Record<string, unknown> | null } {
  if (draft.specificationsMode === 'preserve')
    return { changed: false, value: original.specifications };
  const value =
    draft.specificationsMode === 'clear'
      ? null
      : specificationEntriesToObject(draft.specifications);
  return { changed: !sameValue(value, original.specifications), value };
}
export function isProductEditDirty(
  draft: ProductEditDraft,
  original: Product,
): boolean {
  const initial = createProductEditDraft(original);
  if (
    (
      [
        'name',
        'SKU',
        'price',
        'categoryID',
        'imageUrls',
        'isActive',
        'brand',
        'subtitle',
        'badge',
        'compareAtPrice',
      ] as const
    ).some((field) => draft[field] !== initial[field])
  )
    return true;
  try {
    return changedSpecifications(draft, original).changed;
  } catch {
    return true;
  }
}
export function buildProductUpdateInput(
  draft: ProductEditDraft,
  original: Product,
): UpdateProductRequest {
  const initial = createProductEditDraft(original);
  const fields = buildProductFieldsInput(
    draft,
    draft.imageUrls !== initial.imageUrls,
  );
  const patch: UpdateProductRequest = {};
  if ((draft.brand ?? '') !== initial.brand) patch.brand = fields.brand;
  if ((draft.subtitle ?? '') !== initial.subtitle)
    patch.subtitle = fields.subtitle;
  if ((draft.badge ?? '') !== initial.badge) patch.badge = fields.badge;
  if ((draft.compareAtPrice ?? '') !== initial.compareAtPrice)
    patch.compareAtPrice = fields.compareAtPrice;
  if (draft.name !== initial.name && fields.name !== original.name)
    patch.name = fields.name;
  if (draft.SKU !== initial.SKU && fields.SKU !== original.SKU)
    patch.SKU = fields.SKU;
  if (Number(draft.price) !== Number(original.price))
    patch.price = fields.price;
  if (draft.categoryID !== original.category.categoryID)
    patch.categoryID = fields.categoryID;
  if (
    draft.imageUrls !== initial.imageUrls &&
    !sameValue(fields.images, original.images)
  )
    patch.images = fields.images;
  if (draft.isActive !== original.isActive) patch.isActive = draft.isActive;
  const specs = changedSpecifications(draft, original);
  if (specs.changed) patch.specifications = specs.value;
  return patch;
}
