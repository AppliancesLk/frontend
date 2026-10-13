export interface Category {
  categoryID: string;
  name: string;
  isActive: boolean;
  parent: Category | null;
}