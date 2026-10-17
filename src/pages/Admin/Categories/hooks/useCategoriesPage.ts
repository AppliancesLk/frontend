import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCatalog } from '../../../../hooks/useCatalog';
import {
  createCategory,
  updateCategory,
} from '../../../../services/categoryService';
import type { Category } from '../../../../types/category.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
export function useCategoriesPage() {
  const catalog = useCatalog();
  const [name, setName] = useState('');
  const [parentID, setParentID] = useState('');
  const [busy, setBusy] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    setSuccess('');
    if (name.trim().length < 2) {
      setError(translations.admin.invalidCategoryName);
      return;
    }
    setBusy(true);
    try {
      const category = await createCategory({
        name: name.trim(),
        ...(parentID ? { parentID } : {}),
      });
      catalog.setCategories((current) => [category, ...current]);
      setName('');
      setParentID('');
      setSuccess(translations.admin.categoryCreated);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusy(false);
    }
  }
  async function toggle(category: Category) {
    setUpdating(category.categoryID);
    setError('');
    setSuccess('');
    try {
      const updated = await updateCategory(category.categoryID, {
        isActive: !category.isActive,
      });
      catalog.setCategories((current) =>
        current.map((item) =>
          item.categoryID === updated.categoryID ? updated : item,
        ),
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setUpdating(null);
    }
  }
  return {
    ...catalog,
    name,
    setName,
    parentID,
    setParentID,
    busy,
    updating,
    submit,
    toggle,
    formError: error,
    success,
  };
}
