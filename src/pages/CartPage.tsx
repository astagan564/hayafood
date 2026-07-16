import { Trash2, Minus, Plus, ShoppingCart, ChevronLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatRupiah } from '../lib/format';
import { Link, navigate } from '../lib/router';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-6">Belum ada produk di keranjangmu. Yuk pilih kripik favoritmu!</p>
        <Link
          to="/produk"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          Mulai Belanja <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/produk" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" /> Lanjut belanja
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Keranjang Belanja</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
            >
              {/* Image */}
              <Link to={`/produk/${item.product.id}`} className="shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                  {item.product.gambar_url ? (
                    <img src={item.product.gambar_url} alt={item.product.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/produk/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-brand-600 transition-colors line-clamp-1">
                    {item.product.nama}
                  </h3>
                </Link>
                <p className="text-brand-600 font-bold mt-1">{formatRupiah(item.product.harga)}</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.jumlah - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.jumlah}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.jumlah + 1)}
                      disabled={item.jumlah >= item.product.stok}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-brand-600 transition-colors p-1"
                    aria-label="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 pr-2">{item.product.nama} x{item.jumlah}</span>
                  <span className="shrink-0 font-medium">{formatRupiah(item.product.harga * item.jumlah)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-brand-600">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02]"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
