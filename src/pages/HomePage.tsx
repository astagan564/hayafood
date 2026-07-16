import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { Link } from '../lib/router';
import { BrandFlame } from '../components/Logo';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-accent-500 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-4 h-4 text-accent-300" />
                <span className="text-sm font-medium text-white">Kripik Renyah Pilihan</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Camilan Renyah<br />
                <span className="text-accent-400">yang Bikin Nagih</span>
              </h1>
              <p className="mt-4 text-lg text-brand-100 max-w-md mx-auto md:mx-0">
                Kripik berkualitas dari bahan pilihan, diproduksi dengan standar terbaik. Pesan sekarang dan rasakan bedanya!
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  to="/produk"
                  className="inline-flex items-center justify-center gap-2 bg-accent-400 hover:bg-accent-300 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
                >
                  Lihat Produk
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=6282330903255&text=Assalamu%27alaikum%20mau%20order%20dong%20kak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/20"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 overflow-hidden flex items-center justify-center shadow-2xl">
                  <img
                    src="https://tzzdbbdqxrvjyupigowq.supabase.co/storage/v1/object/public/product-images/Screenshot%20From%202026-07-16%2019-46-00.png"
                    alt="Produk HayaFood"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 animate-fade-in">
                  <div className="text-2xl font-bold text-brand-600">100%</div>
                  <div className="text-xs text-gray-500">Renyah & Enak</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 animate-fade-in">
                  <div className="text-2xl font-bold text-accent-500">Halal</div>
                  <div className="text-xs text-gray-500">Tersertifikasi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BrandFlame, title: 'Renyah & Gurih', desc: 'Dibuat dari bahan pilihan dengan resep khusus untuk rasa terbaik.' },
            { icon: Truck, title: 'Pengiriman Cepat', desc: 'Pesanan dikirim ke seluruh Indonesia dengan packaging aman.' },
            { icon: ShieldCheck, title: 'Kualitas Terjamin', desc: 'Produksi bersih dan higienis, kualitas terjaga di setiap batch.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Produk Terbaru</h2>
          <Link to="/produk" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-accent-400 to-accent-500 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mau Pesan dalam Jumlah Banyak?
          </h2>
          <p className="text-gray-800 mb-6 max-w-lg mx-auto">
            Hubungi kami langsung via WhatsApp untuk pemesanan grosir dan dapatkan penawaran spesial.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=6282330903255&text=Assalamu%27alaikum%20mau%20order%20dong%20kak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
          >
            Chat WhatsApp Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
