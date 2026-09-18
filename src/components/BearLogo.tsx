import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BearLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BearLogo: React.FC<BearLogoProps> = ({ size = 'md', showText = true }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic blinking effect for the spectacled bear
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const dimensions = {
    sm: { box: 38, icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 48, icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 64, icon: 52, text: 'text-2xl', sub: 'text-xs' },
  }[size];

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer" id="oso-logo-container">
      {/* Animated Bear Icon */}
      <motion.div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#202923] to-[#121614] gold-border p-1.5 shadow-md shadow-black/40 overflow-hidden"
        style={{ width: dimensions.box, height: dimensions.box }}
        animate={{
          scale: [1, 1.025, 1],
          rotate: [0, -1.2, 1.2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Subtle bamboo/ocobo ambient glow behind head */}
        <div className="absolute inset-0 bg-radial from-[#3F7A4D]/25 via-transparent to-transparent opacity-60" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bear Ears */}
          <circle cx="27" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2.5" />
          <circle cx="27" cy="30" r="8" fill="#5C3D2E" opacity="0.6" />
          <circle cx="73" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2.5" />
          <circle cx="73" cy="30" r="8" fill="#5C3D2E" opacity="0.6" />

          {/* Bear Head */}
          <circle cx="50" cy="54" r="34" fill="#181C19" stroke="#E5B869" strokeWidth="2.5" />

          {/* Spectacled Bear (Oso de Anteojos) Golden Markings around eyes */}
          <path
            d="M 28 46 C 26 38, 44 38, 45 47 C 46 54, 30 55, 28 46 Z"
            fill="none"
            stroke="#E5B869"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 72 46 C 74 38, 56 38, 55 47 C 54 54, 70 55, 72 46 Z"
            fill="none"
            stroke="#E5B869"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Bridge between the spectacles */}
          <path
            d="M 45 47 Q 50 44 55 47"
            fill="none"
            stroke="#E5B869"
            strokeWidth="2.5"
          />
          {/* Distinctive throat/chest golden crescent bib */}
          <path
            d="M 38 72 Q 50 82 62 72"
            fill="none"
            stroke="#E5B869"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Eyes (With Blinking Animation) */}
          {isBlinking ? (
            <>
              {/* Closed eyes slit */}
              <line x1="33" y1="47" x2="41" y2="47" stroke="#F3EFE6" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="59" y1="47" x2="67" y2="47" stroke="#F3EFE6" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Open eyes */}
              <circle cx="37" cy="46" r="3.2" fill="#F3EFE6" />
              <circle cx="38" cy="45" r="1.2" fill="#111412" />
              <circle cx="63" cy="46" r="3.2" fill="#F3EFE6" />
              <circle cx="64" cy="45" r="1.2" fill="#111412" />
            </>
          )}

          {/* Snout */}
          <ellipse cx="50" cy="61" rx="13" ry="9" fill="#262D28" />
          {/* Nose */}
          <path
            d="M 46 58 Q 50 56 54 58 Q 50 63 46 58 Z"
            fill="#E5B869"
          />
          {/* Subtle cute mouth */}
          <path
            d="M 50 62 L 50 65 Q 46 68 43 66 M 50 65 Q 54 68 57 66"
            stroke="#CFCBC0"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Small Pink Ocobo Flower tucked behind ear */}
          <circle cx="72" cy="24" r="3.5" fill="#E89DA8" />
          <circle cx="72" cy="24" r="1.5" fill="#FFF" />
        </svg>

        {/* Subtle breathing glow ring */}
        <motion.div
          className="absolute -inset-1 rounded-2xl border border-[#E5B869]/20"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-bold tracking-wider text-[#F3EFE6] ${dimensions.text} group-hover:text-[#E5B869] transition-colors`}>
              OSO <span className="gold-text-gradient">FUSIÓN</span>
            </span>
          </div>
          <span className={`font-sans tracking-widest uppercase text-[#CFCBC0]/80 font-medium ${dimensions.sub}`}>
            Asia & Colombia • Ibagué
          </span>
        </div>
      )}
    </div>
  );
};
