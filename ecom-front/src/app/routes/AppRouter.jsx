import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../../shared/guards/PrivateRoute";
import Loader from "../../shared/components/Loader";
import BaseLayout from "../layouts/BaseLayout";
import AuthLayout from "../layouts/AuthLayout";

const HomePage = lazy(() => import("../../features/home/pages/HomePage"));
const ProductsPage = lazy(() => import("../../features/products/pages/ProductsPage"));
const AboutPage = lazy(() => import("../../features/info/pages/AboutPage"));
const ContactPage = lazy(() => import("../../features/info/pages/ContactPage"));
const CartPage = lazy(() => import("../../features/cart/pages/CartPage"));
const AddProductPage = lazy(() => import("../../features/products/pages/AddProductPage"));
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
          <Route path="/add-product" element={<AddProductPage />} />
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
