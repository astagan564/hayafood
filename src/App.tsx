import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Link } from './lib/router';
import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Page-level lazy imports — each page is loaded only when navigated to
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#090D16]">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );
}

function AppRoutes() {
  const path = useRouter();
  const { session, loading } = useAuth();

  // Admin routes
  if (path.startsWith('/admin')) {
    if (loading) return <PageLoader />;
    if (path === '/admin' || path === '/admin/' || path === '/admin/dashboard') {
      if (session) return <AdminDashboard />;
      return <AdminLoginPage />;
    }
    return <AdminLoginPage />;
  }

  // Storefront routes
  const isHomePage = path === '/' || path === '';
  let page: React.ReactNode;
  if (isHomePage) {
    page = <HomePage />;
  } else if (path === '/produk') {
    page = <CatalogPage />;
  } else if (path.startsWith('/produk/')) {
    page = <ProductDetailPage productId={path.split('/produk/')[1]} />;
  } else if (path === '/keranjang') {
    page = <CartPage />;
  } else if (path === '/checkout') {
    page = <CheckoutPage />;
  } else if (path === '/tentang') {
    page = <AboutPage />;
  } else if (path === '/lacak') {
    page = <TrackingPage />;
  } else {
    page = (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-gray-950 dark:text-white mb-4">404</h1>
        <p className="text-gray-700 dark:text-gray-300 font-semibold mb-6">Maaf sepertinya Anda salah jalan</p>
        <Link to="/" className="text-amber-500 font-bold hover:underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#090D16] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className={`flex-1 ${isHomePage ? '' : 'pt-16 sm:pt-20'}`}>
        <Suspense fallback={<PageLoader />}>
          {page}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
