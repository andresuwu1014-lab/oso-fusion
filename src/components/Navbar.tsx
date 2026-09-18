import React, { useState } from 'react';
import { ShoppingBag, Lock, Menu, X, MapPin, Store, UtensilsCrossed, Phone } from 'lucide-react';
import { BearLogo } from './BearLogo';
import { OrderModality } from '../types';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  modality: OrderModality;
  setModality: (m: OrderModality) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenAdmin,
  modality,
  setModality,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#121614]/90 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div onClick={() => handleNavClick('hero')}>
          <BearLogo size="md" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#CFCBC0]">
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="hover:text-[#E5B869] transition-colors"
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('menu')}
            className="hover:text-[#E5B869] transition-colors"
          >
            Fusion Menu
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('promotions')}
            className="hover:text-[#E5B869] transition-colors flex items-center gap-1"
          >
            <span>Promociones</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E89DA8]" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('location')}
            className="hover:text-[#E5B869] transition-colors"
          >
            Ubicación
          </button>
        </nav>

        {/* Order Modality Quick Selector (Desktop) */}
        <div className="hidden lg:flex items-center bg-[#181F1A] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setModality('domicilio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              modality === 'domicilio'
                ? 'bg-[#E5B869] text-[#111412] font-semibold shadow-sm'
                : 'text-[#CFCBC0] hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Domicilio</span>
          </button>
          <button
            type="button"
            onClick={() => setModality('recoger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              modality === 'recoger'
                ? 'bg-[#E5B869] text-[#111412] font-semibold shadow-sm'
                : 'text-[#CFCBC0] hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Recoger</span>
          </button>
          <button
            type="button"
            onClick={() => setModality('restaurante')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              modality === 'restaurante'
                ? 'bg-[#E5B869] text-[#111412] font-semibold shadow-sm'
                : 'text-[#CFCBC0] hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>En Mesa</span>
          </button>
        </div>

        {/* Actions: Admin & Cart & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Admin Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl bg-[#1A211D] hover:bg-[#252E28] text-[#CFCBC0] hover:text-[#E5B869] border border-white/10 transition-colors"
            title="Panel de Administración"
            id="btn-nav-admin"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-2.5 px-4 text-xs shadow-md shadow-[#E5B869]/15 transition-all active:scale-95"
            id="btn-nav-cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Mi Pedido</span>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#111412] text-[#E5B869] text-[11px] font-bold">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#1A211D] text-[#CFCBC0] hover:text-white border border-white/10"
            id="btn-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161D18] border-b border-white/10 p-5 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium text-[#F3EFE6]">
            <button
              type="button"
              onClick={() => handleNavClick('hero')}
              className="text-left py-2 border-b border-white/5"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('menu')}
              className="text-left py-2 border-b border-white/5"
            >
              Fusion Menu
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('promotions')}
              className="text-left py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Promociones Especiales</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#E89DA8]/20 text-[#E89DA8]">
                20% OFF
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('location')}
              className="text-left py-2 border-b border-white/5"
            >
              Ubicación y Horarios
            </button>
          </div>

          {/* Mobile Modality Toggle */}
          <div className="pt-2">
            <p className="text-xs text-[#CFCBC0]/70 mb-2">Modalidad de tu pedido:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setModality('domicilio')}
                className={`py-2 rounded-xl text-center font-medium border ${
                  modality === 'domicilio'
                    ? 'bg-[#E5B869] text-[#111412] border-[#E5B869]'
                    : 'bg-[#121614] text-[#CFCBC0] border-white/10'
                }`}
              >
                Domicilio
              </button>
              <button
                type="button"
                onClick={() => setModality('recoger')}
                className={`py-2 rounded-xl text-center font-medium border ${
                  modality === 'recoger'
                    ? 'bg-[#E5B869] text-[#111412] border-[#E5B869]'
                    : 'bg-[#121614] text-[#CFCBC0] border-white/10'
                }`}
              >
                Recoger
              </button>
              <button
                type="button"
                onClick={() => setModality('restaurante')}
                className={`py-2 rounded-xl text-center font-medium border ${
                  modality === 'restaurante'
                    ? 'bg-[#E5B869] text-[#111412] border-[#E5B869]'
                    : 'bg-[#121614] text-[#CFCBC0] border-white/10'
                }`}
              >
                En Mesa
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
