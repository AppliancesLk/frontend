import type { ProductFieldsDraft } from '../types/product-form.types';
import type { Category } from '../../../../types/category.types';
import { translations } from '../../../../utils/translations';
import { ImageUploader } from '../../../../components/forms/ImageUploader';
const t = translations.admin;
export function ProductFields({
  draft,
  categories,
  onChange,
  editing = false,
  onUploadState,
}: {
  draft: ProductFieldsDraft;
  categories: Category[];
  onChange: (field: keyof ProductFieldsDraft, value: string) => void;
  editing?: boolean;
  onUploadState?: (busy: boolean) => void;
}) {
  return (
    <>
      {(['name', 'SKU', 'price'] as const).map((field) => (
        <div key={field}>
          <label className="auth-label" htmlFor={field}>
            {{ name: t.productName, SKU: t.sku, price: t.price }[field]}
          </label>
          <input
            id={field}
            required
            className="auth-input"
            type={field === 'price' ? 'number' : 'text'}
            min={field === 'price' ? 0 : undefined}
            max={field === 'price' ? 9999999999.99 : undefined}
            step={field === 'price' ? '0.01' : undefined}
            value={draft[field]}
            onChange={(event) => onChange(field, event.target.value)}
          />
        </div>
      ))}
      <div>
        <label htmlFor="categoryID" className="auth-label">
          {t.category}
        </label>
        <select
          id="categoryID"
          required
          className="auth-input"
          value={draft.categoryID}
          onChange={(event) => onChange('categoryID', event.target.value)}
        >
          <option value="">{t.selectCategory}</option>
          {categories.map((category) => (
            <option key={category.categoryID} value={category.categoryID}>
              {category.parent ? `${category.parent.name} / ` : ''}
              {category.name}
              {!category.isActive ? ` (${t.inactive})` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <p className="text-sm text-slate-500">
          {translations.catalog.metadataHint}
        </p>
      </div>
      {(['brand', 'subtitle', 'compareAtPrice'] as const).map((field) => (
        <div key={field}>
          <label className="auth-label" htmlFor={field}>
            {translations.catalog[field]}
          </label>
          <input
            id={field}
            className="auth-input"
            value={draft[field] ?? ''}
            type={field === 'compareAtPrice' ? 'number' : 'text'}
            min={field === 'compareAtPrice' ? 0 : undefined}
            step={field === 'compareAtPrice' ? '0.01' : undefined}
            max={field === 'compareAtPrice' ? 9999999999.99 : undefined}
            maxLength={
              field === 'brand' ? 80 : field === 'subtitle' ? 160 : undefined
            }
            onChange={(event) => onChange(field, event.target.value)}
          />
        </div>
      ))}
      <div>
        <label className="auth-label" htmlFor="badge">
          {translations.catalog.badge}
        </label>
        <select
          id="badge"
          className="auth-input"
          value={draft.badge ?? ''}
          onChange={(event) => onChange('badge', event.target.value)}
        >
          <option value="">{translations.catalog.noBadge}</option>
          {Object.entries(translations.catalog.badges).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="imageUrls" className="auth-label">
          {t.imageUrls}
        </label>
        <ImageUploader
          value={draft.imageUrls
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean)}
          onChange={(images) => onChange('imageUrls', images.join('\n'))}
          onBusyChange={onUploadState}
        />
        <textarea
          id="imageUrls"
          rows={3}
          className="auth-input h-auto py-2"
          value={draft.imageUrls}
          onChange={(event) => onChange('imageUrls', event.target.value)}
          aria-describedby="image-hint"
        />
        <p id="image-hint" className="mt-2 text-xs text-slate-500">
          {t.imageHint} {editing && translations.productEdit.clearImagesHint}
        </p>
      </div>
      {(['description', 'features', 'boxContents', 'warranty'] as const).map(
        (field) => (
          <div
            key={field}
            className={field === 'description' ? 'sm:col-span-2' : ''}
          >
            <label className="auth-label" htmlFor={field}>
              {translations.experience[field]}
            </label>
            <textarea
              id={field}
              rows={field === 'description' ? 4 : 3}
              maxLength={
                field === 'description'
                  ? 10000
                  : field === 'warranty'
                    ? 300
                    : undefined
              }
              value={draft[field] ?? ''}
              onChange={(event) => onChange(field, event.target.value)}
              className="auth-input h-auto py-2"
            />
            <p className="mt-1 text-xs text-slate-500">
              {field === 'features' || field === 'boxContents'
                ? translations.experience.listHint
                : ''}
            </p>
          </div>
        ),
      )}
    </>
  );
}
