import React from 'react';
import { Tag, Gift, Users, Calendar, Sparkles, Heart } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsSectionProps {
  promotions: Promotion[];
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ promotions }) => {
  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Gift className="w-5 h-5 text-[#E89DA8]" />;
      case 'group':
        return <Users className="w-5 h-5 text-[#8ED09E]" />;
      case 'wednesday':
        return <Tag className="w-5 h-5 text-[#E5B869]" />;
      case 'sunday':
        return <Heart className="w-5 h-5 text-[#E89DA8]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#E5B869]" />;
    }
  };

  return (
    <section id="promotions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-[#E89DA8]/15 text-[#F4C4CC] border border-[#E89DA8]/30">
          <Tag className="w-3.5 h-3.5" />
          <span>Beneficios Especiales</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F3EFE6]">
          PROMOCIONES <span className="gold-text-gradient">& CELEBRACIONES</span>
        </h2>
        <p className="text-sm text-[#CFCBC0] font-light leading-relaxed">
          En Oso Fusión nos encanta consentirte. Aprovecha nuestros descuentos especiales y cortesías en tus momentos más importantes en Ibagué.
        </p>
      </div>

      {/* Promotions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="group relative rounded-3xl bg-gradient-to-b from-[#1A221D] to-[#121614] gold-border hover:gold-border-glow p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
          >
            {/* Background Ocobo Ambient Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E89DA8]/10 rounded-full blur-2xl group-hover:bg-[#E89DA8]/20 transition-all pointer-events-none" />

            <div>
              {/* Header: Icon & Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#222C25] border border-white/10 flex items-center justify-center shadow-inner">
                  {getPromoIcon(promo.type)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/40">
                  {promo.badgeText || promo.badge || 'PROMO'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-bold text-xl text-[#F3EFE6] group-hover:text-[#E5B869] transition-colors mb-2">
                {promo.name}
              </h3>
              <p className="text-xs text-[#CFCBC0] leading-relaxed mb-4">
                {promo.description}
              </p>

              {/* Rules List */}
              <div className="space-y-1.5 pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8ED09E] block mb-1">
                  Condiciones:
                </span>
                {(promo.rules || (promo.conditions ? [promo.conditions] : [])).map((rule: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#A6A298]">
                    <span className="text-[#E5B869]">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA / Status */}
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-[#8ED09E] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8ED09E] animate-pulse" />
                Válida todo el año
              </span>

              <a
                href={`https://api.whatsapp.com/send?phone=573227688168&text=Hola%20Oso%20Fusi%C3%B3n%2C%20quisiera%20hacer%20efectiva%20la%20promoci%C3%B3n%3A%20${encodeURIComponent(promo.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#E5B869] hover:underline"
              >
                Solicitar por WhatsApp →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
