export interface Category {
  categoryID: string;
  name: string;
  isActive: boolean;
  parent: Category | null;
}
export interface CreateCategoryRequest {
  name: string;
  parentID?: string;
  isActive?: boolean;
}
export interface UpdateCategoryRequest {
  isActive?: boolean;
}
