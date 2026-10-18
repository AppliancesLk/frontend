import { useEffect, useState } from 'react';
import { getProducts } from '../../../../services/productService';
import { getCategories } from '../../../../services/categoryService';
import { getBanners } from '../../../../services/bannerService';
import type { Product } from '../../../../types/product.types';
import type { Category } from '../../../../types/category.types';
import type { BannerSection } from '../../../../types/banner.types';
import { translations } from '../../../../utils/translations';
const t = translations.storefront;
export function useHomePage() {
  const [data, setData] = useState<{
    products: Product[];
    categories: Category[];
    banners: BannerSection[];
    errors: string[];
  } | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      getProducts(),
      getCategories(),
      getBanners(),
    ]).then(([products, categories, banners]) => {
      if (!active) return;
      setData({
        products: products.status === 'fulfilled' ? products.value : [],
        categories: categories.status === 'fulfilled' ? categories.value : [],
        banners: banners.status === 'fulfilled' ? banners.value : [],
        errors: [
          products.status === 'rejected' ? t.loadError : '',
          categories.status === 'rejected' ? t.loadError : '',
          banners.status === 'rejected' ? t.bannerError : '',
        ].filter(Boolean),
      });
    });
    return () => {
      active = false;
    };
  }, [revision]);
  return {
    data,
    retry: () => {
      setData(null);
      setRevision((value) => value + 1);
    },
  };
}
