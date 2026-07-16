import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { Link } from '../lib/router';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { show } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stok <= 0) {
      show('Produk ini sedang habis', 'error');
      return;
    }
    addToCart(product);
    show(`${product.nama} ditambahkan ke keranjang`);
  };

  return (
    <Link to={`/produk/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {product.gambar_url ? (
            <img
              src={product.gambar_url}
              alt={product.nama}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
          {product.stok <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                Stok Habis
              </span>
            </div>
          )}
          {product.categories && (
            <span className="absolute top-2 left-2 bg-accent-400 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.categories.nama}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {product.nama}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[2.5rem]">
            {product.deskripsi || 'Kripik renyah berkualitas dari Hayafood'}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-brand-600">{formatRupiah(product.harga)}</span>
            <button
              onClick={handleAdd}
              disabled={product.stok <= 0}
              className="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Tambah ke keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
