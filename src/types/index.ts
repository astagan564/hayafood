export interface Category {
  id: string;
  nama: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  nama: string;
  deskripsi: string | null;
  harga: number;
  gambar_url: string | null;
  category_id: string | null;
  stok: number;
  is_active: boolean;
  created_at: string;
  categories?: Category | null;
}

export interface Order {
  id: string;
  nama_pembeli: string;
  nomor_telepon: string;
  alamat: string;
  catatan: string | null;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  nama_product: string;
  jumlah: number;
  harga_satuan: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  jumlah: number;
}

export type OrderStatus = 'baru' | 'diproses' | 'dikirim' | 'selesai';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  baru: 'Baru',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  baru: 'bg-red-100 text-red-700 border-red-200',
  diproses: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  dikirim: 'bg-blue-100 text-blue-700 border-blue-200',
  selesai: 'bg-green-100 text-green-700 border-green-200',
};
