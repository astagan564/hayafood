import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, ArrowRight, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { Link } from '../lib/router';
import { BrandFlame } from '../components/Logo';
import { ProductSpotlightHero } from '../components/ui/ProductSpotlightHero';
import { ProcessStepperCarousel } from '../components/ui/ProcessStepperCarousel';
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials';

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
      {/* Product Spotlight Hero */}
      <ProductSpotlightHero />

      {/* Features - Luxury Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BrandFlame, title: 'Renyah & Gurih Artisanal', desc: 'Dibuat dari resep kustom pilihan dengan kualitas rasa gourmet terbaik.' },
            { icon: Truck, title: 'Pengiriman Eksklusif', desc: 'Dikemas dengan packaging protektif khusus untuk memastikan keutuhan renyah.' },
            { icon: ShieldCheck, title: 'Standar Kualitas Tinggi', desc: 'Proses produksi higienis bersertifikasi, mutu konsisten di setiap kemasan.' },
          ].map((f) => (
            <div key={f.title} className="glass-luxury rounded-3xl p-7 gold-border-glow hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 flex items-center justify-center mb-5 border border-amber-500/30">
                <f.icon className="w-7 h-7 text-amber-600 dark:text-amber-400 stroke-[2.2]" />
              </div>
              <h3 className="font-serif font-bold text-gray-950 dark:text-white text-xl mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-normal leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Stepper & Card Deck Carousel */}
      <ProcessStepperCarousel />

      {/* Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Koleksi Terpilih</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-950 dark:text-white tracking-tight mt-1">Koleksi Produk Gourmet</h2>
          </div>
          <Link to="/produk" className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1.5 transition-colors group">
            Lihat Semua Koleksi <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Animated Testimonials Showcase */}
      <AnimatedTestimonials />

      {/* Instagram Videos */}
      {instagramEmbeds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4 shadow-xs">
              <Instagram className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Hayafood di Instagram</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-950 dark:text-white mb-2">Cerita & Keseruan Komunitas</h2>
            <p className="text-gray-600 dark:text-gray-300 font-normal text-sm">Lihat pengalaman nikmat & ulasan pelanggan setia di Instagram resmi kami</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {instagramEmbeds.slice(0, visibleCount).map((emb) => (
              <div key={emb.id} className="flex flex-col items-center glass-luxury rounded-3xl p-4 gold-border-glow hover:shadow-2xl transition-all w-full max-w-[320px] mx-auto">
                <div className="w-full aspect-[9/16] max-h-[440px] rounded-2xl overflow-hidden bg-slate-950/20 border border-amber-500/20 flex items-center justify-center">
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
                  <p className="mt-3 font-semibold text-gray-900 dark:text-white text-sm text-center line-clamp-1 w-full pl-1 pr-1">
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
                className="inline-flex items-center justify-center glass-luxury border border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-bold px-7 py-3 rounded-2xl transition-all text-sm cursor-pointer shadow-md gold-border-glow"
              >
                Lihat Lebih Banyak
              </button>
            </div>
          )}
        </section>
      )}

      {/* CTA Luxury Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-2xl border border-amber-400/40">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-widest mb-3">Layanan Grosir & Pesanan Khusus</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 mb-3 tracking-tight">
              Pemesanan Skala Besar & Hampers Executive
            </h2>
            <p className="text-slate-900 font-medium mb-8 max-w-xl mx-auto text-base leading-relaxed">
              Hubungi tim kami via WhatsApp untuk paket spesial grosir, custom branding, atau pesanan bingkisan eksklusif.
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=6282330903255&text=Assalamu%27alaikum%20mau%20order%20grosir%20atau%20hampers%20executive%20dong%20kak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold px-9 py-4 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-base tracking-wide"
            >
              Hubungi Concierge WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
