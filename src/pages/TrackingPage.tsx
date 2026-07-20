import React, { useState } from 'react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-950 dark:text-white hover:text-brand-600 dark:hover:text-accent-400 mb-6 font-black">
        <ChevronLeft className="w-4 h-4 stroke-[3]" /> Kembali ke Beranda
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mb-2 tracking-tight">Lacak Pesanan Anda</h1>
        <p className="text-gray-800 dark:text-gray-200 font-semibold text-base max-w-md mx-auto">
          Masukkan 8 digit depan atau seluruh kode ID Pesanan yang Anda dapatkan saat checkout.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Contoh: A1B2C3D4..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-extrabold focus:border-brand-600 outline-none transition-all text-sm uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white font-black px-6 py-3.5 rounded-xl transition-all disabled:opacity-50 text-sm cursor-pointer shadow-md"
          >
            {loading ? 'Mencari...' : 'Lacak'}
          </button>
        </div>
      </form>

      {/* Content Area */}
      {loading && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-sm animate-pulse space-y-6">
          <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-1/3" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-4/6" />
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 text-red-950 dark:text-red-200 rounded-2xl p-4 flex gap-3 items-start mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {!loading && searched && !order && !error && (
        <div className="max-w-md mx-auto text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-black text-gray-950 dark:text-white text-lg mb-1">Pesanan Tidak Ditemukan</h3>
          <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm mb-4">
            Periksa kembali ID pesanan Anda. Pastikan karakter yang dimasukkan sudah benar.
          </p>
        </div>
      )}

      {!loading && order && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Status Banner */}
          <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">No. Pesanan</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <h2 className="text-lg font-black text-brand-600 dark:text-accent-400 select-all tracking-wider font-mono">
                  #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <button
                  onClick={() => handleCopyId(order.id)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-600 transition-colors cursor-pointer"
                  title="Salin ID Pesanan"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-800 dark:text-gray-200 font-bold">Status:</span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-black border-2 ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b-2 border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <h3 className="font-black text-gray-950 dark:text-white flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-brand-600 dark:text-accent-400 stroke-[2.5]" /> Data Penerima
                </h3>
                <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200 font-semibold pl-6">
                  <p className="font-black text-gray-950 dark:text-white text-base">{order.nama_pembeli}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 stroke-[2.5]" /> {order.nomor_telepon}</p>
                  <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[2.5]" /> {order.alamat}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-gray-950 dark:text-white flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-brand-600 dark:text-accent-400 stroke-[2.5]" /> Detail Waktu
                </h3>
                <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200 font-semibold pl-6">
                  <p>Dibuat pada: <span className="font-black text-gray-950 dark:text-white">{formatDate(order.created_at)}</span></p>
                  {order.catatan && (
                    <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
                      <span className="font-black block text-gray-600 dark:text-gray-400 mb-0.5">Catatan Pembeli:</span>
                      <p className="italic text-gray-950 dark:text-white font-semibold">"{order.catatan}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rincian Pesanan */}
            <div>
              <h3 className="font-black text-gray-950 dark:text-white flex items-center gap-2 text-sm mb-4">
                <ClipboardList className="w-4 h-4 text-brand-600 dark:text-accent-400 stroke-[2.5]" /> Rincian Produk
              </h3>
              <div className="divide-y-2 divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <h4 className="font-extrabold text-gray-950 dark:text-white">{item.nama_product}</h4>
                      <p className="text-xs text-brand-600 dark:text-accent-400 font-bold">
                        {formatRupiah(item.harga_satuan)} x{item.jumlah}
                      </p>
                    </div>
                    <span className="font-black text-gray-950 dark:text-white">
                      {formatRupiah(item.harga_satuan * item.jumlah)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-4 mt-4 flex justify-between items-center">
                <span className="font-black text-gray-950 dark:text-white">Total Pembayaran</span>
                <span className="text-xl font-black text-brand-600 dark:text-accent-400">{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* WA Button */}
            <div className="bg-brand-50 dark:bg-brand-950/70 rounded-2xl border-2 border-brand-200 dark:border-brand-800 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-black text-brand-950 dark:text-accent-200">Ada Pertanyaan Mengenai Pesanan?</p>
                <p className="text-xs text-brand-800 dark:text-gray-300 font-semibold">Hubungi WhatsApp toko untuk menanyakan pengiriman atau detail pembayaran.</p>
              </div>
              <button
                onClick={handleWhatsAppFollowUp}
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 stroke-[2.5]" /> Hubungi WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
