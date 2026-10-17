export interface ProductFieldsDraft {
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
  name: '',
  SKU: '',
  price: '',
  categoryID: '',
  stockQty: '0',
  imageUrls: '',
  specifications: '',
};
