import { Heart, Target, Users, Award } from 'lucide-react';
import { BrandFlame } from '../components/Logo';
import { navigate } from '../lib/router';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center mb-4 shadow-lg">
          <BrandFlame className="w-8 h-8" textColor="#ffffff" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">Tentang Hayafood</h1>
        <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-semibold max-w-2xl mx-auto leading-relaxed">
          Hayafood adalah brand kripik lokal yang menghadirkan camilan renyah berkualitas dari bahan pilihan terbaik untuk seluruh keluarga Indonesia.
        </p>
      </div>

      {/* Story */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 sm:p-10 mb-8 shadow-xl">
        <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-4">Cerita Kami</h2>
        <p className="text-gray-950 dark:text-gray-100 font-semibold leading-relaxed mb-4 text-base">
          Hayafood lahir dari kecintaan kami terhadap camilan kripik yang renyah dan berkualitas. Berawal dari dapur rumahan,
          kami terus mengembangkan resep dan memilih bahan-bahan terbaik untuk menghasilkan kripik yang tidak hanya renyah,
          tetapi juga aman dan sehat untuk dikonsumsi.
        </p>
        <p className="text-gray-950 dark:text-gray-100 font-semibold leading-relaxed text-base">
          Kini, Hayafood menyediakan berbagai varian kripik mulai dari pentol hingga kripik pisang.
          Semua produk kami diproduksi dengan standar higienis dan kualitas yang terjaga di setiap batch.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: Target, title: 'Misi Kami', desc: 'Menyediakan camilan kripik berkualitas tinggi dengan harga terjangkau untuk semua.' },
          { icon: Award, title: 'Kualitas', desc: 'Setiap produk diproduksi dengan standar terbaik dan bahan pilihan yang segar.' },
          { icon: Users, title: 'Untuk Semua', desc: 'Camilan yang cocok untuk segala usia dan suasana - bersantai, berkumpul, atau hadiah.' },
        ].map((v) => (
          <div key={v.title} className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-6 text-center shadow-md">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center mb-4 border border-brand-200 dark:border-brand-800">
              <v.icon className="w-6 h-6 text-brand-600 dark:text-accent-400 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-gray-950 dark:text-white text-lg mb-2">{v.title}</h3>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
        <Heart className="w-12 h-12 text-accent-400 mx-auto mb-4 stroke-[2.5]" />
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Pesan Kripik Favoritmu Sekarang!</h2>
        <p className="text-brand-100 font-bold mb-6 max-w-lg mx-auto text-base">Rasakan renyahnya kripik berkualitas dari Hayafood</p>
        <button
          onClick={() => navigate('/produk')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-400 via-amber-400 to-yellow-400 hover:from-accent-300 hover:to-yellow-300 text-gray-950 font-black px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 text-base cursor-pointer"
        >
          Lihat Katalog Produk ↗
        </button>
      </div>
    </div>
  );
}
