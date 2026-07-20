import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';

interface AnimatedAddToCartButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function AnimatedAddToCartButton({
  onClick,
  disabled = false,
  productName,
  size = 'sm',
  fullWidth = false,
  className = '',
}: AnimatedAddToCartButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showParticle, setShowParticle] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || status !== 'idle') return;

    setStatus('loading');
    setShowParticle(true);

    try {
      onClick(e);
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setShowParticle(false);
        }, 1600);
      }, 350);
    } catch {
      setStatus('idle');
      setShowParticle(false);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''}`}>
      {/* Floating item particle animation */}
      <AnimatePresence>
        {showParticle && (
          <motion.div
            initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            animate={{
              opacity: [1, 1, 0],
              y: [-10, -50, -80],
              x: [0, 15, 30],
              scale: [1, 1.2, 0.4],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none z-30"
          >
            <div className="bg-accent-400 text-gray-950 shadow-lg p-2 rounded-full flex items-center justify-center font-black">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={disabled || status === 'loading'}
        whileHover={
          disabled
            ? {}
            : {
                scale: 1.08,
                y: -2,
                boxShadow: '0px 10px 24px rgba(225, 29, 72, 0.35)',
              }
        }
        whileTap={disabled ? {} : { scale: 0.92, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        className={`
          relative overflow-hidden font-black transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer
          ${
            disabled
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-400 dark:border-gray-600 cursor-not-allowed font-extrabold'
              : status === 'success'
              ? 'bg-accent-400 text-gray-950 shadow-lg'
              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg'
          }
          ${
            isSmall
              ? 'w-10 h-10 rounded-full'
              : fullWidth
              ? 'w-full py-3.5 px-6 rounded-xl text-base'
              : 'py-2.5 px-5 rounded-xl text-sm'
          }
          ${className}
        `}
        aria-label={
          status === 'success'
            ? 'Ditambahkan ke keranjang'
            : disabled
            ? 'Stok habis'
            : `Tambah ${productName || 'produk'} ke keranjang`
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} animate-spin`} />
              {!isSmall && <span>Menambahkan...</span>}
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 15,
              }}
              className="flex items-center justify-center gap-1.5"
            >
              <Check className={`${isSmall ? 'w-5 h-5' : 'w-5 h-5'} text-gray-950 stroke-[3]`} />
              {!isSmall && <span>Masuk Keranjang!</span>}
            </motion.div>
          )}

          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingCart className={isSmall ? 'w-4 h-4' : 'w-5 h-5'} />
              {!isSmall && <span>Beli Sekarang</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
