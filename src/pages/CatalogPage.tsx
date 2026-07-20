import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [sortBottomSheetOpen, setSortBottomSheetOpen] = useState(false);

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

  const sortOptions = [
    { id: 'newest', label: 'Terbaru & Kurasi Utama' },
    { id: 'price-asc', label: 'Harga Terendah (Termurah)' },
    { id: 'price-desc', label: 'Harga Tertinggi (Eksklusif)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Katalog Utama</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 dark:text-white mt-1 tracking-tight">Eksplorasi Produk Gourmet</h1>
        <p className="text-gray-600 dark:text-gray-300 font-normal mt-2 text-base">Temukan varian kudapan renyah khas Hayafood yang diracik istimewa</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60" />
          <input
            type="text"
            placeholder="Cari kudapan favorit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-luxury text-gray-950 dark:text-white font-medium border border-amber-500/30 focus:border-amber-500 outline-none transition-all gold-border-glow shadow-xs"
          />
        </div>

        {/* Desktop Shadcn DropdownMenu / Mobile Bottom Sheet Trigger */}
        <div className="relative">
          {/* Desktop Shadcn UI DropdownMenu for Sorting */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl glass-luxury text-gray-950 dark:text-white font-bold border border-amber-500/30 hover:border-amber-500 outline-none transition-all gold-border-glow text-sm cursor-pointer shadow-xs">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500 stroke-[2.2]" />
                  <span>Urutkan: {sortOptions.find((o) => o.id === sortBy)?.label}</span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5] opacity-70 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Urutan Kurasi Produk</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
                  {sortOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Bottom Sheet Trigger Button */}
          <button
            onClick={() => setSortBottomSheetOpen(true)}
            className="sm:hidden w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-2xl glass-luxury border border-amber-500/30 text-gray-950 dark:text-white font-bold text-sm shadow-xs cursor-pointer gold-border-glow"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-500 stroke-[2.2]" />
              <span>Urutkan: {sortOptions.find((o) => o.id === sortBy)?.label}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all transform cursor-pointer border ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
              : 'glass-luxury border-amber-500/20 text-gray-900 dark:text-white hover:border-amber-500/50 shadow-sm hover:scale-105 active:scale-95'
          }`}
        >
          Semua Koleksi
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all transform cursor-pointer border ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'glass-luxury border-amber-500/20 text-gray-900 dark:text-white hover:border-amber-500/50 shadow-sm hover:scale-105 active:scale-95'
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
        <div className="text-center py-20 glass-luxury rounded-3xl border border-amber-500/20">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/30">
            <Search className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-gray-950 dark:text-white font-serif font-bold text-xl">Tidak ada produk ditemukan</p>
          <p className="text-gray-500 text-sm mt-1">Coba gunakan kata kunci pencarian yang berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Mobile Bottom Sheet for Sort Selection */}
      <MobileBottomSheet
        isOpen={sortBottomSheetOpen}
        onClose={() => setSortBottomSheetOpen(false)}
        title="Urutan Kurasi Produk"
      >
        <div className="space-y-2 py-2">
          {sortOptions.map((opt) => {
            const isSelected = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSortBy(opt.id as typeof sortBy);
                  setSortBottomSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-left font-bold text-sm transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'glass-luxury border-amber-500/15 text-gray-950 dark:text-white hover:bg-amber-500/5'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-5 h-5 text-amber-500 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>
    </div>
  );
}
