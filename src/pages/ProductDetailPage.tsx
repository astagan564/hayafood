import { useEffect, useState } from 'react';
import { ShoppingCart, ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { Link, navigate } from '../lib/router';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400 text-lg">Produk tidak ditemukan</p>
        <Link to="/produk" className="inline-flex items-center gap-1 text-brand-600 mt-4 font-medium">
          <ChevronLeft className="w-4 h-4" /> Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/produk" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 font-medium">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          {product.gambar_url ? (
            <img src={product.gambar_url} alt={product.nama} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-20 h-20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.categories && (
            <span className="inline-block bg-accent-100 text-accent-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {product.categories.nama}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.nama}</h1>
          <p className="text-3xl font-bold text-brand-600 mb-4">{formatRupiah(product.harga)}</p>

          <div className="flex items-center gap-2 mb-6">
            {product.stok > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                <Check className="w-4 h-4" /> Stok tersedia: {product.stok}
              </span>
            ) : (
              <span className="text-sm text-brand-600 font-medium">Stok habis</span>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.deskripsi || 'Kripik renyah berkualitas dari Hayafood'}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Jumlah</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl">
                <button
                  onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{jumlah}</span>
                <button
                  onClick={() => setJumlah((j) => Math.min(product.stok, j + 1))}
                  disabled={jumlah >= product.stok}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {jumlah >= product.stok && (
                <span className="text-xs text-brand-600 font-medium">
                  Mencapai batas stok
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stok <= 0}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-600 text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stok <= 0}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {!relatedLoading && relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-12 mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
