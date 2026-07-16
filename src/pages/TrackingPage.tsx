import { useState } from 'react';
import { Search, ChevronLeft, Calendar, User, Phone, MapPin, ClipboardList, MessageCircle, AlertCircle, Package, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatRupiah, formatDate } from '../lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types';
import { Link } from '../lib/router';

interface OrderDetail {
  id: string;
  nama_pembeli: string;
  nomor_telepon: string;
  alamat: string;
  catatan: string | null;
  total: number;
  status: string;
  created_at: string;
}

interface OrderItemDetail {
  id: string;
  nama_product: string;
  jumlah: number;
  harga_satuan: number;
}

const WHATSAPP_NUMBER = '6282330903255';

export function TrackingPage() {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItemDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyId = (id: string) => {
    const cleanId = id.slice(0, 8).toUpperCase();
    navigator.clipboard.writeText(cleanId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryId = searchInput.trim();
    if (!queryId) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setOrder(null);
    setItems([]);

    try {
      // Call Postgres RPC function to search order by text cast prefix of UUID id column
      const { data: orderData, error: orderError } = await supabase
        .rpc('search_order_by_id_prefix', { prefix: queryId })
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        setLoading(false);
        return;
      }

      const typedOrder = orderData as unknown as OrderDetail;
      setOrder(typedOrder);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', typedOrder.id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mencari pesanan. Silakan periksa kembali format ID Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppFollowUp = () => {
    if (!order) return;
    const shortId = order.id.slice(0, 8).toUpperCase();
    const message = `Halo Hayafood! Saya ingin menanyakan status pesanan saya dengan ID *#${shortId}* atas nama *${order.nama_pembeli}*.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 font-medium">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lacak Pesanan Anda</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Masukkan 8 digit depan atau seluruh kode ID Pesanan yang Anda dapatkan saat checkout.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Contoh: A1B2C3D4..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm uppercase font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 text-sm cursor-pointer"
          >
            {loading ? 'Mencari...' : 'Lacak'}
          </button>
        </div>
      </form>

      {/* Content Area */}
      {loading && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 shadow-sm animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 flex gap-3 items-start mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && searched && !order && !error && (
        <div className="max-w-md mx-auto text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">Pesanan Tidak Ditemukan</h3>
          <p className="text-gray-400 text-sm mb-4">
            Periksa kembali ID pesanan Anda. Pastikan karakter yang dimasukkan sudah benar.
          </p>
        </div>
      )}

      {!loading && order && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Status Banner */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider font-semibold">No. Pesanan</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <h2 className="text-lg font-bold text-brand-600 select-all tracking-wider font-mono">
                  #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <button
                  onClick={() => handleCopyId(order.id)}
                  className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-brand-600 transition-colors cursor-pointer"
                  title="Salin ID Pesanan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-brand-600" /> Data Penerima
                </h3>
                <div className="space-y-2 text-sm text-gray-600 pl-6">
                  <p className="font-semibold text-gray-800">{order.nama_pembeli}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {order.nomor_telepon}</p>
                  <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {order.alamat}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-brand-600" /> Detail Waktu
                </h3>
                <div className="space-y-2 text-sm text-gray-600 pl-6">
                  <p>Dibuat pada: <span className="font-medium text-gray-800">{formatDate(order.created_at)}</span></p>
                  {order.catatan && (
                    <div className="mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                      <span className="font-semibold block text-gray-500 mb-0.5">Catatan Pembeli:</span>
                      <p className="italic text-gray-600">"{order.catatan}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rincian Pesanan */}
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-4">
                <ClipboardList className="w-4 h-4 text-brand-600" /> Rincian Produk
              </h3>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.nama_product}</h4>
                      <p className="text-xs text-gray-400">
                        {formatRupiah(item.harga_satuan)} x{item.jumlah}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatRupiah(item.harga_satuan * item.jumlah)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Pembayaran</span>
                <span className="text-xl font-bold text-brand-600">{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* WA Button */}
            <div className="bg-accent-50 rounded-2xl border border-accent-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold text-accent-800">Ada Pertanyaan Mengenai Pesanan?</p>
                <p className="text-xs text-accent-600">Hubungi WhatsApp toko untuk menanyakan pengiriman atau detail pembayaran.</p>
              </div>
              <button
                onClick={handleWhatsAppFollowUp}
                className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
