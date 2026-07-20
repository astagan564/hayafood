import { useState, useEffect } from 'react';
import { Menu, ShoppingCart, Home, ShoppingBag, Info, Truck, ShieldCheck, ChevronDown, Flame, Sparkles, PackageCheck } from 'lucide-react';
import { Link, navigate } from '@/lib/router';
import { useRouter } from '@/hooks/useRouter';
import { useCart } from '@/hooks/useCart';
import { Logo } from './Logo';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
  const path = useRouter();

  const isHomePage = path === '/' || path === '';
  const useTransparentHeroNavbar = isHomePage && !isScrolled;

  const navLinks = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/tentang', label: 'Tentang Kami', icon: Info },
    { to: '/lacak', label: 'Lacak Pesanan', icon: Truck },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        useTransparentHeroNavbar
          ? 'bg-transparent border-b border-transparent shadow-none'
          : 'glass-luxury border-b border-amber-500/30 shadow-lg shadow-amber-950/10'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <Logo
              className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              textColor={useTransparentHeroNavbar ? "#ffffff" : "#e11d48"}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-bold tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${
                useTransparentHeroNavbar
                  ? 'text-white hover:text-amber-300 drop-shadow-sm'
                  : 'text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Beranda
            </Link>

            {/* Shadcn UI Dropdown Menu for Catalog */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`text-sm font-bold tracking-wide transition-colors py-1 flex items-center gap-1.5 cursor-pointer outline-none ${
                    useTransparentHeroNavbar
                      ? 'text-white hover:text-amber-300 drop-shadow-sm'
                      : 'text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  <span>Katalog Produk</span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5] opacity-80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Kurasi Produk</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/produk')}>
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span>Semua Produk</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/produk')}>
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Keripik Pentol Signature</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/produk')}>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Variasi Rasa Gourmet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/produk')}>
                  <PackageCheck className="w-4 h-4 text-amber-500" />
                  <span>Hampers & Paket Grosir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-bold tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${
                  useTransparentHeroNavbar
                    ? 'text-white hover:text-amber-300 drop-shadow-sm'
                    : 'text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side controls - Unified Non-Flickering Styling */}
          <div className="flex items-center gap-3">
            {/* Dark/Light Mode Theme Toggle Button */}
            <ThemeToggle />

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigate('/keranjang')}
              className="relative p-2.5 rounded-xl glass-luxury border border-amber-500/30 hover:border-amber-500/60 text-gray-900 dark:text-white transition-all duration-300 cursor-pointer gold-border-glow"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[11px] font-extrabold flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              to="/admin"
              className="hidden md:inline-flex text-xs font-bold tracking-wider uppercase transition-all duration-300 px-4 py-2 rounded-xl glass-luxury border border-amber-500/30 hover:border-amber-500/60 text-amber-700 dark:text-amber-400 gold-border-glow"
            >
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 rounded-xl glass-luxury border border-amber-500/30 text-gray-900 dark:text-white transition-colors cursor-pointer gold-border-glow"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Reusable Mobile Bottom Sheet for Navigation */}
        <MobileBottomSheet
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          title="Hayafood.id"
        >
          <div className="space-y-2 py-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl text-base font-bold text-gray-900 dark:text-white hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border border-amber-500/15"
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-amber-500/20 mt-2 space-y-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl glass-luxury border border-amber-500/20">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Mode Tampilan</span>
                <ThemeToggle />
              </div>

              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-amber-500/10 transition-colors border border-dashed border-amber-500/30"
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span>Portal Admin Hayafood</span>
              </Link>
            </div>
          </div>
        </MobileBottomSheet>
      </nav>
    </header>
  );
}
