export interface ProductFieldsDraft {
  brand: string;
  subtitle: string;
  badge: string;
  compareAtPrice: string;
  name: string;
  SKU: string;
  price: string;
  categoryID: string;
  imageUrls: string;
}
export interface ProductDraft extends ProductFieldsDraft {
  stockQty: string;
  specifications: string;
}
export const emptyProductDraft: ProductDraft = {
  brand: '',
  subtitle: '',
  badge: '',
  compareAtPrice: '',
  name: '',
  SKU: '',
  price: '',
  categoryID: '',
  stockQty: '0',
  imageUrls: '',
  specifications: '',
};
