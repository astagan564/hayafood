import { Trash2, Minus, Plus, ShoppingCart, ChevronLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatRupiah } from '../lib/format';
import { Link, navigate } from '../lib/router';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-accent-400 flex items-center justify-center mb-4 border border-brand-200 dark:border-brand-800">
          <ShoppingCart className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-2">Keranjang Kosong</h2>
        <p className="text-gray-800 dark:text-gray-200 font-semibold mb-6">Belum ada produk di keranjangmu. Yuk pilih kripik favoritmu!</p>
        <Link
          to="/produk"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black px-6 py-3.5 rounded-xl transition-all shadow-lg hover:scale-105"
        >
          Mulai Belanja <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        to="/produk"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 text-gray-950 dark:text-white font-black text-sm hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all mb-6 cursor-pointer shadow-xs"
      >
        <ChevronLeft className="w-4 h-4 stroke-[3]" /> Lanjut Belanja
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">Keranjang Belanja</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex gap-4 shadow-sm"
            >
              {/* Image */}
              <Link to={`/produk/${item.product.id}`} className="shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {item.product.gambar_url ? (
                    <img src={item.product.gambar_url} alt={item.product.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/produk/${item.product.id}`}>
                  <h3 className="font-extrabold text-gray-950 dark:text-white hover:text-brand-600 dark:hover:text-accent-400 transition-colors line-clamp-1 text-base">
                    {item.product.nama}
                  </h3>
                </Link>
                <p className="text-brand-600 dark:text-accent-400 font-black text-base mt-1">{formatRupiah(item.product.harga)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.jumlah - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-gray-950 dark:text-white"
                      aria-label="Kurangi"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="w-10 text-center text-sm font-black text-gray-950 dark:text-white">{item.jumlah}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.jumlah + 1)}
                      disabled={item.jumlah >= item.product.stok}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition-colors disabled:opacity-30 text-gray-950 dark:text-white"
                      aria-label="Tambah"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label="Hapus"
                  >
                    <Trash2 className="w-4.5 h-4.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 sticky top-20 shadow-xl space-y-4">
            <h3 className="font-black text-gray-950 dark:text-white text-lg border-b border-gray-100 dark:border-gray-800 pb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-semibold">
                  <span className="line-clamp-1 pr-2">{item.product.nama} x{item.jumlah}</span>
                  <span className="shrink-0 font-bold">{formatRupiah(item.product.harga * item.jumlah)}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-gray-950 dark:text-white text-base">Total Bayar</span>
                <span className="text-2xl font-black text-brand-600 dark:text-accent-400">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-base shadow-xl"
            >
              Lanjut ke Checkout ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
