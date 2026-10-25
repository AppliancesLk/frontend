export interface ProductFieldsDraft {
  description:string;features:string;boxContents:string;warranty:string;
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
  pendingImages: File[];
}
export const emptyProductDraft: ProductDraft = {
  description:'',features:'',boxContents:'',warranty:'',
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
  pendingImages: [],
  specifications: '',
};
