import { uiText } from '../../../utils/uiText';
import { ProductImage } from '../../../components/common/ProductImage';
import { LoadingState } from '../../../components/ui/Feedback';
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
  const heroProduct = data?.products.find((product) => product.images[0]);
  const banner = (position: string) =>
    data?.banners.find((section) => section.position === position);
  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:px-6 md:space-y-16 md:py-8 lg:px-8">
      <PromotionalBanner section={banner('top')} />
      {banner('top')?.visible ? (
        <h1 className="sr-only">{t.siteDescription}</h1>
      ) : (
        <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 lg:min-h-[30rem] lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-start justify-center px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-12">
            <p className="mb-5 text-xs font-semibold tracking-widest text-blue-300">
              {uiText.heroEyebrow}
            </p>
            <h1 className="whitespace-pre-line text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
              {uiText.heroTitle}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              {uiText.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className="ui-button ui-button-primary"
                to={ROUTES.products}
              >
                {uiText.heroExplore}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
                to={ROUTES.repairRequest}
              >
                {t.bookRepair}
              </Link>
            </div>
          </div>
          {heroProduct ? (
            <Link
              to={ROUTES.productDetail.replace(':id', heroProduct.productID)}
              className="relative flex min-h-64 flex-col items-center justify-center bg-slate-100 p-8 sm:p-12"
            >
              <ProductImage
                src={heroProduct.images[0]}
                alt={heroProduct.name}
                eager
                className="aspect-square w-full max-w-72 mix-blend-multiply"
              />
              <span className="mt-4 max-w-full text-center text-sm font-medium text-slate-700">
                {heroProduct.name}
              </span>
            </Link>
          ) : (
            <div
              aria-hidden="true"
              className="hidden items-center justify-center bg-slate-900 text-slate-700 lg:flex"
            >
              <Icon name="appliance" className="h-48 w-48" />
            </div>
          )}
        </section>
      )}
      {!data ? (
        <LoadingState label={t.loading} compact={false} />
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
          <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
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
                <span className="rounded-lg bg-blue-50 p-3 text-blue-700">
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
