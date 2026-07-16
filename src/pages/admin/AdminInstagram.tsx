import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { Plus, Trash2, X, Loader2, Video, ExternalLink } from 'lucide-react';

interface InstagramEmbed {
  id: string;
  post_url: string;
  embed_url: string;
  label: string | null;
  is_active: boolean;
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

  const fetchEmbeds = () => {
    setLoading(true);
    supabase
      .from('instagram_embeds')
      .select('*')
      .order('created_at', { ascending: false })
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
      const pathname = parsed.pathname;
      const parts = pathname.split('/').filter(Boolean);
      
      const filteredParts = parts.filter((p) => p !== 'embed');
      
      if (filteredParts.length >= 2 && (filteredParts[0] === 'p' || filteredParts[0] === 'reel')) {
        return `https://www.instagram.com/${filteredParts[0]}/${filteredParts[1]}/embed`;
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
      show('Format URL Instagram tidak valid. Pastikan link berisi /p/ atau /reel/', 'error');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('instagram_embeds').insert({
      post_url: postUrl.trim(),
      embed_url: embedUrl,
      label: label.trim() || null,
      is_active: true,
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
                placeholder="https://www.instagram.com/reel/C_XyZ123/ atau https://www.instagram.com/p/C_XyZ123/"
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-150 rounded-2xl animate-pulse" />
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
          {embeds.map((emb) => (
            <div
              key={emb.id}
              className="bg-white rounded-2xl border border-gray-150 p-4 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="aspect-[9/16] max-h-[360px] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative">
                  <iframe
                    src={emb.embed_url}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                    title={emb.label || 'Instagram Embed'}
                  />
                </div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">
                  {emb.label || 'Tanpa Label'}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1 flex items-center gap-1">
                  <a
                    href={emb.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-0.5 text-brand-600 font-medium"
                  >
                    Buka di Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(emb.id)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Video"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
