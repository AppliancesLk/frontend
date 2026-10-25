import { useEffect, useMemo, useState } from 'react';
import { deleteProductImage, uploadProductImage } from '../../services/productService';
import { ProductImage } from '../common/ProductImage';
import { translations } from '../../utils/translations';
const t = translations.experience;

export function ImageUploader({ value, onChange, max = 10, onBusyChange, productID, onPendingFilesChange }: {
  value: string[]; onChange: (value: string[]) => void; max?: number;
  onBusyChange?: (busy: boolean) => void; productID?: string;
  onPendingFilesChange?: (files: File[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<File[]>([]);
  const previews = useMemo(() => pending.map((file) => ({ file, src: URL.createObjectURL(file) })), [pending]);
  useEffect(() => () => previews.forEach(({ src }) => URL.revokeObjectURL(src)), [previews]);
  async function upload(files: File[]) {
    if (!files.length) return;
    setError('');
    if (files.length + value.length + pending.length > max || files.some((file) => file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setError(t.uploadError); return;
    }
    if (!productID) { const next = [...pending, ...files]; setPending(next); onPendingFilesChange?.(next); return; }
    setBusy(true); onBusyChange?.(true);
    const results = [...value];
    try { for (const file of files) results.push((await uploadProductImage(productID, file)).imageUrl); onChange(results); }
    catch { setError(t.uploadError); }
    finally { setBusy(false); onBusyChange?.(false); }
  }
  function remove(src: string, index: number) {
    if (!productID && index >= value.length) { const next = pending.filter((_file, i) => i !== index - value.length); setPending(next); onPendingFilesChange?.(next); return; }
    if (!productID) { onChange(value.filter((_item, i) => i !== index)); return; }
    const imageID = src.split('/').pop(); if (!imageID) return;
    setBusy(true); onBusyChange?.(true);
    void deleteProductImage(productID, imageID).then(() => onChange(value.filter((_item, i) => i !== index))).catch(() => setError(t.uploadError)).finally(() => { setBusy(false); onBusyChange?.(false); });
  }
  const items = [...value.map((src) => ({ src, pending: false })), ...previews.map(({ src }) => ({ src, pending: true }))];
  return <div className="space-y-3">
    <label className="block text-sm font-medium text-fg-secondary">{busy ? t.uploading : t.upload}
      <input disabled={busy || items.length >= max} type="file" multiple={max > 1} accept="image/png,image/jpeg,image/webp" onChange={(event) => { void upload(Array.from(event.target.files ?? [])); event.target.value = ''; }} className="mt-2 block w-full text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-primary-subtle file:px-4 file:py-2 file:text-fg-link" />
    </label>
    <p className="text-xs leading-5 text-fg-muted">{t.imageHelp} ({items.length}/{max})</p>
    <div className="flex flex-wrap gap-3">{items.map(({ src }, index) => <div key={`${src}:${index}`} className="w-24 rounded-sm border border-line bg-surface p-2">
      <ProductImage src={src} alt={`${translations.productDetails.image} ${index + 1}`} className="aspect-square w-full" />
      <button type="button" disabled={busy} aria-label={`${t.removeImage} ${index + 1}`} onClick={() => remove(src, index)} className="px-1 py-2 text-danger">×</button>
    </div>)}</div>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
  </div>;
}
