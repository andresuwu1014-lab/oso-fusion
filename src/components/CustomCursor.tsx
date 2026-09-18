import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 450, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 450, damping: 30 });

  useEffect(() => {
    // Only enable on desktop fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const moveHandler = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const downHandler = () => setIsClicking(true);
    const upHandler = () => setIsClicking(false);

    const checkHoverTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A';

      setIsHoveringClickable(!!isClickable);
    };

    const leaveHandler = () => setIsVisible(false);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mousemove', checkHoverTarget);
    window.addEventListener('mousedown', downHandler);
    window.addEventListener('mouseup', upHandler);
    document.addEventListener('mouseleave', leaveHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousemove', checkHoverTarget);
      window.removeEventListener('mousedown', downHandler);
      window.removeEventListener('mouseup', upHandler);
      document.removeEventListener('mouseleave', leaveHandler);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: cursorX,
        top: cursorY,
      }}
      animate={{
        scale: isClicking ? 0.85 : isHoveringClickable ? 1.35 : 1,
      }}
      transition={{ duration: 0.15 }}
      id="custom-bear-cursor"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow circle */}
        <motion.div
          className={`absolute rounded-full transition-all duration-300 ${
            isHoveringClickable
              ? 'w-10 h-10 bg-[#E5B869]/20 border border-[#E5B869] shadow-[0_0_12px_rgba(229,184,105,0.4)]'
              : 'w-7 h-7 bg-black/40 border border-[#E5B869]/40'
          }`}
        />

        {/* Spectacled Bear Paw SVG */}
        <svg
          width={isHoveringClickable ? "24" : "18"}
          height={isHoveringClickable ? "24" : "18"}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow"
        >
          {/* Main Paw Pad */}
          <path
            d="M 12 24 C 12 18, 28 18, 28 24 C 28 30, 24 33, 20 33 C 16 33, 12 30, 12 24 Z"
            fill={isHoveringClickable ? "#E5B869" : "#F3EFE6"}
          />
          {/* Inner Golden Spectacle Ring marking inside paw */}
          <circle cx="20" cy="24" r="3" stroke={isHoveringClickable ? "#111412" : "#E5B869"} strokeWidth="1.5" />

          {/* 4 Toe Pads with claws */}
          <ellipse cx="10" cy="14" rx="2.5" ry="3.5" fill={isHoveringClickable ? "#E5B869" : "#F3EFE6"} />
          <ellipse cx="16.5" cy="11" rx="2.8" ry="4" fill={isHoveringClickable ? "#E5B869" : "#F3EFE6"} />
          <ellipse cx="23.5" cy="11" rx="2.8" ry="4" fill={isHoveringClickable ? "#E5B869" : "#F3EFE6"} />
          <ellipse cx="30" cy="14" rx="2.5" ry="3.5" fill={isHoveringClickable ? "#E5B869" : "#F3EFE6"} />

          {/* Golden Claws tip */}
          <path d="M 10 10 L 9 8" stroke="#E5B869" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 16.5 6.5 L 16.5 4.5" stroke="#E5B869" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 23.5 6.5 L 23.5 4.5" stroke="#E5B869" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 30 10 L 31 8" stroke="#E5B869" strokeWidth="1.2" strokeLinecap="round" />
        </svg>

        {/* Small Pink Ocobo Petal on Hover */}
        {isHoveringClickable && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -right-2 w-2.5 h-2.5 rounded-full bg-[#E89DA8] shadow-[0_0_6px_#E89DA8]"
          />
        )}
      </div>
    </motion.div>
  );
};
