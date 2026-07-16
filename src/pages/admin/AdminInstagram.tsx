import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { Plus, Trash2, X, Loader2, Video, ExternalLink, GripVertical } from 'lucide-react';

interface InstagramEmbed {
  id: string;
  post_url: string;
  embed_url: string;
  label: string | null;
  is_active: boolean;
  position: number;
  created_at: string;
}

export function AdminInstagram() {
  const { show } = useToast();
  const [embeds, setEmbeds] = useState<InstagramEmbed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Drag state (desktop)
  const dragIdRef = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Touch state (mobile)
  const touchIdRef = useRef<string | null>(null);
  const touchOverIdRef = useRef<string | null>(null);
  const [touchOverId, setTouchOverId] = useState<string | null>(null);

  const fetchEmbeds = () => {
    setLoading(true);
    supabase
      .from('instagram_embeds')
      .select('*')
      .order('position', { ascending: true })
      .then(({ data }) => {
        setEmbeds(data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmbeds();
    const handleAdd = () => openAdd();
    window.addEventListener('admin-add-item', handleAdd);
    return () => window.removeEventListener('admin-add-item', handleAdd);
  }, []);

  const openAdd = () => {
    setPostUrl('');
    setLabel('');
    setShowForm(true);
  };

  const getInstagramEmbedUrl = (url: string): string | null => {
    try {
      const trimmed = url.trim();
      if (!trimmed) return null;
      const parsed = new URL(trimmed);
      const parts = parsed.pathname.split('/').filter((p) => p !== 'embed' && p !== '');
      if (parts.length >= 2 && (parts[0] === 'p' || parts[0] === 'reel')) {
        return `https://www.instagram.com/${parts[0]}/${parts[1]}/embed`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) return;
    const embedUrl = getInstagramEmbedUrl(postUrl);
    if (!embedUrl) {
      show('Format URL tidak valid. Pastikan link berisi /p/ atau /reel/', 'error');
      return;
    }
    setSaving(true);
    const nextPos = embeds.length;
    const { error } = await supabase.from('instagram_embeds').insert({
      post_url: postUrl.trim(),
      embed_url: embedUrl,
      label: label.trim() || null,
      is_active: true,
      position: nextPos,
    });
    setSaving(false);
    if (error) {
      show('Gagal menambahkan video', 'error');
    } else {
      show('Video Instagram ditambahkan');
      setShowForm(false);
      setPostUrl('');
      setLabel('');
      fetchEmbeds();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus video embed ini?')) return;
    const { error } = await supabase.from('instagram_embeds').delete().eq('id', id);
    if (error) {
      show('Gagal menghapus video', 'error');
    } else {
      show('Video dihapus');
      fetchEmbeds();
    }
  };

  // --- Reorder helpers ---

  const reorderAndSave = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIdx = embeds.findIndex((e) => e.id === fromId);
    const toIdx = embeds.findIndex((e) => e.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;

    // Build new ordered array
    const reordered = [...embeds];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Optimistic UI update
    setEmbeds(reordered);

    // Save new positions to DB
    setSavingOrder(true);
    const updates = reordered.map((emb, idx) =>
      supabase.from('instagram_embeds').update({ position: idx }).eq('id', emb.id)
    );
    const results = await Promise.all(updates);
    setSavingOrder(false);

    const hasError = results.some((r) => r.error);
    if (hasError) {
      show('Gagal menyimpan urutan, memuat ulang…', 'error');
      fetchEmbeds();
    } else {
      show('Urutan berhasil disimpan ✓');
    }
  };

  // --- Desktop Drag & Drop ---

  const onDragStart = (id: string) => {
    dragIdRef.current = id;
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const onDrop = (e: React.DragEvent, toId: string) => {
    e.preventDefault();
    const fromId = dragIdRef.current;
    dragIdRef.current = null;
    setDragOverId(null);
    if (fromId) reorderAndSave(fromId, toId);
  };

  const onDragEnd = () => {
    dragIdRef.current = null;
    setDragOverId(null);
  };

  // --- Mobile Touch ---

  const onTouchStart = (_e: React.TouchEvent, id: string) => {
    touchIdRef.current = id;
    touchOverIdRef.current = id;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    // Find the element currently under the touch point
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = el?.closest('[data-embed-id]') as HTMLElement | null;
    const overId = card?.dataset.embedId ?? null;
    touchOverIdRef.current = overId;
    setTouchOverId(overId);
  };

  const onTouchEnd = () => {
    const fromId = touchIdRef.current;
    const toId = touchOverIdRef.current;
    touchIdRef.current = null;
    touchOverIdRef.current = null;
    setTouchOverId(null);
    if (fromId && toId && fromId !== toId) {
      reorderAndSave(fromId, toId);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Video Instagram</h2>
        {!showForm && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Video
          </button>
        )}
      </div>

      {/* Hint text */}
      {embeds.length > 1 && (
        <p className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 shrink-0" />
          Seret kartu untuk mengubah urutan tampilan. Urutan tersimpan otomatis setelah dilepas.
          {savingOrder && (
            <span className="inline-flex items-center gap-1 text-brand-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Menyimpan…
            </span>
          )}
        </p>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Tambah Video Baru</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label / Judul Video (Opsional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Testimoni Kripik Singkong"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Postingan / Reels Instagram <span className="text-brand-600">*</span>
              </label>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/C_XyZ123/"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Salin tautan dari aplikasi Instagram melalui tombol bagikan &gt; salin tautan.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : embeds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <Video className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada video Instagram yang disematkan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {embeds.map((emb) => {
            const isDragOver = dragOverId === emb.id || touchOverId === emb.id;
            const isDragging = dragIdRef.current === emb.id;
            return (
              <div
                key={emb.id}
                data-embed-id={emb.id}
                draggable
                onDragStart={() => onDragStart(emb.id)}
                onDragOver={(e) => onDragOver(e, emb.id)}
                onDrop={(e) => onDrop(e, emb.id)}
                onDragEnd={onDragEnd}
                onTouchStart={(e) => onTouchStart(e, emb.id)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className={[
                  'bg-white rounded-2xl border-2 p-4 flex flex-col justify-between transition-all select-none',
                  isDragOver
                    ? 'border-brand-500 shadow-lg scale-[1.02] ring-2 ring-brand-200'
                    : 'border-gray-100 hover:shadow-md',
                  isDragging ? 'opacity-40' : 'opacity-100',
                ].join(' ')}
                style={{ touchAction: 'none' }}
              >
                {/* Drag handle + label row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                    title="Seret untuk mengatur urutan"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-1 flex-1">
                    {emb.label || 'Tanpa Label'}
                  </h4>
                </div>

                {/* Iframe preview */}
                <div className="aspect-[9/16] max-h-[300px] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 pointer-events-none">
                  <iframe
                    src={emb.embed_url}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                    title={emb.label || 'Instagram Embed'}
                    tabIndex={-1}
                  />
                </div>

                {/* Footer row */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <a
                    href={emb.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buka Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDelete(emb.id)}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
