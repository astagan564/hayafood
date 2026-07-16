import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    supabase.from('categories').select('*').order('nama').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true);

    if (activeCategory !== 'all') {
      query = query.eq('category_id', activeCategory);
    }
    if (search.trim()) {
      query = query.ilike('nama', `%${search.trim()}%`);
    }
    if (sortBy === 'price-asc') query = query.order('harga', { ascending: true });
    else if (sortBy === 'price-desc') query = query.order('harga', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query.then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [activeCategory, search, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchProducts, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Semua Produk</h1>
      <p className="text-gray-500 mb-6">Temukan kripik favoritmu di Hayafood</p>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kripik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all bg-white text-sm font-medium"
          >
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.nama}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-400">Tidak ada produk ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
