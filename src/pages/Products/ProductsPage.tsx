import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCategories } from '../../services/categoryService';
import {
  getProducts,
  getProductsByCategory,
} from '../../services/productService';

import type { Category } from '../../types/category.types';
import type { Product } from '../../types/product.types';

function ProductsPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategoryID, setSelectedCategoryID] =
    useState<string | null>(null);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const [categoryResult, productResult] = await Promise.allSettled([getCategories(), getProducts()]);
      if (!active) return;
      if (categoryResult.status === 'fulfilled') setCategories(categoryResult.value);
      if (productResult.status === 'fulfilled') setProducts(productResult.value);
      if (categoryResult.status === 'rejected' || productResult.status === 'rejected') setError('Unable to load the shop. Please try again.');
      setLoadingCategories(false);
      setLoadingProducts(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setError(null);

      const data = await getProducts();

      setProducts(data);
      setSelectedCategoryID(null);
    } catch {
      setError(
        'Unable to load products. Please try again.',
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategorySelect = async (
    categoryID: string,
  ) => {
    try {
      setLoadingProducts(true);
      setError(null);
      setSelectedCategoryID(categoryID);

      const data =
        await getProductsByCategory(categoryID);

      setProducts(data);
    } catch {
      setError(
        'Unable to load products. Please try again.',
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const parentCategories = categories.filter(
    (category) => category.parent === null,
  );

  const subCategories = categories.filter(
    (category) => category.parent !== null,
  );

  const selectedCategory = categories.find(
    (category) =>
      category.categoryID === selectedCategoryID,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Browse available appliances and filter them by
            category.
          </p>
        </header>

        <section className="mb-8 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a parent category or a sub category.
            </p>
          </div>

          {loadingCategories ? (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Loading categories...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  All Products
                </h3>

                <button
                  type="button"
                  onClick={loadProducts}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedCategoryID === null
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Products
                </button>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Parent Categories
                </h3>

                <div className="flex flex-wrap gap-2">
                  {parentCategories.map((category) => {
                    const isSelected =
                      selectedCategoryID ===
                      category.categoryID;

                    return (
                      <button
                        key={category.categoryID}
                        type="button"
                        onClick={() =>
                          handleCategorySelect(
                            category.categoryID,
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sub Categories
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {parentCategories.map((parent) => {
                    const children =
                      subCategories.filter(
                        (category) =>
                          category.parent?.categoryID ===
                          parent.categoryID,
                      );

                    if (children.length === 0) {
                      return null;
                    }

                    return (
                      <div
                        key={parent.categoryID}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h4 className="font-semibold text-slate-800">
                            {parent.name}
                          </h4>

                          <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                            {children.length}{' '}
                            {children.length === 1
                              ? 'sub category'
                              : 'sub categories'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {children.map(
                            (category) => {
                              const isSelected =
                                selectedCategoryID ===
                                category.categoryID;

                              return (
                                <button
                                  key={
                                    category.categoryID
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleCategorySelect(
                                      category.categoryID,
                                    )
                                  }
                                  className={`rounded-lg px-3 py-2 text-sm transition ${
                                    isSelected
                                      ? 'bg-slate-900 text-white'
                                      : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'
                                  }`}
                                >
                                  {category.name}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedCategory
                  ? selectedCategory.name
                  : 'All Products'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedCategory
                  ? `Showing products in ${selectedCategory.name}`
                  : 'Showing products from all categories'}
              </p>
            </div>

            {!loadingProducts && !error && (
              <span className="text-sm text-slate-500">
                {products.length}{' '}
                {products.length === 1
                  ? 'product'
                  : 'products'}
              </span>
            )}
          </div>

          {loadingProducts && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">
                Loading products...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {!loadingProducts &&
            !error &&
            products.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">
                  {selectedCategoryID
                    ? 'No products found in this category.'
                    : 'No products available.'}
                </p>
              </div>
            )}

          {!loadingProducts &&
            !error &&
            products.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product.productID}
                    onClick={() =>
                      navigate(
                        `/products/${product.productID}`,
                      )
                    }
                    className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-slate-100">
                        <span className="text-sm text-slate-400">
                          No image available
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                            product.stockQty > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stockQty > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </div>

                      <p className="mb-3 text-xl font-bold text-slate-900">
                        Rs.{' '}
                        {Number(
                          product.price,
                        ).toLocaleString('en-LK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">
                            Category:
                          </span>{' '}
                          {product.category.name}
                        </p>

                        <p>
                          <span className="font-medium">
                            SKU:
                          </span>{' '}
                          {product.SKU}
                        </p>

                        <p>
                          <span className="font-medium">
                            Stock:
                          </span>{' '}
                          {product.stockQty}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <span className="text-sm font-medium text-slate-700">
                          View product →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default ProductsPage;