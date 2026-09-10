import type { Product } from '../../../../../types/product.types';
import type { ProductEditDraft } from '../types/product-edit.types';
// Memory only: retain a failed edit across reauthentication in this tab, scoped
// to the account and product. No credentials or drafts are written to storage.
const drafts = new Map<
  string,
  { baseline: Product; draft: ProductEditDraft }
>();
export const productEditCache = {
  get: (key: string) => drafts.get(key),
  set: (key: string, value: { baseline: Product; draft: ProductEditDraft }) => {
    drafts.set(key, value);
  },
  delete: (key: string) => {
    drafts.delete(key);
  },
};
