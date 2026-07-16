import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../types';
import { formatRupiah } from '../../lib/format';
import { useToast } from '../../hooks/useToast';
import { Plus, Pencil, Trash2, X, Loader2, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ProductForm {
  nama: string;
  deskripsi: string;
  harga: string;
  gambar_url: string;
  category_id: string;
  stok: string;
  is_active: boolean;
}

const emptyForm: ProductForm = {
  nama: '',
  deskripsi: '',
  harga: '',
  gambar_url: '',
  category_id: '',
  stok: '',
  is_active: true,
};

export function AdminProducts() {
  const { show } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fetchData = () => {
    Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('nama'),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    });
  };

  useEffect(fetchData, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview('');
    setImageMode('upload');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      nama: p.nama,
      deskripsi: p.deskripsi || '',
      harga: String(p.harga),
      gambar_url: p.gambar_url || '',
      category_id: p.category_id || '',
      stok: String(p.stok),
      is_active: p.is_active,
    });
    setImagePreview(p.gambar_url || '');
    setImageMode(p.gambar_url ? 'url' : 'upload');
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { contentType: file.type });
    setUploading(false);
    if (error) {
      show('Gagal mengunggah gambar', 'error');
      return;
    }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;
    setForm((prev) => ({ ...prev, gambar_url: publicUrl }));
    setImagePreview(publicUrl);
    show('Gambar berhasil diunggah');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.harga) {
      show('Nama dan harga wajib diisi', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      nama: form.nama.trim(),
      deskripsi: form.deskripsi.trim() || null,
      harga: parseInt(form.harga) || 0,
      gambar_url: form.gambar_url.trim() || null,
      category_id: form.category_id || null,
      stok: parseInt(form.stok) || 0,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) show('Gagal mengubah produk', 'error');
      else show('Produk diperbarui');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) show('Gagal menambah produk', 'error');
      else show('Produk ditambahkan');
    }
    setSaving(false);
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) show('Gagal menghapus', 'error');
    else show('Produk dihapus');
    fetchData();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Produk</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah<span className="hidden sm:inline"> Produk</span></span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Belum ada produk</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {p.gambar_url ? (
                  <img src={p.gambar_url} alt={p.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 line-clamp-1">{p.nama}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-brand-600">{formatRupiah(p.harga)}</span>
                  <span>Stok: {p.stok}</span>
                  {p.categories && <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">{p.categories.nama}</span>}
                </div>
              </div>
              <button
                onClick={() => toggleActive(p)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {p.is_active ? 'Aktif' : 'Nonaktif'}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
                {/* Mode toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      imageMode === 'upload' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      imageMode === 'url' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" /> URL Gambar
                  </button>
                </div>
                {/* Preview */}
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 mb-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setForm({ ...form, gambar_url: '' }); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {/* Upload input */}
                {imageMode === 'upload' && !imagePreview && (
                  <label className="flex flex-col items-center justify-center gap-2 w-full h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 hover:bg-brand-50 cursor-pointer transition-all">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500">Klik untuk pilih gambar</span>
                        <span className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                )}
                {/* URL input */}
                {imageMode === 'url' && (
                  <input
                    type="url"
                    value={form.gambar_url}
                    onChange={(e) => {
                      setForm({ ...form, gambar_url: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all bg-white"
                >
                  <option value="">Tanpa kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-brand-600"
                />
                <span className="text-sm font-medium text-gray-700">Produk aktif (tampil di toko)</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
