import { useState } from 'react';
import { ChevronLeft, MessageCircle, Loader2, Copy, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../lib/format';
import { Link, navigate } from '../lib/router';

const WHATSAPP_NUMBER = '6282330903255';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { show } = useToast();
  const [form, setForm] = useState({
    nama_pembeli: '',
    nomor_telepon: '',
    alamat: '',
    catatan: '',
  });
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
      show('Mohon lengkapi semua data wajib', 'error');
      return;
    }
 
    setSubmitting(true);
 
    try {
      // Generate the order ID on the client side so we don't need
      // .select() after .insert(). Using INSERT...RETURNING with the
      // anon role triggers a PostgREST false-positive RLS error because
      // anon has no SELECT policy on orders, causing RETURNING to return
      // 0 rows — which PostgREST misinterprets as an INSERT RLS violation.
      const newOrderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrderId,
          nama_pembeli: form.nama_pembeli.trim(),
          nomor_telepon: form.nomor_telepon.trim(),
          alamat: form.alamat.trim(),
          catatan: form.catatan.trim() || null,
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
        // Rollback: delete the created order if items insertion fails
        await supabase.from('orders').delete().eq('id', newOrderId);
        throw itemsError;
      }
 
      // Save items and total before clearing the cart
      setCompletedOrder({ items: [...items], total: totalPrice });
      setOrderId(newOrderId);
      clearCart();
      show('Pesanan berhasil dibuat!');
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
 
  const handleWhatsApp = () => {
    const orderData = completedOrder || { items, total: totalPrice };
    let message = `Halo Hayafood! Saya ingin memesan kripik.\n\n`;
    message += `Nama: ${form.nama_pembeli}\n`;
    message += `No. Telepon: ${form.nomor_telepon}\n`;
    message += `Alamat: ${form.alamat}\n`;
    if (form.catatan) message += `Catatan: ${form.catatan}\n`;
    message += `\nDaftar Pesanan:\n`;
    orderData.items.forEach((item, i) => {
      message += `${i + 1}. ${item.product.nama} x${item.jumlah} - ${formatRupiah(item.product.harga * item.jumlah)}\n`;
    });
    message += `\nTotal: ${formatRupiah(orderData.total)}\n`;
    if (orderId) message += `\nNo. Pesanan: ${orderId.slice(0, 8).toUpperCase()}`;
 
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Success state
  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil Dibuat!</h1>
        <p className="text-gray-500 mb-1">Nomor pesanan:</p>
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mb-6">
          <span className="text-xl font-bold text-brand-600 select-all tracking-wider font-mono">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
          <button
            onClick={() => handleCopyId(orderId)}
            className="p-1.5 rounded-lg hover:bg-gray-150 text-gray-500 hover:text-brand-600 transition-colors cursor-pointer"
            title="Salin ID Pesanan"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Terima kasih telah berbelanja di Hayafood! Untuk menyelesaikan pemesanan, silakan hubungi kami via WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <MessageCircle className="w-5 h-5" /> Konfirmasi via WhatsApp
          </button>
          <Link
            to="/produk"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/keranjang');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/keranjang" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-4 font-medium">
        <ChevronLeft className="w-4 h-4" /> Kembali ke keranjang
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-800 mb-2">Data Pengiriman</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-brand-600">*</span>
              </label>
              <input
                type="text"
                value={form.nama_pembeli}
                onChange={(e) => setForm({ ...form, nama_pembeli: e.target.value })}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon / WhatsApp <span className="text-brand-600">*</span>
              </label>
              <input
                type="tel"
                value={form.nomor_telepon}
                onChange={(e) => setForm({ ...form, nomor_telepon: e.target.value.replace(/\D/g, '') })}
                placeholder="081234567890"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Pengiriman <span className="text-brand-600">*</span>
              </label>
              <textarea
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Masukkan alamat lengkap pengiriman"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan (Opsional)
              </label>
              <textarea
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Catatan tambahan untuk pesanan ini"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Tunggu ya kak...
              </>
            ) : (
              'Buat Pesanan'
            )}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 pr-2">{item.product.nama} x{item.jumlah}</span>
                  <span className="shrink-0 font-medium">{formatRupiah(item.product.harga * item.jumlah)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-brand-600">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <div className="mt-4 bg-accent-50 border border-accent-100 rounded-xl p-3">
              <p className="text-xs text-accent-700 leading-relaxed">
                Setelah pesanan dibuat, Anda akan diarahkan untuk konfirmasi via WhatsApp ke Hayafood untuk pembayaran dan pengiriman.
              </p>
            </div>

            {/* Payment & Shipping info */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Metode Pembayaran</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['BCA', 'Mandiri', 'BRI', 'GoPay', 'OVO', 'Dana', 'ShopeePay'].map((p) => (
                    <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-medium">
                      {p}
                    </span>
                  ))}
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded font-bold">
                    COD (Khusus Area Jajag)
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kurir Pengiriman</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['J&T', 'JNE', 'SiCepat'].map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
