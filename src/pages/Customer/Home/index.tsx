import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Icon } from '../../../components/common/Icon';
import { translations } from '../../../utils/translations';
import { useHomePage } from './hooks/useHomePage';
import { PromotionalBanner } from './components/PromotionalBanner';
import { HomeProductSection } from './components/HomeProductSection';
import { HomeCategorySection } from './components/HomeCategorySection';
const t = translations.storefront;
export default function HomePage() {
  const { data, retry } = useHomePage();
  const banner = (position: string) =>
    data?.banners.find((section) => section.position === position);
  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:px-6 md:space-y-16 md:py-8 lg:px-8">
      <PromotionalBanner section={banner('top')} />
      {banner('top')?.visible ? (
        <h1 className="sr-only">{t.siteDescription}</h1>
      ) : (
        <section className="relative overflow-hidden rounded-2xl bg-blue-700 px-6 py-10 text-white sm:px-12 md:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-24 h-80 w-80 rounded-full border-[48px] border-blue-600"
          />
          <div className="relative max-w-2xl">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-yellow-300">
              {t.eyebrow}
            </p>
            <h1 className="whitespace-pre-line text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
              {t.introduction}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="flex items-center gap-3 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-slate-900 hover:bg-yellow-300"
                to={ROUTES.products}
              >
                {t.shop}
                <Icon name="arrow" />
              </Link>
              <Link
                className="rounded-lg border border-blue-400 px-5 py-3 font-medium hover:bg-blue-600"
                to={ROUTES.repairRequest}
              >
                {t.bookRepair}
              </Link>
            </div>
          </div>
        </section>
      )}
      {!data ? (
        <p role="status" className="rounded-xl bg-white p-8 text-slate-500">
          {t.loading}
        </p>
      ) : (
        <>
          {data.errors.length > 0 && (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
            >
              {[...new Set(data.errors)].map((error) => (
                <p key={error}>{error}</p>
              ))}
              <button
                onClick={retry}
                className="mt-3 rounded-lg border border-amber-400 px-4 py-2 font-medium"
              >
                {t.retry}
              </button>
            </div>
          )}
          <HomeCategorySection categories={data.categories} />
          <HomeProductSection
            products={data.products.slice(0, 8)}
            title={t.featured}
          />
          <PromotionalBanner section={banner('middle')} />
          {data.products.length > 8 && (
            <HomeProductSection
              products={data.products.slice(8, 12)}
              title={t.more}
            />
          )}
          <section className="grid gap-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-300 text-blue-900">
              <Icon name="repair" className="h-10 w-10" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {t.repairTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {t.repairDescription}
              </p>
            </div>
            <Link
              className="justify-self-start rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              to={ROUTES.repairRequest}
            >
              {t.bookRepair} →
            </Link>
          </section>
          <PromotionalBanner section={banner('bottom-one')} />
          <section
            aria-label={t.confidence}
            className="grid gap-6 border-y border-slate-200 py-8 md:grid-cols-3"
          >
            {t.highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="rounded-lg bg-yellow-100 p-3 text-blue-700">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </section>
          <PromotionalBanner section={banner('bottom-two')} />
        </>
      )}
    </main>
  );
}
