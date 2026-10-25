import { useEffect, useState } from 'react';
import { getBanners } from '../../../services/bannerService';
import {
  BANNER_POSITIONS,
  type BannerSection,
} from '../../../types/banner.types';
import { translations } from '../../../utils/translations';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { BannerSectionEditor } from './components/BannerSectionEditor';
const t = translations.storefront;
export default function BannersPage() {
  const [sections, setSections] = useState<BannerSection[] | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    void getBanners(true)
      .then((data) => {
        if (active) setSections(data);
      })
      .catch(() => {
        if (active) setError(t.loadError);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="ui-page-title text-fg">{t.banners}</h1>
      <p className="mb-8 mt-3 text-sm leading-6 text-fg-secondary">
        {t.bannerDescription}
      </p>
      <CatalogFeedback
        loading={!sections && !error}
        error={error}
        retry={() => {
          setError('');
          setRevision((value) => value + 1);
        }}
      />
      {sections && (
        <div className="space-y-6">
          {BANNER_POSITIONS.map((position) => (
            <BannerSectionEditor
              key={position}
              section={
                sections.find((section) => section.position === position) ?? {
                  position,
                  visible: false,
                  slides: [],
                }
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
