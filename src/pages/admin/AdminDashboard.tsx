import { useState } from 'react';
import { Flame, LayoutDashboard, Package, Tag, ShoppingCart, LogOut, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Link, navigate } from '../../lib/router';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';

type Tab = 'overview' | 'products' | 'categories' | 'orders';

export function AdminDashboard() {
  const { signOut } = useAuth();
  const { show } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'categories', label: 'Kategori', icon: Tag },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
  ];

  const handleSignOut = async () => {
    await signOut();
    show('Anda telah keluar');
    navigate('/');
  };

  const handleNav = (t: Tab) => {
    setTab(t);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === item.id
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Flame className="w-4 h-4" />
            Lihat Toko
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 w-60 bg-white border-r border-gray-100 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === item.id ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <Link to="/" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
              <Flame className="w-4 h-4" />
              Lihat Toko
            </Link>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-semibold text-gray-800">
              {menuItems.find((m) => m.id === tab)?.label}
            </span>
          </div>
          {/* Add button on mobile header for products and categories */}
          {['products', 'categories'].includes(tab) && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('admin-add-item'))}
              className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors"
              aria-label="Tambah Baru"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {tab === 'overview' && <AdminOverview />}
          {tab === 'products' && <AdminProducts />}
          {tab === 'categories' && <AdminCategories />}
          {tab === 'orders' && <AdminOrders />}
        </div>
      </div>
    </div>
  );
}
