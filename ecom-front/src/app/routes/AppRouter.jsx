import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../../shared/guards/PrivateRoute";
import AdminRoute from "../../shared/guards/AdminRoute";
import Loader from "../../shared/components/Loader";
import BaseLayout from "../layouts/BaseLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

const HomePage = lazy(() => import("../../features/home/pages/HomePage"));
const ProductsPage = lazy(() => import("../../features/products/pages/ProductsPage"));
const AdminProductsPage = lazy(() => import("../../features/admin/pages/AdminProductsPage"));
const AdminCategoriesPage = lazy(() =>
  import("../../features/admin/pages/AdminCategoriesPage")
);
const AdminMessagesPage = lazy(() =>
  import("../../features/admin/pages/AdminMessagesPage")
);
const AboutPage = lazy(() => import("../../features/info/pages/AboutPage"));
const ContactPage = lazy(() => import("../../features/info/pages/ContactPage"));
const CartPage = lazy(() => import("../../features/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("../../features/checkout/pages/CheckoutPage"));
const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const OrdersPage = lazy(() => import("../../features/orders/pages/OrdersPage"));
const UserProfilePage = lazy(() =>
  import("../../features/profile/pages/UserProfilePage")
);
const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../../features/auth/pages/RegisterPage"));
const NotFoundPage = lazy(() => import("../../features/not-found/pages/NotFoundPage"));

function AppRouter() {
  return (
    <Suspense fallback={<Loader text="Loading page..." />}>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manage-products" element={<AdminProductsPage />} />
              <Route path="/manage-categories" element={<AdminCategoriesPage />} />
              <Route path="/manage-messages" element={<AdminMessagesPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<PrivateRoute publicPage />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
