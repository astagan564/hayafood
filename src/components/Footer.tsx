import { Mail, Phone, MapPin, Instagram, ArrowRight } from 'lucide-react';
import { Link } from '../lib/router';
import { Logo } from './Logo';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.26 8.26 0 0 0 4.83 1.54V6.72a4.85 4.85 0 0 1-1.06-.03z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#090D16] text-gray-300 border-t border-amber-500/20 mt-20 relative overflow-hidden">
      {/* Background Subtle Shimmer Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center">
              <Logo className="h-14 w-auto" textColor="#ffffff" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-normal">
              Kudapan artisanal berkualitas tinggi dari bahan pilihan segar Banyuwangi. Kelezatan premium di setiap gigitan.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/hayafood.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all gold-border-glow"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.tiktok.com/@hayafood.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all gold-border-glow"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-base font-serif font-bold text-white mb-4 tracking-wide border-b border-amber-500/20 pb-2 inline-block">
              Navigasi Utama
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Beranda</Link></li>
              <li><Link to="/produk" className="hover:text-amber-400 transition-colors">Katalog Produk</Link></li>
              <li><Link to="/tentang" className="hover:text-amber-400 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/lacak" className="hover:text-amber-400 transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors text-amber-500/80">Portal Admin</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-base font-serif font-bold text-white mb-4 tracking-wide border-b border-amber-500/20 pb-2 inline-block">
              Layanan Pelanggan
            </h3>
            <ul className="space-y-3 text-sm font-normal">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-300 font-mono">+62 823-3090-3255</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-300">hayafood.id@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <a
                  href="https://share.google/BK3AKsqcAJnLJuaZ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-gray-400 leading-snug"
                >
                  Jl. Ceplukan, Dsn. Sere, Desa Bangorejo, Banyuwangi, Jawa Timur 68487
                </a>
              </li>
            </ul>
          </div>

          {/* VIP Culinary Club / Newsletter */}
          <div>
            <h3 className="text-base font-serif font-bold text-white mb-4 tracking-wide border-b border-amber-500/20 pb-2 inline-block">
              VIP Culinary Updates
            </h3>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Dapatkan informasi varian baru & penawaran eksklusif langsung ke email Anda.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Anda..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-white text-xs placeholder:text-gray-500 outline-none focus:border-amber-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  aria-label="Langganan"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="border-t border-amber-500/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Hayafood Gourmet. Artisanal Culinary Perfection.</p>
          <div className="flex gap-6">
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Privasi</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
