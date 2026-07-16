import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Link } from './lib/router';
import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const path = useRouter();
  const { session, loading } = useAuth();

  // Admin routes
  if (path.startsWith('/admin')) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      );
    }
    if (path === '/admin' || path === '/admin/') {
      if (session) return <AdminDashboard />;
      return <AdminLoginPage />;
    }
    if (path === '/admin/dashboard') {
      if (session) return <AdminDashboard />;
      return <AdminLoginPage />;
    }
    return <AdminLoginPage />;
  }

  // Storefront routes
  let page: React.ReactNode;
  if (path === '/' || path === '') {
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
  } else {
    page = (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-gray-500 mb-6">Maaf sepertinya anda salah jalan</p>
        <Link to="/" className="text-brand-600 font-medium hover:underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
