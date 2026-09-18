import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowDown, Sparkles, ChefHat, Clock, Store, Bike, UtensilsCrossed } from 'lucide-react';
import { OrderModality } from '../types';

interface HeroSectionProps {
  onExploreMenu: () => void;
  modality: OrderModality;
  setModality: (m: OrderModality) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  modality,
  setModality,
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with layered gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_oso_fusion_1789763695701.jpg"
          alt="Oso Fusión restaurante en Ibagué"
          className="w-full h-full object-cover object-center scale-105 filter brightness-80"
        />
        {/* Gradients: Vignette, Dark overlay, and mist hints */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111412] via-[#111412]/75 to-[#111412]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#111412]/40 to-[#111412]/90" />
      </div>

      {/* Floating subtle ambient particles representing pink Ocobo petals */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#E89DA8]/40 blur-[1px]"
            style={{
              width: 8 + (i % 3) * 4,
              height: 12 + (i % 3) * 4,
              borderRadius: '50% 20% 50% 20%',
              left: `${15 + i * 14}%`,
              top: `${10 + (i * 18) % 70}%`,
            }}
            animate={{
              y: [0, 40, 80],
              x: [0, 15, -10],
              rotate: [0, 45, 120],
              opacity: [0.3, 0.7, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center space-y-8">
        {/* Top Tag: Location and Concept */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#18201B]/90 backdrop-blur-md px-4 py-1.5 gold-border shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#E89DA8] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#E5B869]">
            Piedra Pintada • Cra. 6 con Calle 50, Ibagué
          </span>
          <span className="text-white/30">|</span>
          <span className="text-xs text-[#CFCBC0]/90">Asia + Tolima</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#F3EFE6] tracking-tight leading-[1.1]">
            SABORES DE ASIA, <br />
            <span className="gold-text-gradient">EL ALMA DE COLOMBIA</span>
          </h1>
          <p className="text-sm sm:text-lg text-[#CFCBC0] font-light max-w-2xl mx-auto leading-relaxed">
            Una experiencia gastronómica única inspirada en el oso de anteojos, las montañas andinas del Tolima y la maestría culinaria oriental.
          </p>
        </motion.div>

        {/* Interactive Modality Selector in Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-lg p-2 rounded-2xl bg-[#171D19]/90 backdrop-blur-md gold-border shadow-2xl"
        >
          <p className="text-[11px] font-semibold text-[#E5B869] tracking-wider uppercase mb-2">
            Selecciona tu modalidad de pedido:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setModality('domicilio')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                modality === 'domicilio'
                  ? 'bg-gradient-to-b from-[#E5B869] to-[#C49847] text-[#111412] font-bold border-[#E5B869] shadow-md'
                  : 'bg-[#121614] border-white/5 text-[#CFCBC0] hover:border-white/20'
              }`}
            >
              <Bike className="w-5 h-5 mb-1" />
              <span className="text-xs">Domicilio</span>
              <span className="text-[9px] opacity-80">En Ibagué</span>
            </button>

            <button
              type="button"
              onClick={() => setModality('recoger')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                modality === 'recoger'
                  ? 'bg-gradient-to-b from-[#E5B869] to-[#C49847] text-[#111412] font-bold border-[#E5B869] shadow-md'
                  : 'bg-[#121614] border-white/5 text-[#CFCBC0] hover:border-white/20'
              }`}
            >
              <Store className="w-5 h-5 mb-1" />
              <span className="text-xs">Para Recoger</span>
              <span className="text-[9px] opacity-80">Piedra Pintada</span>
            </button>

            <button
              type="button"
              onClick={() => setModality('restaurante')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                modality === 'restaurante'
                  ? 'bg-gradient-to-b from-[#E5B869] to-[#C49847] text-[#111412] font-bold border-[#E5B869] shadow-md'
                  : 'bg-[#121614] border-white/5 text-[#CFCBC0] hover:border-white/20'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 mb-1" />
              <span className="text-xs">En Mesa</span>
              <span className="text-[9px] opacity-80">Comer acá</span>
            </button>
          </div>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            type="button"
            onClick={onExploreMenu}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-3.5 px-8 text-sm shadow-xl shadow-[#E5B869]/25 transition-all hover:scale-105 active:scale-98"
            id="btn-hero-explore"
          >
            <span>Ver Carta y Ordenar</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href="https://api.whatsapp.com/send?phone=573227688168&text=Hola%20Oso%20Fusi%C3%B3n%2C%20quisiera%20consultar%20sobre%20una%20reserva%20o%20pedido."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-[#1A211D]/80 hover:bg-[#242D28] text-[#F3EFE6] border border-white/10 hover:border-[#E5B869]/40 py-3.5 px-6 text-sm font-semibold transition-all backdrop-blur-md"
          >
            <span>WhatsApp Directo (3227688168)</span>
          </a>
        </motion.div>

        {/* Value Props Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 text-xs text-[#CFCBC0]/80"
        >
          <div className="flex items-center justify-center gap-2">
            <ChefHat className="w-4 h-4 text-[#E5B869]" />
            <span>Recetas Fusión Auténticas</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#8ED09E]" />
            <span>Preparación al Instante</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E89DA8]" />
            <span>Ingredientes Frescos y Locales</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
