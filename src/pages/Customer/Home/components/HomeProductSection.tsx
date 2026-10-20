import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import type { Product } from '../../../../types/product.types';
import { translations } from '../../../../utils/translations';
import { CatalogProductCard } from '../../../Products/components/CatalogProductCard';
import { EmptyState } from '../../../../components/ui/Feedback';
export function HomeProductSection({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-fg md:text-2xl">
          {title}
        </h2>
        <Link
          to={ROUTES.products}
          className="shrink-0 py-2 text-sm font-medium text-fg-link"
        >
          {translations.storefront.viewAll} &rarr;
        </Link>
      </div>
      {!products.length ? (
        <EmptyState title={translations.storefront.empty} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {products.map((product) => (
            <CatalogProductCard key={product.productID} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
