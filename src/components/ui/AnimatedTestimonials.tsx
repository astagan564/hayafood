import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    nama: 'Diana Siswati',
    kota: 'Banyuwangi',
    ulasan: 'Cemilannya enak sekali apalagi yang rasa original, cocok banget dikonsumsi bareng keluarga saat bersantai!',
    rating: 5,
    inisial: 'DS',
    warnaBg: 'bg-brand-100 text-brand-950 dark:bg-brand-950 dark:text-accent-300 border-2 border-brand-300 dark:border-brand-800',
    produk: 'Hay Chips Original',
  },
  {
    nama: 'Mus Sriatun',
    kota: 'Banyuwangi',
    ulasan: 'Kripik Pentolnya juara! Enak bngt keripiknya, bumbunya melimpah dan renyah di setiap gigitan! 😋👍🏻',
    rating: 5,
    inisial: 'MS',
    warnaBg: 'bg-accent-200 text-gray-950 dark:bg-accent-950 dark:text-accent-300 border-2 border-accent-400 dark:border-accent-700',
    produk: 'Pentol Goreng Renyah',
  },
  {
    nama: 'Nur Imamah',
    kota: 'Banyuwangi',
    ulasan: 'Respons penjual cepat dan ramah sekali. Pengiriman cepat dan kripik rasanya premium dengan harga terjangkau, setiap lebaran pasti selalu beli di Hayafood.',
    rating: 5,
    inisial: 'NI',
    warnaBg: 'bg-brand-200 text-brand-950 dark:bg-gray-800 dark:text-white border-2 border-brand-300 dark:border-gray-700',
    produk: 'Paket Bundling Grosir',
  },
  {
    nama: 'Siti Rahmawati',
    kota: 'Surabaya',
    ulasan: 'Packing sangat aman dan pengiriman cepat sekali. Anak-anak di rumah suka banget sama kripik pentol gurihnya!',
    rating: 5,
    inisial: 'SR',
    warnaBg: 'bg-amber-100 text-amber-950 dark:bg-gray-800 dark:text-amber-300 border-2 border-amber-300 dark:border-gray-700',
    produk: 'Hay Chips Salted Egg',
  },
  {
    nama: 'Bagus Prasetyo',
    kota: 'Malang',
    ulasan: 'Kualitas rasa bintang lima, renyah tanpa pengawet. Rekomended buat yang cari cemilan khas Banyuwangi!',
    rating: 5,
    inisial: 'BP',
    warnaBg: 'bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-accent-300 border-2 border-brand-300 dark:border-brand-800',
    produk: 'Kripik Pentol Pedas',
  },
];

// Triplicate for seamless infinite running loop
const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export function AnimatedTestimonials() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24 border-t-2 border-b-2 border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-brand-600/10 dark:bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-400/10 dark:bg-accent-400/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10 text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-950 text-brand-900 dark:text-accent-300 border-2 border-brand-300 dark:border-brand-800 rounded-full px-4 py-1.5 mb-4 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-accent-400" />
          <span className="text-xs sm:text-sm font-black">Ulasan Pelanggan Setia</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-3"
        >
          Apa Kata Mereka?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-semibold leading-relaxed max-w-xl mx-auto"
        >
          Arahkan kursor ke atas kartu untuk jeda membaca ulasan
        </motion.p>
      </div>

      {/* Infinite Running Marquee Track with Native CSS Hover Pause & Resume */}
      <div
        className="relative w-full overflow-hidden py-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Edge Blurs */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20 pointer-events-none" />

        {/* Native CSS Continuous Marquee Track */}
        <div
          className="flex gap-6 w-max animate-continuous-marquee"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <div
              key={`${item.nama}-${index}`}
              className="w-[300px] sm:w-[380px] shrink-0 bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 shadow-xl hover:shadow-2xl transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Verified Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 stroke-[2]" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-brand-700 dark:text-accent-300 bg-brand-50 dark:bg-gray-800 px-2.5 py-1 rounded-full border border-brand-200 dark:border-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-accent-400 stroke-[3]" /> Terverifikasi
                  </span>
                </div>

                {/* Clean Testimonial Text (No Quote Marks) */}
                <p className="text-gray-950 dark:text-gray-100 text-sm sm:text-base font-semibold leading-relaxed mb-6">
                  {item.ulasan}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 shadow-md ${item.warnaBg}`}>
                  {item.inisial}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-gray-950 dark:text-white text-base truncate">{item.nama}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                    <span>{item.kota}</span>
                    <span>•</span>
                    <span className="text-brand-600 dark:text-accent-400 font-extrabold truncate">{item.produk}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Google Reviews CTA Button */}
      <div className="mt-10 text-center relative z-10">
        <a
          href="https://search.google.com/local/reviews?placeid=ChIJ9Q8gA43_0y0R0xVnqNvjlBM"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3.5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 hover:border-brand-600 dark:hover:border-accent-400 hover:shadow-2xl rounded-2xl px-6 py-4 transition-all group cursor-pointer"
        >
          {/* Google "G" logo */}
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          
          <div className="text-left">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold leading-none mb-1">Puas dengan pesanan Anda?</p>
            <p className="text-sm sm:text-base font-black text-gray-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-accent-400 transition-colors">
              Beri Ulasan Bintang 5 di Google Maps ↗
            </p>
          </div>

          <div className="flex gap-0.5 ml-2 hidden sm:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
        </a>
      </div>
    </section>
  );
}
