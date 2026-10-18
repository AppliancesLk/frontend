import type {
  ProductDraft,
  ProductFieldsDraft,
} from '../types/product-form.types';
import type { CreateProductRequest } from '../../../../types/product.types';
import { validateStockQuantity } from '../../../../utils/stockValidation';
import { translations } from '../../../../utils/translations';
import { PRODUCT_BADGES } from '../../../../types/product.types';
export function buildProductFieldsInput(
  draft: ProductFieldsDraft,
  validateImages = true,
) {
  const name = draft.name.trim();
  const SKU = draft.SKU.trim();
  if (!name || !SKU) throw new Error(translations.admin.productNameRequired);
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(draft.price) ||
    Number(draft.price) > 9999999999.99
  )
    throw new Error(translations.admin.invalidPrice);
  const images = draft.imageUrls
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
  for (const image of validateImages ? images : []) {
    if(/^\/media\/images\/[a-f0-9-]{36}\.(png|jpg|webp)$/.test(image))continue;
    try {
      const url = new URL(image);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      throw new Error(translations.admin.invalidImages);
    }
  }
  if (!draft.categoryID) throw new Error(translations.admin.selectCategory);
  if(images.length>10)throw new Error(translations.experience.uploadError);
  const description=(draft.description??'').trim(),warranty=(draft.warranty??'').trim();
  const features=(draft.features??'').split('\n').map(value=>value.trim()).filter(Boolean),boxContents=(draft.boxContents??'').split('\n').map(value=>value.trim()).filter(Boolean);
  if(description.length>10000||warranty.length>300||features.length>20||boxContents.length>30||[...features,...boxContents].some(value=>value.length>300))throw new Error(translations.catalog.invalidMetadata);
  const brand = (draft.brand ?? '').trim() || null;
  const subtitle = (draft.subtitle ?? '').trim();
  const badge = PRODUCT_BADGES.find((value) => value === draft.badge) ?? null;
  const compareText = (draft.compareAtPrice ?? '').trim();
  const compareAtPrice = compareText ? Number(compareText) : null;
  if (
    (brand && (brand.length > 80 || brand.includes(','))) ||
    subtitle.length > 160 ||
    (draft.badge && !badge) ||
    (compareText &&
      (!/^\d+(?:\.\d{1,2})?$/.test(compareText) ||
        Number(compareAtPrice) > 9999999999.99 ||
        Number(compareAtPrice) <= Number(draft.price)))
  )
    throw new Error(translations.catalog.invalidMetadata);
  return {
    description,features,boxContents,warranty,
    brand,
    subtitle,
    badge,
    compareAtPrice,
    name,
    SKU,
    price: Number(draft.price),
    categoryID: draft.categoryID,
    images,
  };
}
export function buildProductInput(draft: ProductDraft): CreateProductRequest {
  const fields = buildProductFieldsInput(draft);
  const stock = validateStockQuantity(draft.stockQty);
  if (!stock.valid) throw new Error(stock.message);
  const specifications: Record<string, string> = {};
  for (const line of draft.specifications
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)) {
    const separator = line.indexOf(':');
    if (separator < 1 || !line.slice(separator + 1).trim())
      throw new Error(translations.admin.invalidSpecifications);
    Object.defineProperty(specifications, line.slice(0, separator).trim(), {
      value: line.slice(separator + 1).trim(),
      enumerable: true,
      configurable: true,
    });
  }
  return { ...fields, stockQty: stock.value, specifications };
}
