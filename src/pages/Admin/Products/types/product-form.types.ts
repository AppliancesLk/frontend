export interface ProductDraft {
  name: string;
  SKU: string;
  price: string;
  categoryID: string;
  stockQty: string;
  imageUrls: string;
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
