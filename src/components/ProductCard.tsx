import React from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, SlidersHorizontal, Info, Eye } from 'lucide-react';
import { Product } from '../types';
import { AllergenBadge } from './AllergenBadge';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  onCustomize,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl bg-gradient-to-b from-[#191D1A] to-[#121513] gold-border hover:gold-border-glow overflow-hidden transition-all duration-300 shadow-lg shadow-black/50"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Area with Hover Zoom & Details trigger */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer bg-[#0D0F0E]"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-108 group-hover:brightness-110"
          loading="lazy"
        />

        {/* Ambient dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121513] via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges: Prep Time & Category */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-[#E5B869] border border-[#E5B869]/30 shadow">
            <Clock className="w-3 h-3 text-[#E5B869]" />
            <span>{product.prepTimeMinutes} min</span>
          </span>

          {!product.allergensConfirmed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-amber-200 border border-amber-500/40">
              Allergens to be confirmed
            </span>
          )}
        </div>

        {/* Hover Action Banner: "View dish details" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1A211D]/90 border border-[#E5B869] px-4 py-2 text-xs font-semibold text-[#F3EFE6] shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#E5B869]" />
            View dish details
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-display font-semibold text-lg text-[#F3EFE6] group-hover:text-[#E5B869] transition-colors line-clamp-1 cursor-pointer"
            onClick={() => onOpenDetails(product)}
            title={product.name}
          >
            {product.name}
          </h3>
          <span className="font-display font-bold text-lg text-[#E5B869] whitespace-nowrap">
            ${product.price.toLocaleString('es-CO')} <span className="text-[11px] font-sans font-normal text-[#CFCBC0]/70">COP</span>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#CFCBC0]/90 leading-relaxed line-clamp-2 mb-3 min-h-[34px]">
          {product.description}
        </p>

        {/* Ingredients preview */}
        <div className="mb-3 text-[11px] text-[#A6A298] flex items-center gap-1 line-clamp-1">
          <span className="text-[#8ED09E] font-medium">Ingredients:</span>
          <span>{product.ingredients.slice(0, 3).join(', ')}{product.ingredients.length > 3 ? '...' : ''}</span>
        </div>

        {/* Allergens tags */}
        <div className="mt-auto pt-2 border-t border-white/5 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.allergens.length > 0 ? (
              product.allergens.map((alg) => (
                <AllergenBadge key={alg} allergen={alg} size="sm" />
              ))
            ) : (
              <span className="text-[10px] text-[#8ED09E]/80 font-medium">Free of common allergens</span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add & Customize */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            type="button"
            onClick={() => onCustomize(product)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#202722] hover:bg-[#2A342E] text-[#E8E5DD] hover:text-[#E5B869] border border-white/10 hover:border-[#E5B869]/40 py-2 px-3 text-xs font-medium transition-all active:scale-95"
            title="Customize sauce, remove or add ingredients"
            id={`btn-customize-${product.id}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-semibold py-2 px-3 text-xs shadow-md shadow-[#E5B869]/15 transition-all hover:shadow-[#E5B869]/30 active:scale-95"
            id={`btn-add-${product.id}`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
