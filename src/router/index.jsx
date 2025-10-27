import { createBrowserRouter } from "react-router-dom"
import { Suspense, lazy } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load page components
const Homepage = lazy(() => import("@/components/pages/Homepage"))
const CategoryPage = lazy(() => import("@/components/pages/CategoryPage"))
const ProductPage = lazy(() => import("@/components/pages/ProductPage"))
const CartPage = lazy(() => import("@/components/pages/CartPage"))
const CheckoutPage = lazy(() => import("@/components/pages/CheckoutPage"))
const AccountPage = lazy(() => import("@/components/pages/AccountPage"))
const BrandPage = lazy(() => import("@/components/pages/BrandPage"))
const DealsPage = lazy(() => import("@/components/pages/DealsPage"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))
const ProductsPage = lazy(() => import("@/components/pages/ProductsPage"))
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Homepage />
      </Suspense>
    ),
  },
{
    path: "products",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductsPage />
      </Suspense>
    ),
  },
{
    path: "category/:slug",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CategoryPage />
      </Suspense>
    ),
  },
  {
    path: "product/:slug",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductPage />
      </Suspense>
    ),
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CheckoutPage />
      </Suspense>
    ),
  },
  {
    path: "account",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AccountPage />
      </Suspense>
    ),
  },
  {
    path: "brand/:slug",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <BrandPage />
      </Suspense>
    ),
  },
  {
    path: "deals",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <DealsPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  }
]

export const router = createBrowserRouter(routes)