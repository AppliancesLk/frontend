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
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          items.length > 1 &&
          (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
        ) {
          event.preventDefault();
          setSelected(
            (index + (event.key === 'ArrowRight' ? 1 : items.length - 1)) %
              items.length,
          );
        }
      }}
      className="product-gallery min-w-0"
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
                className={`h-16 w-16 shrink-0 rounded-sm border-2 bg-well p-1 ${i === index ? 'border-primary' : 'border-line-subtle hover:border-primary'}`}
              >
                <ProductImage src={src} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        )}
        <div className="relative min-w-0 rounded-lg bg-well p-3">
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
                className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-subtle bg-surface "
              >
                ←
              </button>
              <button
                aria-label={t.nextImage}
                onClick={() => setSelected((index + 1) % items.length)}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-subtle bg-surface "
              >
                →
              </button>
            </>
          )}
          {items.length > 0 && (
            <button
              aria-label={translations.experience.zoom}
              onClick={() => dialog.current?.showModal()}
              className="absolute bottom-2 right-2 flex min-h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-xl text-fg-link "
            >
              ⤢
            </button>
          )}
          <p
            aria-live="polite"
            className="mt-3 text-center text-xs text-fg-muted"
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
        className="ui-dialog max-w-4xl"
      >
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => dialog.current?.close()}
            className="ui-button ui-button-secondary rounded-sm border border-line px-4 py-2 text-sm"
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
