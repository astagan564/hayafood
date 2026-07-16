import { useState } from 'react';
import { Menu, X, ShoppingCart, Flame } from 'lucide-react';
import { Link, navigate } from '../lib/router';
import { useCart } from '../hooks/useCart';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/produk', label: 'Produk' },
    { to: '/tentang', label: 'Tentang' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-brand-700 tracking-tight">
              Haya<span className="text-accent-500">food</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/keranjang')}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              to="/admin"
              className="hidden md:inline-flex text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
            >
              Admin
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
