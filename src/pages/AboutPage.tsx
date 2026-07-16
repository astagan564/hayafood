import { Flame, Heart, Target, Users, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center mb-4">
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Tentang Hayafood</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Hayafood adalah brand kripik lokal yang menghadirkan camilan renyah berkualitas dari bahan pilihan terbaik untuk seluruh keluarga Indonesia.
        </p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cerita Kami</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Hayafood lahir dari kecintaan kami terhadap camilan kripik yang renyah dan berkualitas. Berawal dari dapur rumahan,
          kami terus mengembangkan resep dan memilih bahan-bahan terbaik untuk menghasilkan kripik yang tidak hanya renyah,
          tetapi juga aman dan sehat untuk dikonsumsi.
        </p>
        <p className="text-gray-600 leading-relaxed">
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
          <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <v.icon className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center">
        <Heart className="w-10 h-10 text-accent-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Pesan Kripik Favoritmu Sekarang!</h2>
        <p className="text-brand-100 mb-6">Rasakan renyahnya kripik berkualitas dari Hayafood</p>
        <a
          href="/produk"
          className="inline-flex items-center gap-2 bg-accent-400 hover:bg-accent-300 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
          onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '/produk'); window.dispatchEvent(new PopStateEvent('popstate')); }}
        >
          Lihat Produk
        </a>
      </div>
    </div>
  );
}
