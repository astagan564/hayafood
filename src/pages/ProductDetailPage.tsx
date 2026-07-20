import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, Minus, Plus, Check, Star, ShieldCheck, Sparkles, Truck, Package, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { Link, navigate } from '../lib/router';
import { ProductCard } from '../components/ProductCard';
import { Interactive3DCard } from '../components/ui/Interactive3DCard';
import { AnimatedAddToCartButton } from '../components/ui/AnimatedAddToCartButton';

const TABS = [
  { id: 'deskripsi', label: 'Deskripsi Kurasi', icon: Sparkles },
  { id: 'storage', label: 'Penyimpanan & Kerenyahan', icon: Package },
  { id: 'pengiriman', label: 'Proteksi Pengiriman', icon: Truck },
];

export function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();

  useEffect(() => {
    setLoading(true);
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', productId)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!product || !product.category_id) {
      setRelatedProducts([]);
      return;
    }
    setRelatedLoading(true);
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .neq('id', product.id)
      .limit(4)
      .then(({ data }) => {
        setRelatedProducts(data || []);
        setRelatedLoading(false);
      });
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stok <= 0) {
      show('Produk ini sedang habis', 'error');
      return;
    }
    addToCart(product, jumlah);
    show(`${product.nama} ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stok <= 0) {
      show('Produk ini sedang habis', 'error');
      return;
    }
    addToCart(product, jumlah);
    navigate('/keranjang');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 md:pb-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-amber-500/10 rounded w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-amber-500/10 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-amber-500/10 rounded-xl w-3/4" />
              <div className="h-8 bg-amber-500/10 rounded-xl w-1/4" />
              <div className="h-32 bg-amber-500/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-950 dark:text-gray-100 text-2xl font-serif font-bold mb-4">Produk tidak ditemukan</p>
        <Link
          to="/produk"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 pb-28 md:pb-12 overflow-x-hidden">
      {/* Back Button */}
      <Link
        to="/produk"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-luxury border border-amber-500/30 text-gray-950 dark:text-white font-bold text-xs sm:text-sm hover:border-amber-500 shadow-sm transition-all mb-6 cursor-pointer gold-border-glow"
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" /> Kembali ke Katalog
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start max-w-full">
        
        {/* Left: Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-full"
        >
          <Interactive3DCard intensity={12} depthScale={1.03}>
            <div className="aspect-square rounded-3xl overflow-hidden glass-luxury border border-amber-500/30 shadow-2xl relative w-full">
              {product.gambar_url ? (
                <img src={product.gambar_url} alt={product.nama} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                  <ShoppingCart className="w-24 h-24" />
                </div>
              )}

              {/* Badges */}
              {product.categories && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  {product.categories.nama}
                </span>
              )}
              {product.stok <= 0 && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-amber-400 text-slate-950 px-6 py-2.5 rounded-full text-base font-bold shadow-2xl uppercase tracking-wider">
                    Stok Habis
                  </span>
                </div>
              )}
            </div>
          </Interactive3DCard>

          {/* Guarantee Badges Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 w-full max-w-full">
            <div className="glass-luxury border border-amber-500/20 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center min-w-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1 fill-amber-400" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-950 dark:text-white block truncate w-full">5.0 ⭐ Rating</span>
              <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 block truncate w-full">Ulasan Pembeli</span>
            </div>
            <div className="glass-luxury border border-amber-500/20 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center min-w-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1 stroke-[2.2]" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-950 dark:text-white block truncate w-full">100% Halal</span>
              <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 block truncate w-full">Bahan Premium</span>
            </div>
            <div className="glass-luxury border border-amber-500/20 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center min-w-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1 stroke-[2.2]" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-950 dark:text-white block truncate w-full">Proteksi Foil</span>
              <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 block truncate w-full">Segel Kedap Udara</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Product Info Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-luxury p-6 sm:p-9 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 w-full max-w-full overflow-hidden gold-border-glow"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-950 dark:text-white tracking-tight leading-tight break-words w-full max-w-full">
              {product.nama}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="text-2xl sm:text-4xl font-serif font-bold gold-gradient-text">
                {formatRupiah(product.harga)}
              </span>
              {product.stok > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 rounded-full shadow-xs uppercase tracking-wider">
                  <Check className="w-4 h-4 stroke-[2.5]" /> Stok Tersedia ({product.stok})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-rose-700 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Stok Habis
                </span>
              )}
            </div>
          </div>

          {/* Interactive Quantity Counter */}
          <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <span className="text-sm font-bold text-gray-950 dark:text-white">Jumlah Pesanan</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center glass-luxury border border-amber-500/30 rounded-xl">
                <button
                  onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-amber-500/20 rounded-l-xl transition-colors cursor-pointer text-gray-950 dark:text-white"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="w-10 text-center font-bold text-base text-gray-950 dark:text-white">{jumlah}</span>
                <button
                  onClick={() => setJumlah((j) => Math.min(product.stok, j + 1))}
                  disabled={jumlah >= product.stok}
                  className="w-10 h-10 flex items-center justify-center hover:bg-amber-500/20 rounded-r-xl transition-colors disabled:opacity-30 cursor-pointer text-gray-950 dark:text-white"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Subtotal: <strong className="gold-gradient-text font-serif font-bold text-base">{formatRupiah(product.harga * jumlah)}</strong>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <AnimatedAddToCartButton
              onClick={handleAddToCart}
              disabled={product.stok <= 0}
              productName={product.nama}
              size="lg"
              fullWidth={true}
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={handleBuyNow}
                disabled={product.stok <= 0}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold px-6 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm tracking-wide"
              >
                <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
                Langsung Checkout
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=6282330903255&text=Assalamu%27alaikum%20mau%20order%20${encodeURIComponent(product.nama)}%20sebanyak%20${jumlah}%20pcs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold px-6 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer text-sm tracking-wide"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.2]" />
                Order via WhatsApp
              </a>
            </div>
          </div>

          {/* Interactive Accordion Tabs */}
          <div className="pt-6 border-t border-amber-500/20">
            <div className="flex border-b border-amber-500/20 space-x-2 pb-2 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'glass-luxury text-gray-900 dark:text-gray-200 border-amber-500/20 hover:border-amber-500/40'
                    }`}
                  >
                    <TabIcon className="w-4 h-4 stroke-[2.2]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="py-5 min-h-[120px]">
              <AnimatePresence mode="wait">
                {activeTab === 'deskripsi' && (
                  <motion.div
                    key="deskripsi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-normal leading-relaxed whitespace-pre-line glass-luxury p-5 rounded-2xl border border-amber-500/20"
                  >
                    {product.deskripsi || 'Kudapan renyah berkualiatas tinggi dari bahan alami segar pilihan yang diolah secara higienis dan higienis.'}
                  </motion.div>
                )}

                {activeTab === 'storage' && (
                  <motion.div
                    key="storage"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-normal leading-relaxed space-y-3 glass-luxury p-5 rounded-2xl border border-amber-500/20"
                  >
                    <p>✨ <strong>Petunjuk Penyimpanan:</strong> Simpan di tempat sejuk dan kering, jauhkan dari paparan sinar matahari langsung.</p>
                    <p>🔒 <strong>Menjaga Kerenyahan:</strong> Kunci rapat segel foil kedap udara setelah dibuka untuk mempertahankan tekstur kriuk terbaik.</p>
                  </motion.div>
                )}

                {activeTab === 'pengiriman' && (
                  <motion.div
                    key="pengiriman"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-normal leading-relaxed space-y-3 glass-luxury p-5 rounded-2xl border border-amber-500/20"
                  >
                    <p>🚚 <strong>Pengiriman Protektif:</strong> Dikirim dari Banyuwangi dengan perlindungan ekstra (bubble wrap berlapis & karton tebal).</p>
                    <p>📦 <strong>Jaminan Keutuhan:</strong> Dipack secara aman untuk meminimalkan risiko remuk saat pengiriman ke seluruh Nusantara.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Related Products Section */}
      {!relatedLoading && relatedProducts.length > 0 && (
        <div className="border-t border-amber-500/20 pt-16 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 dark:text-white">Koleksi Terkait</h2>
            <Link to="/produk" className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline">
              Lihat Semua ↗
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {/* STICKY MOBILE BOTTOM PURCHASE BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 glass-luxury border-t border-amber-500/30 p-3.5 z-40 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">Total Pesanan</span>
          <span className="text-lg font-serif font-bold gold-gradient-text">
            {formatRupiah(product.harga * jumlah)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stok <= 0}
            className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold p-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            aria-label="Tambah ke keranjang"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stok <= 0}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
          >
            Checkout ↗
          </button>
        </div>
      </div>
    </div>
  );
}
