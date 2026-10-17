import { useState } from 'react';
import { getProductImages } from '../helpers/product-details.helpers';
import { ProductImage } from '../../../../components/common/ProductImage';
import { translations } from '../../../../utils/translations';
const t = translations.productDetails;
export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const items = getProductImages(images);
  const [selected, setSelected] = useState(0);
  const index = selected < items.length ? selected : 0;
  return (
    <section aria-label={t.gallery} className="min-w-0">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <ProductImage
          src={items[index]}
          alt={`${name}${items.length > 1 ? ` - ${t.image} ${index + 1}` : ''}`}
          className="aspect-square w-full"
          eager
        />
        {items.length > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              aria-label={t.previousImage}
              onClick={() =>
                setSelected((index + items.length - 1) % items.length)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              &larr;
            </button>
            <span
              aria-live="polite"
              aria-atomic="true"
              className="text-xs text-slate-500"
            >
              {t.image} {index + 1} {t.of} {items.length}
            </span>
            <button
              type="button"
              aria-label={t.nextImage}
              onClick={() => setSelected((index + 1) % items.length)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto p-1">
          {items.map((src, imageIndex) => (
            <button
              key={src}
              type="button"
              aria-label={`${t.viewImage} ${imageIndex + 1}: ${name}`}
              aria-pressed={index === imageIndex}
              onClick={() => setSelected(imageIndex)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-2 transition-colors ${index === imageIndex ? 'border-blue-600' : 'border-slate-200 hover:border-blue-300'}`}
            >
              <ProductImage src={src} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
