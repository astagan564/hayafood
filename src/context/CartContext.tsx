import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, jumlah?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, jumlah: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'hayafood_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, jumlah = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, jumlah: i.jumlah + jumlah } : i
        );
      }
      return [...prev, { product, jumlah }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, jumlah: number) => {
    if (jumlah <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, jumlah } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.jumlah, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.jumlah * i.product.harga, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}


