import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award, Truck } from 'lucide-react';
import { Link } from '../../lib/router';

const FEATURE_BUBBLES = [
  {
    icon: Award,
    title: 'Kerenyahan',
    value: '100/100',
    color: 'text-amber-300 bg-amber-400/20 border-amber-400/50',
    delay: 0.2,
    position: 'top-2 -left-4 sm:top-4 sm:-left-8',
  },
  {
    icon: ShieldCheck,
    title: 'Sertifikasi',
    value: '100% Halal',
    color: 'text-yellow-300 bg-yellow-400/20 border-yellow-400/50',
    delay: 0.4,
    position: 'bottom-4 -left-2 sm:bottom-8 sm:-left-6',
  },
  {
    icon: Star,
    title: 'Rating',
    value: '5.0 ⭐ (Google)',
    color: 'text-accent-300 bg-accent-400/20 border-accent-400/50',
    delay: 0.6,
    position: 'top-8 -right-4 sm:top-12 sm:-right-8',
  },
  {
    icon: Truck,
    title: 'Pengiriman',
    value: 'Aman & Cepat',
    color: 'text-amber-200 bg-amber-300/20 border-amber-300/50',
    delay: 0.8,
    position: 'bottom-8 -right-2 sm:bottom-12 sm:-right-6',
  },
];

export function ProductSpotlightHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-gray-950 text-white min-h-[90vh] flex items-center pt-32 sm:pt-36 lg:pt-32 pb-12 md:pb-20 -mt-16 sm:-mt-20">
      {/* Background Ambient Glow FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/15 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-center lg:text-left pt-4 sm:pt-0"
          >
            {/* Pill Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600/30 to-accent-400/30 border border-amber-400/40 rounded-full px-4 py-2 text-xs sm:text-sm font-bold text-accent-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-accent-400 animate-pulse" />
              <span>Keripik Pentol Olahan Banyuwangi</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Sensasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-amber-300 to-yellow-400">Kriuk Renyah</span> Serunya Bikin Nagih!
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Nikmati camilan pentol goreng olahan khas Banyuwangi dengan bumbu gurih melimpah. Dibuat tanpa bahan pengawet dengan kemasan foil kedap udara.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/produk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-black px-8 py-4 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-base cursor-pointer"
              >
                Jelajahi Produk <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
              <a
                href="https://api.whatsapp.com/send?phone=6282330903255&text=Assalamu%27alaikum%20mau%20order%20Hayafood%20dong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-bold px-6 py-4 rounded-2xl transition-all text-base cursor-pointer"
              >
                Pesan via WhatsApp
              </a>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs sm:text-sm">
              <div>
                <span className="block text-xl sm:text-2xl font-black text-accent-400">1,000+</span>
                <span className="text-gray-400 font-semibold">Pelanggan Puas</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="block text-xl sm:text-2xl font-black text-accent-400">100%</span>
                <span className="text-gray-400 font-semibold">Bahan Alami</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="block text-xl sm:text-2xl font-black text-accent-400">5.0 ⭐</span>
                <span className="text-gray-400 font-semibold">Rating Google</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Ultra Luxury Glassmorphic Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-brand-600/40 via-accent-400/30 to-amber-500/20 blur-3xl animate-pulse" />

            {/* Luxury Glassmorphic Showcase Card */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] aspect-square rounded-3xl p-3 bg-gradient-to-b from-white/15 via-white/5 to-black/40 border border-amber-400/30 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] gold-border-glow flex flex-col justify-between group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80"
                  alt="Hay Chips Premium Showcase"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 left-5 right-5 text-left flex items-end justify-between">
                  <div>
                    <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full mb-1.5 shadow-md uppercase tracking-wider">
                      BEST SELLER 🔥
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white tracking-tight">Hay Chips Premium</h3>
                    <p className="text-xs text-amber-200/90 font-medium">Pentol Goreng Renyah khas Banyuwangi</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] text-amber-300/80 font-bold block uppercase tracking-wider">Harga</span>
                    <span className="text-base sm:text-lg font-serif font-bold gold-gradient-text">Rp 25.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Orbiting Badges */}
            {FEATURE_BUBBLES.map((bubble, i) => {
              const Icon = bubble.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: bubble.delay + 0.3, duration: 0.5 }}
                  className={`absolute z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-md border shadow-xl ${bubble.color} ${bubble.position}`}
                >
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider font-bold opacity-80">{bubble.title}</span>
                    <span className="block text-xs font-black leading-none">{bubble.value}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
