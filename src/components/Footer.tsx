import { Flame, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Haya<span className="text-accent-400">food</span>
              </span>
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
              <li><Link to="/admin" className="hover:text-accent-400 transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>+62 82-330-903-255</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>hello@hayafood.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span>Banyuwangi, Indonesia</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/hayafood.id/" target="_blank"
                  rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
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
