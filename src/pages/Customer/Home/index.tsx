import { Link, generatePath } from 'react-router-dom';
import { ProductImage } from '../../../components/common/ProductImage';
import { ProductGridSkeleton } from '../../../components/feedback/ProductGridSkeleton';
import { ROUTES } from '../../../constants/routes';
import { Icon } from '../../../components/common/Icon';
import { formatCurrency } from '../../../utils/currency';
import { useHomePage } from './hooks/useHomePage';
import { PromotionalBanner } from './components/PromotionalBanner';
import { HomeProductSection } from './components/HomeProductSection';
import { HomeCategorySection } from './components/HomeCategorySection';
export default function HomePage() {
  const { data, retry } = useHomePage();
  const heroProduct =
    data?.products.find((product) => product.images[0] && product.isActive) ??
    data?.products[0];
  const banner = (position: string) =>
    data?.banners.find((section) => section.position === position);
  return (
    <main className="home-page shell-wide">
      <PromotionalBanner section={banner('top')} />
      {banner('top')?.visible ? (
        <h1 className="sr-only">Appliances and everyday technology</h1>
      ) : (
        <section className="home-hero">
          <div className="hero-copy">
            <h1>
              Made for your
              <br />
              everyday.
            </h1>
            <p>
              Good technology makes life a little easier. Discover appliances
              and electronics for the way you live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ROUTES.products}
                className="ui-button ui-button-primary"
              >
                Shop all products
              </Link>
              <Link
                to={ROUTES.repairRequest}
                className="ui-button ui-button-secondary"
              >
                Repair a device
              </Link>
            </div>
            <div className="hero-assurance">
              <Icon name="truck" className="h-4 w-4" />
              <span>Islandwide delivery</span>
              <span className="hero-assurance-dot" />
              <Icon name="chat" className="h-4 w-4" />
              <span>Real people. Ready to help.</span>
            </div>
          </div>
          <div className="hero-product-stage">
            {heroProduct ? (
              <Link
                className="hero-product"
                to={generatePath(ROUTES.productDetail, {
                  id: heroProduct.productID,
                })}
              >
                <ProductImage
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  eager
                  className="hero-product-image"
                />
                <div className="hero-product-label">
                  <div className="min-w-0">
                    <p className="text-xs text-fg-muted">
                      {heroProduct.brand || heroProduct.category.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold">
                      {heroProduct.name}
                    </p>
                  </div>
                  <p className="price shrink-0 text-sm font-semibold">
                    {formatCurrency(heroProduct.price)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hero-placeholder">
                <Icon name="appliance" className="h-32 w-32" />
                <p>Something good for every home.</p>
              </div>
            )}
          </div>
        </section>
      )}
      {!data ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <>
          {data.errors.length > 0 && (
            <div
              role="alert"
              className="ui-alert ui-tone-warning flex-wrap justify-between"
            >
              <p>{Array.from(new Set(data.errors)).join(' ')}</p>
              <button
                onClick={retry}
                className="font-semibold underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}
          <HomeCategorySection categories={data.categories} />
          <HomeProductSection
            title="Popular right now"
            products={data.products.slice(0, 8)}
          />
          <PromotionalBanner section={banner('middle')} />
          {data.products.length > 8 && (
            <HomeProductSection
              title="More to make life easier"
              products={data.products.slice(8, 16)}
            />
          )}
          <section className="home-repair">
            <div className="repair-art" aria-hidden="true">
              <Icon name="repair" className="h-20 w-20" />
            </div>
            <div>
              <h2>A little care. A longer life.</h2>
              <p>
                Keep the devices you love working for longer. Tell us what’s
                wrong and follow your repair, from request to ready.
              </p>
              <Link
                to={ROUTES.repairRequest}
                className="ui-button ui-button-primary mt-6"
              >
                Request a repair
              </Link>
            </div>
            <ol className="repair-steps">
              <li>
                <span>1</span>Tell us about your device
              </li>
              <li>
                <span>2</span>Get help from our team
              </li>
              <li>
                <span>3</span>Track your repair online
              </li>
            </ol>
          </section>
          <PromotionalBanner section={banner('bottom-one')} />
          <PromotionalBanner section={banner('bottom-two')} />
        </>
      )}
    </main>
  );
}
