import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Link } from '../lib/router';
import { Logo } from './Logo';

// TikTok tidak tersedia di lucide-react — gunakan SVG resmi TikTok
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.26 8.26 0 0 0 4.83 1.54V6.72a4.85 4.85 0 0 1-1.06-.03z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-16 w-auto" textColor="#ffffff" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Kripik renyah berkualitas dari bahan pilihan. Camilan favorit untuk segala suasana.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent-400 transition-colors">Beranda</Link></li>
              <li><Link to="/produk" className="hover:text-accent-400 transition-colors">Produk</Link></li>
              <li><Link to="/tentang" className="hover:text-accent-400 transition-colors">Tentang</Link></li>
              <li><Link to="/lacak" className="hover:text-accent-400 transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/admin" className="hover:text-accent-400 transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>+62 823-3090-3255</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>hayafood.id@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <a
                  href="https://share.google/BK3AKsqcAJnLJuaZ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-400 transition-colors underline underline-offset-2"
                >
                  Jl. Ceplukan, Dsn. Sere, Desa Bangorejo, Kecamatan Bangorejo, Kabupaten Banyuwangi, Jawa Timur 68487, Indonesia
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/hayafood.id/" target="_blank"
                  rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@hayafood.id" target="_blank"
                  rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Hayafood. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
