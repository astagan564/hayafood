import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Sparkles, ArrowRight, Star, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { Link } from '../lib/router';
import { BrandFlame } from '../components/Logo';

const testimonials = [
  {
    nama: 'Diana Siswati',
    kota: 'Banyuwangi',
    ulasan: 'Cemilannya enak sekali apalagi yang rasa original cocok dikonsumsi dengan nasi pecel',
    rating: 5,
    inisial: 'DS',
    warnaBg: 'bg-brand-50 text-brand-600',
  },
  {
    nama: 'Mus Sriatun',
    kota: 'Banyuwangi',
    ulasan: 'Kripik Pentolnya juara! Enak bngt keripiknya 😋👍🏻',
    rating: 5,
    inisial: 'MS',
    warnaBg: 'bg-accent-100 text-accent-700',
  },
  {
    nama: 'Nur Imamah',
    kota: 'Banyuwangi',
    ulasan: 'Respons penjual cepat dan ramah sekali. Pengiriman cepat dan kripik rasanya premium dengan harga terjangkau, setiap lebaran pasti selalu beli di Hayafood.',
    rating: 5,
    inisial: 'NI',
    warnaBg: 'bg-blue-50 text-blue-600',
  },
];

interface InstagramEmbed {
  id: string;
  embed_url: string;
  label: string | null;
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [instagramEmbeds, setInstagramEmbeds] = useState<InstagramEmbed[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
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

    supabase
      .from('instagram_embeds')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true })
      .limit(12)
      .then(({ data }) => {
        setInstagramEmbeds(data || []);
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
 
      {/* Testimonials */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Apa Kata Mereka?</h2>
            <p className="text-gray-500 text-sm">Testimoni jujur dari pelanggan setia camilan Hayafood</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed mb-6">
                    "{t.ulasan}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 text-sm ${t.warnaBg}`}>
                    {t.inisial}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{t.nama}</h4>
                    <p className="text-xs text-gray-400">{t.kota}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google Reviews CTA */}
          <div className="mt-10 text-center">
            <a
              href="https://search.google.com/local/reviews?placeid=ChIJ9Q8gA43_0y0R0xVnqNvjlBM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border border-gray-200 hover:border-brand-400 hover:shadow-md rounded-2xl px-5 py-3 transition-all group"
            >
              {/* Google "G" logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-400 leading-none mb-0.5">Puas dengan pesanan Anda?</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
                  Beri Ulasan di Google Maps ↗
                </p>
              </div>
              <div className="flex gap-0.5 ml-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Videos */}
      {instagramEmbeds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 rounded-full px-4 py-1.5 mb-4">
              <Instagram className="w-4 h-4" />
              <span className="text-sm font-semibold">Hayafood di Instagram</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Keseruan & Testimoni</h2>
            <p className="text-gray-500 text-sm">Lihat keseruan dan testimoni renyah kami di Instagram</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {instagramEmbeds.slice(0, visibleCount).map((emb) => (
              <div key={emb.id} className="flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-[320px] mx-auto">
                <div className="w-full aspect-[9/16] max-h-[440px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <iframe
                    src={emb.embed_url}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                    title={emb.label || 'Instagram Embed'}
                  />
                </div>
                {emb.label && (
                  <p className="mt-3 font-semibold text-gray-800 text-sm text-center line-clamp-1 w-full pl-1 pr-1">
                    {emb.label}
                  </p>
                )}
              </div>
            ))}
          </div>

          {instagramEmbeds.length > visibleCount && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="inline-flex items-center justify-center bg-white border-2 border-brand-600 text-brand-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-50 transition-all text-sm cursor-pointer"
              >
                Lihat Lebih Banyak
              </button>
            </div>
          )}
        </section>
      )}
 
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
