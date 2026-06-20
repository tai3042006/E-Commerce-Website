import { lazy, Suspense, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./controllers/CartController";
import { ProductProvider } from "@/controllers/ProductController";
import { UIProvider } from "./context/UIContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ScrollToTop } from "./components/clofit/ScrollToTop";
import { PageSkeleton, HomeSkeleton, ProductSkeleton } from "./components/clofit/PageSkeleton";

const Index             = lazy(() => import("./pages/Index"));
const AllProducts       = lazy(() => import("./pages/shop/AllProducts"));
const MenCollection     = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.MenCollection })));
const WomenCollection   = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.WomenCollection })));
const ShoesCollection   = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.ShoesCollection })));
const AccessoriesCollection = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.AccessoriesCollection })));
const HoodiesCollection = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.HoodiesCollection })));
const TeesCollection    = lazy(() => import("./pages/shop/CollectionPage").then(m => ({ default: m.TeesCollection })));
const Product           = lazy(() => import("./pages/Product"));
const Cart              = lazy(() => import("./pages/Cart"));
const Checkout          = lazy(() => import("./pages/Checkout"));
const Wishlist          = lazy(() => import("./pages/Wishlist"));
const Account           = lazy(() => import("./pages/Account"));
const SearchPage        = lazy(() => import("./pages/Search"));
const SignIn            = lazy(() => import("./pages/SignIn"));
const SignUp            = lazy(() => import("./pages/SignUp"));
const NotFound          = lazy(() => import("./pages/NotFound"));
const AdminLogin        = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard    = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts     = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders       = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers    = lazy(() => import("./pages/admin/AdminCustomers"));

const queryClient = new QueryClient();

const Page = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

/**
 * Gate for every /admin/* route. Only an authenticated user with role "admin"
 * may pass through — everyone else is sent to the dedicated admin login page.
 * This also covers the "still loading session" case so a refresh doesn't
 * flash the dashboard before the auth check resolves.
 */
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><Page><Index /></Page></Suspense>} />
          <Route path="/shop" element={<Suspense fallback={<PageSkeleton />}><Page><AllProducts /></Page></Suspense>} />
          <Route path="/shop/men" element={<Suspense fallback={<PageSkeleton />}><Page><MenCollection /></Page></Suspense>} />
          <Route path="/shop/women" element={<Suspense fallback={<PageSkeleton />}><Page><WomenCollection /></Page></Suspense>} />
          <Route path="/shop/hoodies" element={<Suspense fallback={<PageSkeleton />}><Page><HoodiesCollection /></Page></Suspense>} />
          <Route path="/shop/tees" element={<Suspense fallback={<PageSkeleton />}><Page><TeesCollection /></Page></Suspense>} />
          <Route path="/shop/shoes" element={<Suspense fallback={<PageSkeleton />}><Page><ShoesCollection /></Page></Suspense>} />
          <Route path="/shop/accessories" element={<Suspense fallback={<PageSkeleton />}><Page><AccessoriesCollection /></Page></Suspense>} />
          <Route path="/product/:id" element={<Suspense fallback={<ProductSkeleton />}><Page><Product /></Page></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<PageSkeleton />}><Page><Cart /></Page></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<PageSkeleton />}><Page><Checkout /></Page></Suspense>} />
          <Route path="/wishlist" element={<Suspense fallback={<PageSkeleton />}><Page><Wishlist /></Page></Suspense>} />
          <Route path="/account" element={<Suspense fallback={<PageSkeleton />}><Page><Account /></Page></Suspense>} />
          <Route path="/search" element={<Suspense fallback={<PageSkeleton />}><Page><SearchPage /></Page></Suspense>} />
          <Route path="/bag" element={<Navigate to="/cart" replace />} />
          <Route path="/favorites" element={<Navigate to="/wishlist" replace />} />
          <Route path="/signin" element={<Suspense fallback={null}><Page><SignIn /></Page></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={null}><Page><SignUp /></Page></Suspense>} />
          <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={null}><AdminRoute><AdminDashboard /></AdminRoute></Suspense>} />
          <Route path="/admin/products" element={<Suspense fallback={null}><AdminRoute><AdminProducts /></AdminRoute></Suspense>} />
          <Route path="/admin/orders" element={<Suspense fallback={null}><AdminRoute><AdminOrders /></AdminRoute></Suspense>} />
          <Route path="/admin/customers" element={<Suspense fallback={null}><AdminRoute><AdminCustomers /></AdminRoute></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><Page><NotFound /></Page></Suspense>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UIProvider>
            <WishlistProvider>
              <CartProvider>
                <ProductProvider>
                  <OrderProvider>
                    <NotificationProvider>
                      <AnimatedRoutes />
                    </NotificationProvider>
                  </OrderProvider>
                </ProductProvider>
              </CartProvider>
            </WishlistProvider>
          </UIProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
