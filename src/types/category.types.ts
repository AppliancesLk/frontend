export interface Category {
  categoryID: string;
  name: string;
  imageUrl?:string|null;
  isActive: boolean;
  parent: Category | null;
}
export interface CreateCategoryRequest {
  imageUrl?:string|null;
  name: string;
  parentID?: string;
  isActive?: boolean;
}
export interface UpdateCategoryRequest {
  imageUrl?:string|null;
  name?:string;
  parentID?:string|null;
  isActive?: boolean;
}
