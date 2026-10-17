import type { ProductFieldsDraft } from '../../types/product-form.types';
export type SpecificationDraft =
  | { kind: 'text' | 'number'; text: string }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'empty' }
  | { kind: 'group'; entries: SpecificationEntryDraft[] }
  | { kind: 'list'; items: SpecificationDraft[] }
  | { kind: 'preserved'; value: unknown };
export interface SpecificationEntryDraft {
  name: string;
  value: SpecificationDraft;
}
export interface ProductEditDraft extends ProductFieldsDraft {
  isActive: boolean;
  specifications: SpecificationEntryDraft[];
  specificationsMode: 'preserve' | 'replace' | 'clear';
}
