import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { Link } from '../lib/router';
import { Interactive3DCard } from './ui/Interactive3DCard';
import { AnimatedAddToCartButton } from './ui/AnimatedAddToCartButton';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { show } = useToast();

  const handleAdd = () => {
    if (product.stok <= 0) {
      show('Produk ini sedang habis', 'error');
      return;
    }
    addToCart(product);
    show(`${product.nama} ditambahkan ke keranjang`);
  };

  return (
    <Interactive3DCard intensity={10} depthScale={1.04} className="h-full">
      <Link to={`/produk/${product.id}`} className="group block h-full">
        <div className="glass-luxury rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 gold-border-glow flex flex-col justify-between h-full border border-amber-500/20 transform-gpu [backface-visibility:hidden]">
          {/* Image Container with Hyperrealism Depth & High Resolution Rendering */}
          <div className="aspect-square overflow-hidden bg-gradient-to-b from-amber-500/5 to-amber-950/20 relative transform-gpu [backface-visibility:hidden]">
            {product.gambar_url ? (
              <img
                src={product.gambar_url}
                alt={product.nama}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-500/30">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}
            {product.stok <= 0 && (
              <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center backdrop-blur-xs">
                <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                  Stok Habis
                </span>
              </div>
            )}
            {product.categories && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                {product.categories.nama}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="font-serif font-bold text-gray-950 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-lg tracking-tight">
                {product.nama}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-normal line-clamp-2 mt-1 min-h-[2.4rem] leading-relaxed">
                {product.deskripsi || 'Kudapan gourmet renyah berkualitas premium dari Hayafood'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-amber-500/15">
              <span className="text-lg font-serif font-bold gold-gradient-text">
                {formatRupiah(product.harga)}
              </span>
              <AnimatedAddToCartButton
                onClick={handleAdd}
                disabled={product.stok <= 0}
                productName={product.nama}
                size="sm"
              />
            </div>
          </div>
        </div>
      </Link>
    </Interactive3DCard>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-luxury rounded-2xl border border-amber-500/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-amber-500/10" />
      <div className="p-5">
        <div className="h-5 bg-amber-500/15 rounded w-3/4 mb-2" />
        <div className="h-4 bg-amber-500/10 rounded w-full mb-1" />
        <div className="h-4 bg-amber-500/10 rounded w-2/3 mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-amber-500/20 rounded w-20" />
          <div className="w-9 h-9 bg-amber-500/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
