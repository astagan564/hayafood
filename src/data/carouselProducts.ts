import { Sparkles, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';

export interface CarouselProductItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  tag: string;
  image: string;
  icon: typeof Sparkles;
}

export const CAROUSEL_PRODUCTS: CarouselProductItem[] = [
  {
    id: 'product-1',
    badge: 'Produk Unggulan 01',
    title: 'Kripik Singkong Super Renyah',
    subtitle: 'Bahan Pilihan Organik dari Petani Lokal',
    description: 'Diiris tipis dengan presisi dan digoreng higienis hingga menghasilkan kerenyahan maksimal yang gurih, empuk, dan ringan di mulut.',
    price: 'Rp 15.000',
    tag: '100% Renyah',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1000&q=80',
    icon: Sparkles,
  },
  {
    id: 'product-2',
    badge: 'Produk Unggulan 02',
    title: 'Kripik Pentol Pedas Manis',
    subtitle: 'Racikan Bumbu Rempah Rahasia Hayafood',
    description: 'Sensasi kripik pentol gurih dipadu dengan taburan bumbu rempah pedas manis yang meresap sempurna hingga ke lapisan ter dalam.',
    price: 'Rp 18.000',
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1000&q=80',
    icon: Flame,
  },
  {
    id: 'product-3',
    badge: 'Produk Unggulan 03',
    title: 'Kripik Tempe Crispy Premium',
    subtitle: 'Kedelai Murni Tanpa Bahan Pengawet',
    description: 'Kripik tempe renyah dengan balutan tepung bumbu spesial yang gurih, kaya protein, dan cocok untuk cemilan keluarga.',
    price: 'Rp 16.000',
    tag: 'Protein Tinggi',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    icon: ShieldCheck,
  },
  {
    id: 'product-4',
    badge: 'Produk Unggulan 04',
    title: 'Hayafood Signature Package',
    subtitle: 'Kemasan Foil Kedap Udara Ready to Eat',
    description: 'Dikemas dengan teknologi foil aluminium kedap udara bermutu tinggi untuk menjamin kerenyahan kripik tetap terjaga penuh.',
    price: 'Rp 45.000',
    tag: 'Fresh Foil Lock',
    image: 'https://tzzdbbdqxrvjyupigowq.supabase.co/storage/v1/object/public/product-images/Screenshot%20From%202026-07-16%2019-46-00.png',
    icon: ShoppingBag,
  },
];
