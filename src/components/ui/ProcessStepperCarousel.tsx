import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Check, Sparkles } from 'lucide-react';

import { Link } from '../../lib/router';
import { CAROUSEL_PRODUCTS } from '@/data/carouselProducts';


export function ProcessStepperCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = CAROUSEL_PRODUCTS.length;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const activeProduct = CAROUSEL_PRODUCTS[currentIndex];

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-gray-950 dark:via-brand-950 dark:to-gray-950 transition-colors duration-300">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-600/10 dark:bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-400/15 dark:bg-accent-400/25 blur-[120px]" />
      </div>

      <div className="relative max-w-[90rem] mx-auto z-10">
        
        {/* 3D APPLE TV COVER FLOW STAGE */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[540px] flex items-center justify-center perspective-[1400px] preserve-3d">
          
          {/* LEFT PEEK CARD */}
          <motion.div
            key={`left-${prevIndex}`}
            onClick={handlePrev}
            initial={{ opacity: 0, x: '-90%' }}
            animate={{
              x: '-72%',
              rotateY: 22,
              scale: 0.85,
              opacity: 0.55,
              filter: 'brightness(70%) contrast(100%)',
              zIndex: 10,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute w-[300px] sm:w-[480px] md:w-[620px] lg:w-[680px] aspect-16/10 rounded-3xl overflow-hidden border-2 border-gray-400 dark:border-gray-700 shadow-2xl cursor-pointer group hover:opacity-85 transition-opacity"
          >
            <img
              src={CAROUSEL_PRODUCTS[prevIndex].image}
              alt={CAROUSEL_PRODUCTS[prevIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />
          </motion.div>

          {/* RIGHT PEEK CARD */}
          <motion.div
            key={`right-${nextIndex}`}
            onClick={handleNext}
            initial={{ opacity: 0, x: '90%' }}
            animate={{
              x: '72%',
              rotateY: -22,
              scale: 0.85,
              opacity: 0.55,
              filter: 'brightness(70%) contrast(100%)',
              zIndex: 10,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute w-[300px] sm:w-[480px] md:w-[620px] lg:w-[680px] aspect-16/10 rounded-3xl overflow-hidden border-2 border-gray-400 dark:border-gray-700 shadow-2xl cursor-pointer group hover:opacity-85 transition-opacity"
          >
            <img
              src={CAROUSEL_PRODUCTS[nextIndex].image}
              alt={CAROUSEL_PRODUCTS[nextIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />
          </motion.div>

          {/* CENTER ACTIVE CARD */}
          <motion.div
            key={`center-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              x: '0%',
              rotateY: 0,
              scale: 1.05,
              opacity: 1,
              filter: 'brightness(100%) contrast(105%)',
              zIndex: 30,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="absolute w-[320px] sm:w-[520px] md:w-[680px] lg:w-[740px] aspect-16/10 rounded-3xl overflow-hidden border-4 border-brand-600 dark:border-accent-400 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] group"
          >
            <img
              src={activeProduct.image}
              alt={activeProduct.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Tag Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-brand-600 text-white dark:bg-accent-400 dark:text-gray-950 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black backdrop-blur-md flex items-center gap-2 shadow-xl border border-white/20">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{activeProduct.tag}</span>
            </div>
          </motion.div>

          {/* LEFT NAV ARROW (<) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 md:left-16 lg:left-24 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-brand-600 border-2 border-brand-600 hover:bg-brand-600 hover:text-white dark:bg-gray-900 dark:text-accent-400 dark:border-accent-400 dark:hover:bg-accent-400 dark:hover:text-gray-950 shadow-2xl flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 active:scale-95"
            aria-label="Produk sebelumnya"
          >
            <ChevronLeft className="w-7 h-7 stroke-[3]" />
          </button>

          {/* RIGHT NAV ARROW (>) */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 md:right-16 lg:right-24 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-brand-600 border-2 border-brand-600 hover:bg-brand-600 hover:text-white dark:bg-gray-900 dark:text-accent-400 dark:border-accent-400 dark:hover:bg-accent-400 dark:hover:text-gray-950 shadow-2xl flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 active:scale-95"
            aria-label="Produk selanjutnya"
          >
            <ChevronRight className="w-7 h-7 stroke-[3]" />
          </button>

        </div>

        {/* FLOATING TEXT DETAILS */}
        <div className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 min-h-[170px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeProduct.id}
              custom={direction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-3 px-4"
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-accent-300 border-2 border-brand-300 dark:border-brand-800 shadow-xs">
                <Sparkles className="w-4 h-4 text-accent-500" />
                {activeProduct.badge}
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight drop-shadow-sm">
                {activeProduct.title}
              </h2>

              <h3 className="text-base sm:text-lg font-extrabold text-brand-700 dark:text-accent-400">
                {activeProduct.subtitle}
              </h3>

              <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 font-semibold leading-relaxed max-w-2xl mx-auto">
                {activeProduct.description}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <span className="text-2xl sm:text-3xl font-black text-brand-700 dark:text-white">
                  {activeProduct.price}
                </span>
                <Link
                  to="/produk"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  Lihat Produk Spesial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SLIDE INDICATOR DOTS */}
        <div className="flex justify-center items-center gap-2.5 mt-8 sm:mt-10">
          {CAROUSEL_PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-10 bg-brand-600 dark:bg-accent-400 shadow-md'
                  : 'w-3 bg-gray-400 dark:bg-gray-600 hover:bg-brand-600 dark:hover:bg-accent-400'
              }`}
              aria-label={`Buka slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
