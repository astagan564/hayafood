import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageCircle, Loader2, Copy, Check, ShieldCheck, ShoppingBag, Trash2, Plus, Minus, CreditCard, Sparkles, MapPin, User, Phone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../lib/format';
import { Link } from '../lib/router';

const WHATSAPP_NUMBER = '6282330903255';

export function CheckoutPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { show } = useToast();
  
  const [form, setForm] = useState({
    nama_pembeli: '',
    nomor_telepon: '',
    alamat: '',
    catatan: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'transfer' | 'qris'>('whatsapp');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof items;
    total: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyId = (id: string) => {
    const cleanId = id.slice(0, 8).toUpperCase();
    navigator.clipboard.writeText(cleanId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nama_pembeli.trim() || !form.nomor_telepon.trim() || !form.alamat.trim()) {
      show('Mohon lengkapi semua data wajib (Nama, WhatsApp, Alamat)', 'error');
      return;
    }

    if (items.length === 0) {
      show('Keranjang belanja Anda masih kosong', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const newOrderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrderId,
          nama_pembeli: form.nama_pembeli.trim(),
          nomor_telepon: form.nomor_telepon.trim(),
          alamat: form.alamat.trim(),
          catatan: form.catatan.trim() ? `[Metode: ${paymentMethod.toUpperCase()}] ${form.catatan.trim()}` : `[Metode: ${paymentMethod.toUpperCase()}]`,
          total: totalPrice,
          status: 'baru',
        });

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: newOrderId,
        product_id: item.product.id,
        nama_product: item.product.nama,
        jumlah: item.jumlah,
        harga_satuan: item.product.harga,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        await supabase.from('orders').delete().eq('id', newOrderId);
        throw itemsError;
      }

      setCompletedOrder({ items: [...items], total: totalPrice });
      setOrderId(newOrderId);
      clearCart();
      show('Pesanan Anda berhasil dibuat!');
    } catch (err) {
      let errMsg = 'Gagal membuat pesanan. Silakan coba lagi.';
      if (err instanceof Error) {
        errMsg = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errMsg = String((err as { message: unknown }).message);
      }
      show(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS ORDER CONFIRMATION SCREEN
  if (orderId && completedOrder) {
    const orderCode = orderId.slice(0, 8).toUpperCase();
    const itemDetailsText = completedOrder.items
      .map((i) => `• ${i.product.nama} (${i.jumlah}x) = ${formatRupiah(i.product.harga * i.jumlah)}`)
      .join('%0A');

    const whatsappMessage = `Assalamu%27alaikum%20kak%2C%20saya%20sudah%20membuat%20pesanan%20di%20Hayafood%20dengan%20detail%3A%0A%0A*ID%20Pesanan%3A*%20%23${orderCode}%0A*Nama%3A*%20${encodeURIComponent(form.nama_pembeli)}%0A*WhatsApp%3A*%20${encodeURIComponent(form.nomor_telepon)}%0A*Alamat%3A*%20${encodeURIComponent(form.alamat)}%0A*Metode%20Pembayaran%3A*%20${paymentMethod.toUpperCase()}%0A%0A*Rincian%20Item%3A*%0A${itemDetailsText}%0A%0A*Total%20Pembayaran%3A*%20${encodeURIComponent(formatRupiah(completedOrder.total))}%0A%0AMohon%20diproses%20ya%20kak%2C%20terima%20kasih!`;

    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 md:py-20 overflow-x-hidden min-w-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-10 shadow-2xl text-center space-y-6 min-w-0"
        >
          {/* Animated Success Checkmark Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 15, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
            className="w-20 h-20 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-accent-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
          >
            <Check className="w-10 h-10 stroke-[3]" />
          </motion.div>

          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-accent-300 px-3.5 py-1 rounded-full text-xs font-black mb-3 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" /> Pesanan Terkonfirmasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              Terima Kasih, Pesanan Anda Berhasil!
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 max-w-md mx-auto font-semibold">
              Pesanan Anda telah kami catat di sistem Hayafood. Silakan lakukan konfirmasi akhir via WhatsApp di bawah ini.
            </p>
          </div>

          {/* Order ID Box */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-between max-w-md mx-auto">
            <div className="text-left">
              <span className="text-xs text-gray-500 font-bold block">ID Pesanan Anda</span>
              <span className="text-lg font-black text-brand-600 dark:text-accent-400 font-mono">#{orderCode}</span>
            </div>
            <button
              onClick={() => handleCopyId(orderId)}
              className="inline-flex items-center gap-1.5 text-xs font-black bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer text-gray-950 dark:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-brand-600 dark:text-accent-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Invoice Summary Box */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl text-left border-2 border-gray-200 dark:border-gray-700 max-w-md mx-auto space-y-2 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-bold text-gray-600 dark:text-gray-400">Nama Pembeli:</span>
              <span className="font-black text-gray-950 dark:text-white">{form.nama_pembeli}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-bold text-gray-600 dark:text-gray-400">Total Pembayaran:</span>
              <span className="font-black text-brand-600 dark:text-accent-400">{formatRupiah(completedOrder.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-600 dark:text-gray-400">Metode:</span>
              <span className="font-black uppercase text-gray-950 dark:text-white">{paymentMethod}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex-1 text-sm"
            >
              <MessageCircle className="w-5 h-5 stroke-[2.5]" />
              Konfirmasi via WhatsApp ↗
            </a>
            <Link
              to="/produk"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-950 dark:text-white font-black px-6 py-3.5 rounded-xl transition-colors flex-1 text-sm border-2 border-gray-300 dark:border-gray-700"
            >
              Kembali Belanja
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // EMPTY CART FALLBACK
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-accent-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-950 dark:text-white">Keranjang Belanja Anda Kosong</h1>
        <p className="text-gray-800 dark:text-gray-200 text-sm max-w-md mx-auto font-semibold">
          Anda belum menambahkan kripik lezat Hayafood ke keranjang. Silakan pilih camilan favorit Anda di katalog!
        </p>
        <Link
          to="/produk"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105 mt-2"
        >
          Lihat Katalog Produk ↗
        </Link>
      </div>
    );
  }

  // MAIN 2-COLUMN INTERACTIVE CHECKOUT SCREEN
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12 overflow-x-hidden w-full max-w-full min-w-0">
      {/* Header */}
      <div className="mb-6">
        <Link to="/keranjang" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-brand-600 dark:hover:text-accent-400 font-extrabold mb-3">
          <ChevronLeft className="w-4 h-4 stroke-[3]" /> Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
          Formulir Checkout Pesanan
        </h1>
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-semibold">
          Lengkapi data pengiriman untuk menyelesaikan pesanan camilan Hayafood Anda.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start w-full max-w-full min-w-0">
        
        {/* LEFT COLUMN: FORM ALAMAT & DATA PEMBELI */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-4 sm:p-8 rounded-3xl shadow-xl space-y-6 w-full max-w-full min-w-0 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-gray-100 dark:border-gray-800 gap-1">
            <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600 dark:text-accent-400 stroke-[2.5]" />
              1. Informasi Pembeli & Alamat
            </h2>
            <span className="text-xs font-bold text-gray-500">*Wajib Diisi</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Pembeli */}
            <div>
              <label htmlFor="nama_pembeli" className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
                Nama Lengkap *
              </label>
              <div className="relative">
                <input
                  id="nama_pembeli"
                  type="text"
                  required
                  placeholder="Contoh: Diana Siswati"
                  value={form.nama_pembeli}
                  onChange={(e) => setForm({ ...form, nama_pembeli: e.target.value })}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-bold focus:border-brand-600 focus:outline-none transition-all text-sm"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label htmlFor="nomor_telepon" className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
                Nomor WhatsApp / HP *
              </label>
              <div className="relative">
                <input
                  id="nomor_telepon"
                  type="tel"
                  required
                  placeholder="Contoh: 082330903255"
                  value={form.nomor_telepon}
                  onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value })}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-bold focus:border-brand-600 focus:outline-none transition-all text-sm"
                />
                <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div>
              <label htmlFor="alamat" className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
                Alamat Pengiriman Lengkap *
              </label>
              <div className="relative">
                <textarea
                  id="alamat"
                  required
                  rows={3}
                  placeholder="Contoh: Jl. Ahmad Yani No. 45, Kecamatan Banyuwangi, Kab. Banyuwangi, Jawa Timur"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-bold focus:border-brand-600 focus:outline-none transition-all text-sm"
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Catatan Khusus */}
            <div>
              <label htmlFor="catatan" className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
                Catatan Pengiriman (Opsional)
              </label>
              <input
                id="catatan"
                type="text"
                placeholder="Contoh: Titip di pos satpam"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-bold focus:border-brand-600 focus:outline-none transition-all text-sm"
              />
            </div>

            {/* Payment Method Selector - 1-Column Stacked on Mobile (Zero Cutoff) */}
            <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-black text-gray-950 dark:text-white uppercase tracking-wider mb-3">
                2. Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-full min-w-0">
                {[
                  { id: 'whatsapp', label: 'WhatsApp Chat', icon: MessageCircle, desc: 'Konfirmasi Pesanan via WhatsApp' },
                  { id: 'transfer', label: 'Transfer Bank', icon: CreditCard, desc: 'BCA / Mandiri / BRI / BNI' },
                  { id: 'qris', label: 'QRIS Instant', icon: Sparkles, desc: 'Scan & Pay Semua E-Wallet' },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start justify-between gap-3 min-w-0 w-full ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 dark:border-accent-400 ring-2 ring-brand-500/30 font-black shadow-md'
                          : 'border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-brand-50/70 hover:border-brand-500 dark:bg-gray-800 dark:hover:bg-gray-700/80 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:w-full sm:justify-between min-w-0 flex-1">
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-brand-600 text-white dark:bg-accent-400 dark:text-gray-950' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        </div>
                        <div className="sm:hidden flex-1 min-w-0">
                          <span className="text-sm font-black text-gray-950 dark:text-white block truncate">{pm.label}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold block truncate">{pm.desc}</span>
                        </div>
                      </div>

                      <div className="hidden sm:block min-w-0 w-full mt-2">
                        <span className="text-xs font-black text-gray-950 dark:text-white block truncate w-full">{pm.label}</span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold block truncate w-full">{pm.desc}</span>
                      </div>

                      {isSelected && (
                        <div className="shrink-0">
                          <Check className="w-5 h-5 text-brand-600 dark:text-accent-400 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Buat Pesanan Sekarang ({formatRupiah(totalPrice)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 sticky top-24 space-y-6 w-full max-w-full min-w-0"
        >
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-4 sm:p-8 rounded-3xl shadow-xl space-y-6 min-w-0">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100 dark:border-gray-800">
              <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600 dark:text-accent-400 stroke-[2.5]" />
                Rincian Pesanan ({items.length} Item)
              </h2>
            </div>

            {/* Cart Product Items List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700/60"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 border border-gray-200 dark:border-gray-700">
                      {item.product.gambar_url ? (
                        <img src={item.product.gambar_url} alt={item.product.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-xs sm:text-sm text-gray-950 dark:text-white truncate">
                        {item.product.nama}
                      </h3>
                      <div className="text-xs font-black text-brand-600 dark:text-accent-400">
                        {formatRupiah(item.product.harga)}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.jumlah - 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-950 dark:text-white font-bold hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="text-xs font-black text-gray-950 dark:text-white">{item.jumlah}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.jumlah + 1)}
                          disabled={item.jumlah >= item.product.stok}
                          className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-950 dark:text-white font-bold hover:bg-gray-100 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      aria-label="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Total Calculation Summary */}
            <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300 font-semibold">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.jumlah, 0)} Pcs)</span>
                <span className="font-bold text-gray-950 dark:text-white">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300 font-semibold">
                <span>Estimasi Pengiriman</span>
                <span className="font-black text-brand-600 dark:text-accent-400">Dihitung saat WhatsApp</span>
              </div>
              <div className="flex justify-between items-center text-base pt-3 border-t-2 border-gray-100 dark:border-gray-800">
                <span className="font-black text-gray-950 dark:text-white">Total Bayar:</span>
                <span className="font-black text-xl text-brand-600 dark:text-accent-400">{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="bg-brand-50 dark:bg-brand-950/60 border-2 border-brand-200 dark:border-brand-800 p-3.5 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-accent-400 shrink-0 stroke-[2.5]" />
              <div className="text-xs">
                <span className="font-black text-brand-900 dark:text-accent-200 block">Jaminan Transaksi Safe & Halal</span>
                <span className="text-brand-800 dark:text-gray-300 font-semibold">Pesanan diproses higienis dan dikirim dengan packaging aman.</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
