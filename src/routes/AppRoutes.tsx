import { Routes, Route, Navigate } from 'react-router-dom';

import AdminRoute from '../components/AdminRoute';
import InventoryPage from '../pages/Admin/Products/InventoryPage';
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

      <Route
        path="/admin/inventory"
        element={
          <AdminRoute>
            <InventoryPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
