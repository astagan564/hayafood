import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';
import { useToast } from '../../hooks/useToast';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

export function AdminCategories() {
  const { show } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    supabase.from('categories').select('*').order('nama').then(({ data }) => {
      setCategories(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
    const handleAdd = () => openAdd();
    window.addEventListener('admin-add-item', handleAdd);
    return () => window.removeEventListener('admin-add-item', handleAdd);
  }, []);

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    setSaving(true);
    const payload = { nama: nama.trim(), slug: slugify(nama) };

    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
      if (error) show('Gagal mengubah kategori', 'error');
      else show('Kategori diperbarui');
    } else {
      const { error } = await supabase.from('categories').insert(payload);
      if (error) show('Gagal menambah kategori', 'error');
      else show('Kategori ditambahkan');
    }
    setSaving(false);
    setShowForm(false);
    setNama('');
    setEditingId(null);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini? Produk terkait akan menjadi tanpa kategori.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) show('Gagal menghapus', 'error');
    else show('Kategori dihapus');
    fetchCategories();
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setNama(c.nama);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setNama('');
    setShowForm(true);
  };

  return (
    <div>
      <div className="hidden md:flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kategori</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah<span className="hidden sm:inline"> Kategori</span></span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Belum ada kategori</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{c.nama}</h3>
                <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Kripik Singkong"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
