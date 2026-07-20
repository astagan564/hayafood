import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  depthScale?: number;
}

export function Interactive3DCard({
  children,
  className = '',
  intensity = 15,
  depthScale = 1.05,
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for X and Y cursor offset relative to center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth continuous 3D tilt tracking
  const springConfig = { stiffness: 300, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  // Dynamic light glare position & opacity
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const rawOpacity = useTransform(x, [-0.5, 0, 0.5], [0.35, 0, 0.35]);
  const glareOpacity = useSpring(rawOpacity, springConfig);

  // Shadow dynamics offset based on tilt angle
  const shadowX = useTransform(rotateY, [-intensity, intensity], [15, -15]);
  const shadowY = useTransform(rotateX, [-intensity, intensity], [20, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={`relative group ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: depthScale }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="w-full h-full relative rounded-2xl transition-shadow duration-300 transform-gpu [backface-visibility:hidden]"
      >
        {/* Render children inside crisp hardware-accelerated container */}
        <div className="w-full h-full rounded-2xl overflow-hidden relative transform-gpu [backface-visibility:hidden]">
          {children}

          {/* Interactive 3D light glare layer */}
          <motion.div
            style={{
              opacity: glareOpacity,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`
              ),
            }}
            className="absolute inset-0 pointer-events-none rounded-2xl z-20 hidden md:block"
          />
        </div>

        {/* Dynamic ambient 3D drop shadow */}
        <motion.div
          style={{
            x: shadowX,
            y: shadowY,
          }}
          className="absolute inset-0 -z-10 rounded-2xl bg-black/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block"
        />
      </motion.div>
    </motion.div>
  );
}
