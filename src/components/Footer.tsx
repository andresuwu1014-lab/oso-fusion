import React from 'react';
import { BearLogo } from './BearLogo';
import { MapPin, Phone, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E1210] border-t border-white/10 pt-16 pb-12 text-[#CFCBC0] relative overflow-hidden">
      {/* Background soft ambient ocobo and gold glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#E5B869]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Story */}
          <div className="md:col-span-5 space-y-4">
            <BearLogo size="lg" />
            <p className="text-xs text-[#CFCBC0]/80 leading-relaxed max-w-sm">
              Inspirado en la fuerza y serenidad del oso de anteojos andino, los bosques de niebla del Tolima y los milenarios secretos de la cocina oriental. Una experiencia gastronómica sin igual en Ibagué.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E89DA8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Con la magia de los ocobos rosados de Ibagué</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-display font-bold text-sm text-[#F3EFE6] tracking-wider uppercase">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 text-[#CFCBC0]/70">
              <li>
                <a href="#hero" className="hover:text-[#E5B869] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#E5B869] transition-colors">
                  Carta & Pedidos
                </a>
              </li>
              <li>
                <a href="#promotions" className="hover:text-[#E5B869] transition-colors">
                  Promociones & Descuentos
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#E5B869] transition-colors">
                  Ubicación & Horarios
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-display font-bold text-sm text-[#F3EFE6] tracking-wider uppercase">
              Contacto Oficial
            </h4>
            <div className="space-y-2 text-[#CFCBC0]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5B869] shrink-0 mt-0.5" />
                <span>Cra. 6 con Calle 50, Piedra Pintada, Ibagué, Tolima, Colombia</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp de Pedidos: <strong>322 768 8168</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#CFCBC0]/50">
          <p>© {new Date().getFullYear()} Oso Fusión Restaurante. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3 h-3 text-[#E89DA8] fill-[#E89DA8]" /> para Ibagué, Tolima
          </p>
        </div>
      </div>
    </footer>
  );
};
