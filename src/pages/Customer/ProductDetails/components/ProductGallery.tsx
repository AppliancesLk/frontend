import { useRef, useState } from 'react';
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
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <section
      aria-label={t.gallery}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
    >
      <div
        className={`grid gap-3 ${items.length > 1 ? 'sm:grid-cols-[4rem_minmax(0,1fr)]' : ''}`}
      >
        {items.length > 1 && (
          <div className="order-2 flex gap-2 overflow-x-auto p-0.5 sm:order-none sm:max-h-[26rem] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
            {items.map((src, i) => (
              <button
                key={src}
                aria-label={`${t.viewImage} ${i + 1}: ${name}`}
                aria-pressed={i === index}
                onClick={() => setSelected(i)}
                className={`h-16 w-16 shrink-0 rounded-lg border-2 bg-slate-50 p-1 ${i === index ? 'border-blue-600' : 'border-slate-100 hover:border-blue-300'}`}
              >
                <ProductImage src={src} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        )}
        <div className="relative min-w-0">
          <ProductImage
            src={items[index]}
            alt={`${name}${items.length > 1 ? ` - ${t.image} ${index + 1}` : ''}`}
            eager
            className="aspect-square w-full p-3"
          />
          {items.length > 1 && (
            <>
              <button
                aria-label={t.previousImage}
                onClick={() =>
                  setSelected((index + items.length - 1) % items.length)
                }
                className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm"
              >
                ←
              </button>
              <button
                aria-label={t.nextImage}
                onClick={() => setSelected((index + 1) % items.length)}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm"
              >
                →
              </button>
            </>
          )}
          {items.length > 0 && (
            <button
              aria-label={translations.experience.zoom}
              onClick={() => dialog.current?.showModal()}
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-blue-700 shadow-sm"
            >
              ⤢
            </button>
          )}
          <p
            aria-live="polite"
            className="mt-3 text-center text-xs text-slate-400"
          >
            {items.length
              ? `${t.image} ${index + 1} ${t.of} ${items.length}`
              : t.noImage}
          </p>
        </div>
      </div>
      <dialog
        ref={dialog}
        aria-label={translations.experience.zoom}
        className="fixed inset-0 m-auto max-h-[95vh] w-[min(95vw,60rem)] rounded-2xl border border-slate-200 bg-white p-4 backdrop:bg-slate-900/60"
      >
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => dialog.current?.close()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            {translations.experience.close}
          </button>
        </div>
        <ProductImage
          src={items[index]}
          alt={name}
          className="max-h-[75vh] w-full"
        />
      </dialog>
    </section>
  );
}
