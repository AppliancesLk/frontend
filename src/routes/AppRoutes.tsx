import { createRoutesFromElements, Route } from 'react-router-dom';
import HomePage from '../pages/Customer/Home';
import LiveChatPage from '../pages/Customer/LiveChat';
import AdminChatPage from '../pages/Admin/LiveChat';
import BannersPage from '../pages/Admin/Banners';
import ThemesPage from '../pages/Admin/Themes';
import PromotionsPage from '../pages/Admin/Promotions';
import PromotionEditorPage from '../pages/Admin/Promotions/Editor';
import App from '../App';
import CheckoutPage from '../pages/Customer/Checkout';
import OrdersPage from '../pages/Customer/Orders';
import OrderDetailsPage from '../pages/Customer/Orders/Details';
import RepairRequestPage from '../pages/Customer/Repairs/Request';
import RepairsPage from '../pages/Customer/Repairs';
import CustomerRepairDetailsPage from '../pages/Customer/Repairs/Details';
import CartPage from '../pages/Customer/Cart';
import ProductEditPage from '../pages/Admin/Products/Edit';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailsPage from '../pages/Customer/ProductDetails';
import LoginPage from '../pages/Auth/Login';
import RegisterPage from '../pages/Auth/Register';
import AccountActionPage from '../pages/Auth/AccountAction';
import LoyaltyPage from '../pages/Customer/Loyalty';
import UsersPage from '../pages/Admin/Users';
import ForbiddenPage from '../pages/Auth/Forbidden';
import ProfilePage from '../pages/Customer/Profile';
import AdminProductsPage from '../pages/Admin/Products';
import CategoriesPage from '../pages/Admin/Categories';
import InventoryPage from '../pages/Admin/Inventory';
import DashboardPage from '../pages/Admin/Dashboard';
import ReportsPage from '../pages/Admin/Reports';
import AdminOrdersPage from '../pages/Admin/Orders';
import AdminOrderDetailsPage from '../pages/Admin/Orders/Details';
import AdminRepairsPage from '../pages/Admin/Repairs';
import AdminRepairDetailsPage from '../pages/Admin/Repairs/Details';
import RepairerDashboardPage from '../pages/Repairer/Dashboard';
import RepairerRepairsPage from '../pages/Repairer/Repairs';
import RepairerRepairDetailsPage from '../pages/Repairer/Repairs/Details';
import NotFoundPage from '../pages/NotFound';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { USER_ROLES } from '../constants/roles';
export const appRoutes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<CustomerLayout />}>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.products} element={<ProductsPage />} />
      <Route path={ROUTES.productDetail} element={<ProductDetailsPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route
        path={ROUTES.verifyEmail}
        element={<AccountActionPage key="verify" mode="verify" />}
      />
      <Route
        path={ROUTES.forgotPassword}
        element={<AccountActionPage key="forgot" mode="forgot" />}
      />
      <Route
        path={ROUTES.resetPassword}
        element={<AccountActionPage key="reset" mode="reset" />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.account} element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute roles={[USER_ROLES.CUSTOMER]} />}>
        <Route path={ROUTES.liveChat} element={<LiveChatPage />} />
        <Route path={ROUTES.cart} element={<CartPage />} />
        <Route path={ROUTES.checkout} element={<CheckoutPage />} />
        <Route path={ROUTES.orders} element={<OrdersPage />} />
        <Route path={ROUTES.loyalty} element={<LoyaltyPage />} />
        <Route path={ROUTES.orderDetail} element={<OrderDetailsPage />} />
        <Route path={ROUTES.repairs} element={<RepairsPage />} />
        <Route path={ROUTES.repairRequest} element={<RepairRequestPage />} />
        <Route
          path={ROUTES.repairDetail}
          element={<CustomerRepairDetailsPage />}
        />
      </Route>
      <Route element={<ProtectedRoute roles={[USER_ROLES.REPAIRER]} />}>
        <Route path={ROUTES.repairer} element={<RepairerDashboardPage />} />
        <Route
          path={ROUTES.repairerRepairs}
          element={<RepairerRepairsPage />}
        />
        <Route
          path={ROUTES.repairerRepairDetail}
          element={<RepairerRepairDetailsPage />}
        />
      </Route>
      <Route path={ROUTES.forbidden} element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route element={<ProtectedRoute roles={[USER_ROLES.ADMIN]} />}>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.adminChat} element={<AdminChatPage />} />
        <Route path={ROUTES.admin} element={<DashboardPage />} />
        <Route path={ROUTES.adminBanners} element={<BannersPage />} />
        <Route path={ROUTES.adminThemes} element={<ThemesPage />} />
        <Route path={ROUTES.adminPromotions} element={<PromotionsPage />} />
        <Route path={ROUTES.adminReports} element={<ReportsPage />} />
        <Route
          path={`${ROUTES.adminPromotions}/:id`}
          element={<PromotionEditorPage />}
        />
        <Route path={ROUTES.adminProducts} element={<AdminProductsPage />} />
        <Route path={ROUTES.adminProductEdit} element={<ProductEditPage />} />
        <Route path={ROUTES.adminCategories} element={<CategoriesPage />} />
        <Route path={ROUTES.adminInventory} element={<InventoryPage />} />
        <Route path={ROUTES.adminOrders} element={<AdminOrdersPage />} />
        <Route path={ROUTES.adminUsers} element={<UsersPage />} />
        <Route
          path={ROUTES.adminOrderDetail}
          element={<AdminOrderDetailsPage />}
        />
        <Route path={ROUTES.adminRepairs} element={<AdminRepairsPage />} />
        <Route
          path={ROUTES.adminRepairDetail}
          element={<AdminRepairDetailsPage />}
        />
      </Route>
    </Route>
  </Route>,
);
