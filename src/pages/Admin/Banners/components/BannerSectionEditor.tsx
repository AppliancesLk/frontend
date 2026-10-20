import { Spinner } from '../../../../components/ui/Feedback';
import { useState } from 'react';
import type {
  BannerSection,
  BannerSlide,
} from '../../../../types/banner.types';
import {
  saveBanner,
  uploadBannerImage,
  bannerImageUrl,
} from '../../../../services/bannerService';
import { ProductImage } from '../../../../components/common/ProductImage';
import { translations } from '../../../../utils/translations';
const t = translations.storefront;

const fields = [
  'imageUrl',
  'alt',
  'title',
  'description',
  'buttonText',
  'href',
] as const;
const labels = {
  imageUrl: t.image,
  alt: t.alt,
  title: t.headline,
  description: t.description,
  buttonText: t.button,
  href: t.destination,
};
export function BannerSectionEditor({ section }: { section: BannerSection }) {
  const [draft, setDraft] = useState(section);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const busy = saving || uploading !== null;
  const limit = section.position === 'top' ? 4 : 1;
  function update(index: number, field: keyof BannerSlide, value: string) {
    setMessage('');
    setDraft((current) => ({
      ...current,
      slides: current.slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      ),
    }));
  }
  async function upload(index: number, file?: File) {
    if (!file) return;
    setError('');
    setMessage('');
    if (
      file.size > 5 * 1024 * 1024 ||
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
    ) {
      setError(t.uploadError);
      return;
    }
    setUploading(index);
    try {
      update(index, 'imageUrl', await uploadBannerImage(file));
    } catch {
      setError(t.uploadError);
    } finally {
      setUploading(null);
    }
  }
  async function save() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const saved = await saveBanner(draft.position, {
        visible: draft.visible,
        slides: draft.slides,
      });
      setDraft(saved);
      setMessage(t.saved);
    } catch {
      setError(t.saveError);
    } finally {
      setSaving(false);
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="rounded-md border border-line bg-surface p-5 sm:p-6"
    >
      <fieldset disabled={busy} className="min-w-0 ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-fg">
            {t.positions[draft.position]}
          </h2>
          <label className="flex items-center gap-3 text-sm font-medium text-fg-secondary">
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary"
              checked={draft.visible}
              onChange={(event) => {
                setDraft({ ...draft, visible: event.target.checked });
                setMessage('');
              }}
            />
            {t.visible}
          </label>
        </div>
        <p className="mt-3 text-sm leading-6 text-fg-muted">{t.imageHelp}</p>
        {!draft.slides.length && (
          <p className="my-5 text-sm text-fg-muted">0 / {limit}</p>
        )}
        <div className="mt-5 space-y-6">
          {draft.slides.map((slide, index) => (
            <div
              key={index}
              className="rounded-md border border-line bg-page p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">
                  {index + 1} / {limit}
                </h3>
                <button
                  type="button"
                  className="rounded-sm px-3 py-2 text-sm text-danger hover:bg-danger-bg"
                  onClick={() => {
                    setDraft({
                      ...draft,
                      slides: draft.slides.filter((_, i) => i !== index),
                    });
                    setMessage('');
                  }}
                >
                  {t.remove}
                </button>
              </div>
              {slide.imageUrl && (
                <ProductImage
                  src={bannerImageUrl(slide.imageUrl)}
                  alt={slide.alt || t.image}
                  className="mb-4 aspect-[8/3] w-full rounded-sm bg-surface"
                />
              )}
              <label className="mb-5 block text-sm font-medium text-fg-secondary">
                {uploading === index ? t.uploading : t.upload}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="mt-2 block w-full text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-primary-subtle file:px-4 file:py-2 file:text-fg-link"
                  onChange={(event) => {
                    void upload(index, event.target.files?.[0]);
                    event.target.value = '';
                  }}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label
                    key={field}
                    className={`block text-sm font-medium text-fg-secondary ${field === 'description' || field === 'imageUrl' ? 'sm:col-span-2' : ''}`}
                  >
                    {labels[field]}
                    <input
                      required={
                        field === 'imageUrl' ||
                        field === 'alt' ||
                        (field === 'href' && Boolean(slide.buttonText)) ||
                        (field === 'buttonText' && Boolean(slide.href))
                      }
                      maxLength={
                        field === 'alt'
                          ? 200
                          : field === 'title'
                            ? 100
                            : field === 'description'
                              ? 300
                              : field === 'buttonText'
                                ? 40
                                : 2048
                      }
                      value={slide[field]}
                      onChange={(event) =>
                        update(index, field, event.target.value)
                      }
                      className="ui-field mt-2 min-h-11 w-full rounded-sm border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                ))}
              </div>
              {draft.slides.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {[-1, 1].map((direction) => (
                    <button
                      type="button"
                      key={direction}
                      disabled={
                        index + direction < 0 ||
                        index + direction >= draft.slides.length
                      }
                      aria-label={
                        direction < 0 ? 'Move image up' : 'Move image down'
                      }
                      className="ui-button ui-button-secondary rounded-sm border border-line px-4 py-2 disabled:text-fg-disabled"
                      onClick={() => {
                        const slides = [...draft.slides];
                        [slides[index], slides[index + direction]] = [
                          slides[index + direction],
                          slides[index],
                        ];
                        setDraft({ ...draft, slides });
                        setMessage('');
                      }}
                    >
                      {direction < 0 ? '↑' : '↓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={draft.slides.length >= limit}
            onClick={() => {
              setDraft({
                ...draft,
                slides: [
                  ...draft.slides,
                  {
                    imageUrl: '',
                    alt: '',
                    title: '',
                    description: '',
                    buttonText: '',
                    href: '',
                  },
                ],
              });
              setMessage('');
            }}
            className="ui-button ui-button-secondary rounded-sm border border-line px-4 py-2 text-sm font-medium disabled:text-fg-disabled"
          >
            {t.addSlide} ({draft.slides.length}/{limit})
          </button>
          <button className="ui-button ui-button-primary rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-on hover:bg-primary-hover">
            {saving && <Spinner className="mr-2" />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </fieldset>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-sm bg-danger-bg p-3 text-sm text-danger"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-4 rounded-sm bg-success-bg p-3 text-sm text-success"
        >
          {message}
        </p>
      )}
    </form>
  );
}
