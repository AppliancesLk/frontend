import type { ProductDraft } from '../types/product-form.types';
import type { CreateProductRequest } from '../../../../types/product.types';
import { validateStockQuantity } from '../../../../utils/stockValidation';
import { translations } from '../../../../utils/translations';
export function buildProductInput(draft: ProductDraft): CreateProductRequest {
  const name = draft.name.trim();
  const SKU = draft.SKU.trim();
  if (!name || !SKU) throw new Error(translations.admin.productNameRequired);
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(draft.price) ||
    Number(draft.price) > 9999999999.99
  )
    throw new Error(translations.admin.invalidPrice);
  const stock = validateStockQuantity(draft.stockQty);
  if (!stock.valid) throw new Error(stock.message);
  const images = draft.imageUrls
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
  for (const image of images) {
    try {
      const url = new URL(image);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      throw new Error(translations.admin.invalidImages);
    }
  }
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
  return {
    name,
    SKU,
    price: Number(draft.price),
    categoryID: draft.categoryID,
    stockQty: stock.value,
    images,
    specifications,
  };
}
