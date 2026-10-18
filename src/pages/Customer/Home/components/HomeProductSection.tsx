import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import type { Product } from '../../../../types/product.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { AddToCart } from '../../../../components/common/AddToCart';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
const t = translations.storefront;
export function HomeProductSection({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
          {title}
        </h2>
        <Link
          to={ROUTES.products}
          className="text-sm font-semibold text-blue-700"
        >
          {t.viewAll} →
        </Link>
      </div>
      {!products.length ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          {t.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.productID}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              <Link
                to={generatePath(ROUTES.productDetail, {
                  id: product.productID,
                })}
                className="block bg-slate-50 p-5"
              >
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  className="aspect-square w-full"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-2 text-xs font-medium text-blue-700">
                  {product.category.name}
                </p>
                <h3 className="mb-3 font-semibold leading-6 text-slate-900">
                  <Link
                    to={generatePath(ROUTES.productDetail, {
                      id: product.productID,
                    })}
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mb-5 mt-auto text-xl font-bold tracking-tight text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <AddToCart
                  productId={product.productID}
                  available={product.stockQty > 0 && product.isActive}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
