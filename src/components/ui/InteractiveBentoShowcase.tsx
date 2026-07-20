import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, ShieldCheck, ShoppingBag, Check, ArrowRight, Award } from 'lucide-react';
import { Link } from '../../lib/router';

const TABS = [
  { id: 'all', label: 'Semua Keunggulan' },
  { id: 'bumbu', label: 'Bumbu Rempah' },
  { id: 'kemasan', label: 'Kemasan Kedap Udara' },
  { id: 'higienis', label: 'Standar Higienis' },
];

const BENTO_CARDS = [
  {
    id: 'hero-card',
    category: 'all',
    size: 'lg', // Large spans 2 cols on md+
    title: 'Kripik Hayafood Signature',
    subtitle: 'Diproduksi dengan Standar Kerenyahan Tingkat Tinggi',
    description: 'Dibuat dari singkong & bahan alami segar pilihan yang diiris presisi, kemudian dibalut bumbu khas Hayafood yang bikin nagih.',
    badge: 'Flagship Showcase',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    image: 'https://tzzdbbdqxrvjyupigowq.supabase.co/storage/v1/object/public/product-images/Screenshot%20From%202026-07-16%2019-46-00.png',
    stat: '100% Kriuk',
    statLabel: 'Terjamin Gurih',
  },
  {
    id: 'bumbu-card',
    category: 'bumbu',
    size: 'sm',
    icon: Flame,
    title: 'Racikan Bumbu Rempah Alami',
    subtitle: 'Tanpa Pengawet Sintesis',
    description: 'Dibalut racikan rempah asli Indonesia yang meresap sempurna hingga ke lapisan ter dalam kripik.',
    badge: '100% Alami',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accentColor: 'from-amber-500/20 to-red-500/10',
  },
  {
    id: 'kemasan-card',
    category: 'kemasan',
    size: 'sm',
    icon: ShoppingBag,
    title: 'Foil Aluminium Kedap Udara',
    subtitle: 'Kerenyahan Tahan Berbulan-bulan',
    description: 'Teknologi kemasan kedap udara bermutu tinggi untuk memastikan kerenyahan kripik tetap terjaga seperti baru diproduksi.',
    badge: 'Fresh Lock',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    accentColor: 'from-teal-500/20 to-emerald-500/10',
  },
  {
    id: 'higienis-card',
    category: 'higienis',
    size: 'sm',
    icon: ShieldCheck,
    title: 'Proses Higienis & 100% Halal',
    subtitle: 'Kualitas Terjamin di Setiap Batch',
    description: 'Seluruh tahap pemotongan, penggorengan, dan pengemasan dilakukan secara bersih dan higienis bersertifikasi.',
    badge: 'Halal Certified',
    badgeColor: 'bg-brand-500/10 text-emerald-300 border-brand-500/30',
    accentColor: 'from-emerald-500/20 to-brand-500/10',
  },
];

export function InteractiveBentoShowcase() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCards = BENTO_CARDS.filter(
    (card) => activeTab === 'all' || card.category === activeTab || card.id === 'hero-card'
  );

  return (
    <section className="relative bg-gradient-to-b from-gray-950 via-brand-950 to-gray-950 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>21st.dev Interactive Bento Gallery</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-accent-300">
            Mengapa Pilih Camilan Hayafood?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Temukan rahasia kelezatan dan standar kualitas terbaik yang membuat kripik Hayafood selalu menjadi favorit keluarga.
          </p>

          {/* Interactive Tab Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-gray-900/80 border border-gray-800 rounded-2xl max-w-2xl mx-auto backdrop-blur-xl">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 z-10 ${
                    isActive ? 'text-gray-950' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBentoTab"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute inset-0 bg-gradient-to-r from-accent-400 to-amber-400 rounded-xl -z-10 shadow-lg"
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Container */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => {
              const isHero = card.size === 'lg';
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`relative rounded-3xl border border-gray-800 overflow-hidden bg-gray-900/70 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl group transition-all duration-300 ${
                    isHero ? 'md:col-span-2 md:row-span-2 min-h-[380px]' : 'min-h-[260px]'
                  }`}
                >
                  {/* Subtle Gradient Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      card.accentColor || 'from-emerald-500/10 to-transparent'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Top Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${card.badgeColor}`}>
                        <Check className="w-3.5 h-3.5" />
                        {card.badge}
                      </span>
                      {isHero && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
                          <Award className="w-4 h-4" />
                          <span>Pilihan Utama</span>
                        </div>
                      )}
                    </div>

                    {Icon && (
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    )}

                    <h3 className={`font-black text-white leading-tight ${isHero ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1">
                      {card.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Image / Stats for Hero Card */}
                  {isHero && card.image && (
                    <div className="relative z-10 mt-6 pt-6 border-t border-gray-800/80 grid sm:grid-cols-2 gap-6 items-center">
                      <div className="aspect-video rounded-2xl overflow-hidden border border-gray-700 shadow-xl group-hover:border-emerald-500/50 transition-colors">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800">
                          <div className="text-2xl sm:text-3xl font-black text-accent-400">{card.stat}</div>
                          <div className="text-xs text-gray-400 font-medium">{card.statLabel}</div>
                        </div>
                        <Link
                          to="/produk"
                          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-extrabold text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
                        >
                          Lihat Katalog Produk
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {!isHero && (
                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
                      <span>Terjamin Kualitasnya</span>
                      <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
