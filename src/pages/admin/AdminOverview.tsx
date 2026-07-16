import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatRupiah } from '../../lib/format';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    newOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status'),
      supabase.from('products').select('id', { count: 'exact', head: true }),
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data || [];
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        totalProducts: productsRes.count || 0,
        newOrders: orders.filter((o) => o.status === 'baru').length,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-brand-50 text-brand-600' },
    { label: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pesanan Baru', value: stats.newOrders, icon: TrendingUp, color: 'bg-accent-50 text-accent-600' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
