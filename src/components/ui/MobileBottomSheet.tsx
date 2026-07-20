import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: MobileBottomSheetProps) {
  // Disable body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden">
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Bottom Sheet Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 30,
            }}
            className="relative w-full max-w-lg glass-luxury border-t border-amber-500/30 rounded-t-[2.5rem] p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
          >
            {/* Top Handle Pill */}
            <div className="w-12 h-1.5 bg-amber-500/40 rounded-full mx-auto mb-4" />

            {/* Header Title & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-950 dark:text-white">
                {title || 'Menu Pilihan'}
              </h3>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass-luxury border border-amber-500/30 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-amber-500/20 transition-colors cursor-pointer gold-border-glow"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Sheet Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
