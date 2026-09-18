import React from 'react';
import { MapPin, Clock, Phone, Send, Navigation, ShieldCheck } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface LocationSectionProps {
  config: RestaurantConfig;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  return (
    <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30">
          <MapPin className="w-3.5 h-3.5" />
          <span>Visítanos o Pide a Domicilio</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F3EFE6]">
          UBICACIÓN <span className="gold-text-gradient">& HORARIOS</span>
        </h2>
        <p className="text-sm text-[#CFCBC0] font-light leading-relaxed">
          En el corazón gastronómico de Piedra Pintada en Ibagué, te esperamos en un ambiente acogedor entre bambú y ocobos rosados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Info Cards Column */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Address Card */}
          <div className="p-6 rounded-3xl bg-[#171D19] gold-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                  Dirección del Restaurante
                </h3>
                <p className="text-xs text-[#8ED09E] font-medium">Piedra Pintada, Ibagué</p>
              </div>
            </div>
            <p className="text-sm text-[#CFCBC0] font-medium pl-1">
              Cra. 6 con Calle 50, Ibagué, Tolima, Colombia.
            </p>
            <p className="text-xs text-[#A6A298] pl-1">
              Fácil acceso, parqueaderos cercanos y zona segura y tranquila de la ciudad.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Cra.+6+con+Calle+50+Ibague+Tolima"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5B869] hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Abrir en Google Maps →</span>
              </a>
            </div>
          </div>

          {/* Hours Card */}
          <div className="p-6 rounded-3xl bg-[#171D19] gold-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#3F7A4D]/20 text-[#8ED09E] border border-[#3F7A4D]/40">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                  Horarios de Atención
                </h3>
                <p className="text-xs text-[#8ED09E]">Cocina abierta para salón y domicilios</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-[#CFCBC0] divide-y divide-white/5">
              <div className="flex justify-between pt-1">
                <span>Lunes a Jueves:</span>
                <span className="font-semibold text-[#F3EFE6]">12:00 PM – 9:30 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Viernes y Sábados:</span>
                <span className="font-semibold text-[#E5B869]">12:00 PM – 10:30 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Domingos y Festivos:</span>
                <span className="font-semibold text-[#F3EFE6]">12:00 PM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1B271F] to-[#121A15] border border-[#25D366]/40 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#F3EFE6] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                Línea Directa de Pedidos
              </h4>
              <p className="text-base font-display font-bold text-[#25D366]">
                322 768 8168
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=573227688168&text=Hola%20Oso%20Fusi%C3%B3n%2C%20quisiera%20hacer%20un%20pedido%20o%20hacer%20una%20pregunta."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-lg shadow-[#25D366]/20 transition-all"
            >
              Chatear
            </a>
          </div>
        </div>

        {/* Map Visualization Column */}
        <div className="lg:col-span-7 rounded-3xl bg-[#171D19] gold-border-glow p-3 flex flex-col justify-between overflow-hidden shadow-2xl relative min-h-[380px]">
          {/* Stylized Simulated Map Container */}
          <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden bg-[#0F1411] border border-white/5 flex items-center justify-center p-6 text-center">
            {/* Ambient map grid and street lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#3F7A4D_1px,transparent_1px),linear-gradient(to_bottom,#3F7A4D_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Stylized River / Mountain contour */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 300">
              <path d="M 0 150 Q 100 80 200 160 T 400 120" stroke="#8ED09E" strokeWidth="6" fill="none" />
              <path d="M 0 220 Q 150 260 250 210 T 400 240" stroke="#E5B869" strokeWidth="4" fill="none" />
            </svg>

            {/* Centered Golden Location Pin */}
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#E5B869]/20 flex items-center justify-center animate-ping absolute inset-0" />
                <div className="w-16 h-16 rounded-full bg-[#18201B] border-2 border-[#E5B869] flex items-center justify-center shadow-2xl shadow-[#E5B869]/50 relative z-10">
                  <MapPin className="w-8 h-8 text-[#E5B869]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141A16]/95 backdrop-blur-md gold-border shadow-2xl max-w-xs text-center space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E89DA8]/20 text-[#E89DA8] uppercase">
                  Piedra Pintada
                </span>
                <h4 className="font-display font-bold text-base text-[#F3EFE6]">
                  Restaurante Oso Fusión
                </h4>
                <p className="text-xs text-[#CFCBC0]">
                  Carrera 6 con Calle 50, Ibagué
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Cra.+6+con+Calle+50+Ibague+Tolima"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] font-bold text-[11px] shadow transition-all hover:scale-105"
                  >
                    Cómo llegar con Waze / Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Delivery zone badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#8ED09E] bg-[#121614]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8ED09E]" />
                Zona de cobertura: Ibagué centro, norte, Vergel y alrededores
              </span>
              <span className="hidden sm:inline text-white/50">Entrega rápida</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
