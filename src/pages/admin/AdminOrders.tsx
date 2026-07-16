import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem } from '../../types';
import { formatRupiah, formatDate } from '../../lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import { useToast } from '../../hooks/useToast';
import { Eye, X } from 'lucide-react';

export function AdminOrders() {
  const { show } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<{ order: Order; items: OrderItem[] } | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    query.then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  };

  useEffect(fetchOrders, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      show('Gagal mengubah status', 'error');
    } else {
      show('Status pesanan diperbarui');
      fetchOrders();
    }
  };

  const viewOrder = async (order: Order) => {
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    setSelectedOrder({ order, items: data || [] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pesanan</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm font-medium bg-white"
        >
          <option value="all">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Tidak ada pesanan</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">No. Pesanan</th>
                  <th className="pb-3 font-medium">Pembeli</th>
                  <th className="pb-3 font-medium">Telepon</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 text-sm">
                    <td className="py-3 font-mono font-semibold text-gray-700">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 text-gray-600">{order.nama_pembeli}</td>
                    <td className="py-3 text-gray-600">{order.nomor_telepon}</td>
                    <td className="py-3 font-semibold text-gray-700">{formatRupiah(order.total)}</td>
                    <td className="py-3 text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${ORDER_STATUS_COLORS[order.status] || ''}`}
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => viewOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono font-semibold text-sm text-gray-700">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">{order.nama_pembeli}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${ORDER_STATUS_COLORS[order.status] || ''}`}
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formatDate(order.created_at)}</span>
                  <span className="font-semibold text-brand-600">{formatRupiah(order.total)}</span>
                </div>
                <button
                  onClick={() => viewOrder(order)}
                  className="mt-2 text-xs text-brand-600 font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Lihat detail
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Detail Pesanan</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">No. Pesanan</p>
                <p className="font-mono font-semibold">{selectedOrder.order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pembeli</p>
                <p className="font-medium">{selectedOrder.order.nama_pembeli}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Telepon</p>
                <p className="font-medium">{selectedOrder.order.nomor_telepon}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Alamat</p>
                <p className="font-medium">{selectedOrder.order.alamat}</p>
              </div>
              {selectedOrder.order.catatan && (
                <div>
                  <p className="text-xs text-gray-400">Catatan</p>
                  <p className="font-medium">{selectedOrder.order.catatan}</p>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-2">Item</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.nama_product} x{item.jumlah}</span>
                    <span className="font-medium">{formatRupiah(item.harga_satuan * item.jumlah)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-brand-600">{formatRupiah(selectedOrder.order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
