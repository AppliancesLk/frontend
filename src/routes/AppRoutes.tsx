import { createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import App from '../App';
import CartPage from '../pages/Customer/Cart';
import ProductEditPage from '../pages/Admin/Products/Edit';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailsPage from '../pages/Customer/ProductDetails';
import LoginPage from '../pages/Auth/Login';
import RegisterPage from '../pages/Auth/Register';
import ForbiddenPage from '../pages/Auth/Forbidden';
import ProfilePage from '../pages/Customer/Profile';
import AdminProductsPage from '../pages/Admin/Products';
import CategoriesPage from '../pages/Admin/Categories';
import InventoryPage from '../pages/Admin/Inventory';
import DashboardPage from '../pages/Admin/Dashboard';
import RepairerDashboardPage from '../pages/Repairer/Dashboard';
import NotFoundPage from '../pages/NotFound';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { USER_ROLES } from '../constants/roles';
export const appRoutes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<CustomerLayout />}>
      <Route
        path={ROUTES.home}
        element={<Navigate to={ROUTES.products} replace />}
      />
      <Route path={ROUTES.products} element={<ProductsPage />} />
      <Route path={ROUTES.productDetail} element={<ProductDetailsPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.account} element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute roles={[USER_ROLES.CUSTOMER]} />}>
        <Route path={ROUTES.cart} element={<CartPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={[USER_ROLES.REPAIRER]} />}>
        <Route path={ROUTES.repairer} element={<RepairerDashboardPage />} />
      </Route>
      <Route path={ROUTES.forbidden} element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route element={<ProtectedRoute roles={[USER_ROLES.ADMIN]} />}>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.admin} element={<DashboardPage />} />
        <Route path={ROUTES.adminProducts} element={<AdminProductsPage />} />
        <Route path={ROUTES.adminProductEdit} element={<ProductEditPage />} />
        <Route path={ROUTES.adminCategories} element={<CategoriesPage />} />
        <Route path={ROUTES.adminInventory} element={<InventoryPage />} />
      </Route>
    </Route>
  </Route>,
);
