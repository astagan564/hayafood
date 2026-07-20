import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ShieldCheck, Flame, ShoppingBag, ArrowDown } from 'lucide-react';
import { Link } from '../../lib/router';

const STORY_STEPS = [
  {
    icon: Sparkles,
    badge: 'Step 1: Bahan Organik',
    title: 'Bahan Pilihan Berkualitas',
    description: 'Dipetik & dipilih langsung dari bahan alami segar pilihan tanpa bahan pengawet sintesis.',
    color: 'from-amber-400 to-amber-600',
  },
  {
    icon: Flame,
    badge: 'Step 2: Irisan Presisi',
    title: 'Pemotongan & Kerenyahan Maksimal',
    description: 'Diiris dengan tingkat ketebalan presisi untuk menghasilkan tekstur kripik yang kriuk sempurna di setiap gigitan.',
    color: 'from-brand-400 to-brand-600',
  },
  {
    icon: ShieldCheck,
    badge: 'Step 3: Racikan Rempah Khas',
    title: 'Bumbu Khas Rahasia Hayafood',
    description: 'Dibalut dengan racikan bumbu rempah-rempah pilihan yang gurih, pedas pas, dan meresap hingga ke dalam.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: ShoppingBag,
    badge: 'Step 4: Kemasan Premium',
    title: 'Kemasan Kedap Udara Ready to Eat',
    description: 'Dikemas higienis dengan foil kedap udara untuk menjaga kerenyahan dan kesegaran rasa tahan lama.',
    color: 'from-accent-400 to-amber-500',
  },
];

export function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll inside this specific tall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out scroll values using spring physics
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // 360 Degree Product rotation based on scroll progress (0° -> 360°)
  const productRotation = useTransform(smoothProgress, [0, 1], [0, 360]);

  // Exploded View Transformations for 4 distinct product layers
  // Layer 1: Base Ingredients (singkong/pentol)
  const layer1Y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, -40, -90, -130]);
  const layer1Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.95, 0.9]);
  const layer1Opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.4, 1, 1, 0.8]);

  // Layer 2: Crispy Slices
  const layer2Y = useTransform(smoothProgress, [0.15, 0.4, 0.75, 1], [60, -10, -50, -80]);
  const layer2Scale = useTransform(smoothProgress, [0.2, 0.6, 1], [0.8, 1.05, 1]);
  const layer2Opacity = useTransform(smoothProgress, [0.15, 0.3, 0.9, 1], [0, 1, 1, 0.8]);

  // Layer 3: Secret Seasoning Dust
  const layer3Y = useTransform(smoothProgress, [0.35, 0.6, 0.85, 1], [90, 20, -10, -30]);
  const layer3Scale = useTransform(smoothProgress, [0.35, 0.7, 1], [0.7, 1.1, 1.05]);
  const layer3Opacity = useTransform(smoothProgress, [0.3, 0.45, 0.95, 1], [0, 1, 1, 0.9]);

  // Layer 4: Premium Foil Packaging (Outer Seal)
  const layer4Y = useTransform(smoothProgress, [0.55, 0.8, 1], [120, 40, 0]);
  const layer4Scale = useTransform(smoothProgress, [0.55, 0.8, 1], [0.8, 1, 1.05]);
  const layer4Opacity = useTransform(smoothProgress, [0.5, 0.7, 1], [0, 1, 1]);

  // Narrative step progress index indicator
  const activeStep = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 1, 2, 3]);

  // Step progress bar scaleX values – must be top-level hooks (Rules of Hooks)
  const stepScale0 = useTransform(smoothProgress, [0 * 0.25, 1 * 0.25], [0, 1]);
  const stepScale1 = useTransform(smoothProgress, [1 * 0.25, 2 * 0.25], [0, 1]);
  const stepScale2 = useTransform(smoothProgress, [2 * 0.25, 3 * 0.25], [0, 1]);
  const stepScale3 = useTransform(smoothProgress, [3 * 0.25, 4 * 0.25], [0, 1]);
  const stepScales = [stepScale0, stepScale1, stepScale2, stepScale3];

  // Active step display values – must be top-level hooks (Rules of Hooks)
  const stepDisplay0 = useTransform(activeStep, (v: number) => (Math.floor(v) === 0 ? 'block' : 'none'));
  const stepDisplay1 = useTransform(activeStep, (v: number) => (Math.floor(v) === 1 ? 'block' : 'none'));
  const stepDisplay2 = useTransform(activeStep, (v: number) => (Math.floor(v) === 2 ? 'block' : 'none'));
  const stepDisplay3 = useTransform(activeStep, (v: number) => (Math.floor(v) === 3 ? 'block' : 'none'));
  const stepDisplays = [stepDisplay0, stepDisplay1, stepDisplay2, stepDisplay3];

  return (
    <section ref={containerRef} className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-brand-950 text-white min-h-[260vh]">
      {/* Sticky Fullscreen Canvas */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Header Info */}
        <div className="text-center z-20 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-3 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Interactive Storytelling 360°</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-accent-300">
            Anatomi Kerenyahan Hayafood
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mt-2 flex items-center justify-center gap-2">
            Scroll ke bawah untuk melihat rahasia di balik setiap kemasan
            <ArrowDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </p>
        </div>

        {/* Center Stage: 360° Exploded View Product Visualization */}
        <div className="relative flex-1 flex items-center justify-center my-4 z-10">
          
          {/* Ambient Radial Glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-accent-500/15 blur-2xl pointer-events-none" />

          {/* 360 Rotating Exploded Assembly */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* LAYER 1: Base Raw Ingredients (Singkong / Pentol Pilihan) */}
            <motion.div
              style={{
                y: layer1Y,
                scale: layer1Scale,
                opacity: layer1Opacity,
                rotateY: productRotation,
              }}
              className="absolute z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-amber-800/40 to-amber-950/80 border border-amber-500/30 backdrop-blur-md flex flex-col items-center justify-center p-4 shadow-2xl"
            >
              <div className="text-3xl sm:text-4xl mb-1">🥔</div>
              <span className="text-xs sm:text-sm font-bold text-amber-200">1. Raw Ingredient</span>
              <span className="text-[10px] text-amber-300/70 text-center">Singkong & Pentol Segar</span>
            </motion.div>

            {/* LAYER 2: Precision Crispy Chips (Irisan Renyah) */}
            <motion.div
              style={{
                y: layer2Y,
                scale: layer2Scale,
                opacity: layer2Opacity,
                rotateY: productRotation,
              }}
              className="absolute z-20 w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-emerald-800/40 to-emerald-950/80 border border-emerald-400/40 backdrop-blur-md flex flex-col items-center justify-center p-4 shadow-2xl"
            >
              <div className="text-3xl sm:text-4xl mb-1">✨</div>
              <span className="text-xs sm:text-sm font-bold text-emerald-200">2. Crispy Texture</span>
              <span className="text-[10px] text-emerald-300/70 text-center">Irisan Tipis & Renyah</span>
            </motion.div>

            {/* LAYER 3: Secret Spice Dust (Taburan Rempah) */}
            <motion.div
              style={{
                y: layer3Y,
                scale: layer3Scale,
                opacity: layer3Opacity,
                rotateZ: productRotation,
              }}
              className="absolute z-30 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-red-900/30 to-amber-900/60 border border-red-500/40 backdrop-blur-md flex flex-col items-center justify-center p-4 shadow-2xl"
            >
              <div className="text-3xl sm:text-4xl mb-1">🌶️</div>
              <span className="text-xs sm:text-sm font-bold text-red-200">3. Secret Spice Blend</span>
              <span className="text-[10px] text-red-300/70 text-center">Taburan Rempah Gurih</span>
            </motion.div>

            {/* LAYER 4: Final Sealed Product (Kemasan Hayafood Premium) */}
            <motion.div
              style={{
                y: layer4Y,
                scale: layer4Scale,
                opacity: layer4Opacity,
                rotateY: productRotation,
              }}
              className="absolute z-40 w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-emerald-400/60 shadow-2xl shadow-emerald-900/50 bg-gray-900/80"
            >
              <img
                src="https://tzzdbbdqxrvjyupigowq.supabase.co/storage/v1/object/public/product-images/Screenshot%20From%202026-07-16%2019-46-00.png"
                alt="Produk Premium Hayafood"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent p-3 text-center">
                <span className="text-xs sm:text-sm font-bold text-accent-300">Hayafood Signature</span>
                <span className="block text-[10px] text-gray-300">Ready to Enjoy</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Narrative Card & Step Controls */}
        <div className="z-20 max-w-xl mx-auto w-full pb-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
          {STORY_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              className="h-1.5 rounded-full overflow-hidden bg-gray-800"
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${step.color}`}
                style={{
                  scaleX: stepScales[idx],
                  transformOrigin: 'left',
                }}
              />
            </motion.div>
          ))}
          </div>

          {/* Active Story Step Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-5 rounded-2xl shadow-2xl">
            {STORY_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  style={{
                    display: stepDisplays[idx],
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${step.color} text-gray-950 font-bold`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        {step.badge}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}

            {/* CTA Link to products */}
            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">Siap mencoba kelezatannya?</span>
              <Link
                to="/produk"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                Pesan Sekarang ↗
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
