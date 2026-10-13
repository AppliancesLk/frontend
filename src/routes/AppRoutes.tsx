import { Routes, Route, Navigate } from 'react-router-dom';

import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailPlaceholder from '../pages/Products/ProductDetailPlaceholder';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/products" replace />}
      />

      <Route
        path="/products"
        element={<ProductsPage />}
      />
      <Route
        path="/products/:id"
        element={<ProductDetailPlaceholder />}
      />
    </Routes>
  );
}

export default AppRoutes;