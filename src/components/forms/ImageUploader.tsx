import { useState } from 'react';
import { uploadImage } from '../../services/mediaService';
import { ProductImage } from '../common/ProductImage';
import { translations } from '../../utils/translations';
const t = translations.experience;
export function ImageUploader({
  value,
  onChange,
  max = 10,
  onBusyChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function upload(files: File[]) {
    if (!files.length) return;
    setError('');
    if (
      files.length + value.length > max ||
      files.some(
        (file) =>
          file.size > 5 * 1024 * 1024 ||
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      )
    ) {
      setError(t.uploadError);
      return;
    }
    setBusy(true);
    onBusyChange?.(true);
    const results = [...value];
    try {
      for (const file of files) results.push(await uploadImage(file));
    } catch {
      setError(t.uploadError);
    } finally {
      onChange(results);
      setBusy(false);
      onBusyChange?.(false);
    }
  }
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        {busy ? t.uploading : t.upload}
        <input
          disabled={busy || value.length >= max}
          type="file"
          multiple={max > 1}
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            void upload(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
          className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 disabled:opacity-50"
        />
      </label>
      <p className="text-xs leading-5 text-slate-500">
        {t.imageHelp} ({value.length}/{max})
      </p>
      <div className="flex flex-wrap gap-3">
        {value.map((src, index) => (
          <div
            key={`${src}:${index}`}
            className="w-24 rounded-lg border border-slate-200 bg-white p-2"
          >
            <ProductImage
              src={src}
              alt={`${translations.productDetails.image} ${index + 1}`}
              className="aspect-square w-full"
            />
            <div className="flex justify-between gap-1">
              <button
                type="button"
                disabled={busy || index === 0}
                aria-label={`${t.moveLeft} ${index + 1}`}
                onClick={() => {
                  const next = [...value];
                  [next[index - 1], next[index]] = [
                    next[index],
                    next[index - 1],
                  ];
                  onChange(next);
                }}
                className="px-1 py-2 text-blue-700 disabled:opacity-25"
              >
                ←
              </button>
              <button
                type="button"
                disabled={busy}
                aria-label={`${t.removeImage} ${index + 1}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="px-1 py-2 text-red-700"
              >
                ×
              </button>
              <button
                type="button"
                disabled={busy || index === value.length - 1}
                aria-label={`${t.moveRight} ${index + 1}`}
                onClick={() => {
                  const next = [...value];
                  [next[index + 1], next[index]] = [
                    next[index],
                    next[index + 1],
                  ];
                  onChange(next);
                }}
                className="px-1 py-2 text-blue-700 disabled:opacity-25"
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
