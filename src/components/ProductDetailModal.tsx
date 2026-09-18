import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Plus, Minus, Check, AlertCircle, Sparkles, ChefHat } from 'lucide-react';
import { Product, ProductCustomizationOption, CartCustomization } from '../types';
import { AllergenBadge } from './AllergenBadge';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customization: CartCustomization) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!product || !isOpen) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSauce, setSelectedSauce] = useState<string>(
    product.availableSauces.length > 0 ? product.availableSauces[0] : 'Salsa de la casa'
  );
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ProductCustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Handle sauce toggle
  const handleSauceChange = (sauce: string) => {
    setSelectedSauce(sauce);
  };

  // Toggle ingredient removal
  const toggleRemoveIngredient = (ing: string) => {
    if (removedIngredients.includes(ing)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ing));
    } else {
      setRemovedIngredients([...removedIngredients, ing]);
    }
  };

  // Toggle extras
  const toggleExtra = (extra: ProductCustomizationOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  // Calculate unit price with extras
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.priceExtra, 0);
  const unitPrice = product.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(product, quantity, {
      selectedSauce,
      removedIngredients,
      addedExtras: selectedExtras,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#161B18] gold-border-glow overflow-hidden shadow-2xl z-10"
          id="product-detail-modal"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white p-2 backdrop-blur-md border border-white/10 transition-colors"
            id="btn-close-modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1">
            {/* Header Image */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B18] via-transparent to-black/30" />

              {/* Prep time badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#E5B869] border border-[#E5B869]/30">
                  <Clock className="w-3.5 h-3.5 text-[#E5B869]" />
                  Estimated time: {product.prepTimeMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F7A4D]/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#8ED09E] border border-[#8ED09E]/30">
                  <ChefHat className="w-3.5 h-3.5" />
                  Asia + Colombia Fusion
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F3EFE6]">
                    {product.name}
                  </h2>
                  <div className="text-right">
                    <span className="font-display font-bold text-2xl text-[#E5B869]">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                    <span className="block text-[11px] text-[#CFCBC0]/70 font-sans">COP</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#CFCBC0] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Ingredients & Allergens info */}
              <div className="rounded-2xl bg-[#111412]/70 p-4 border border-white/5 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5B869] mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Dish Ingredients
                  </h4>
                  <p className="text-xs text-[#E8E5DD]/90 leading-normal">
                    {product.ingredients.join(' • ')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A5C4D4] mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Allergen Information
                  </h4>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {product.allergens.length > 0 ? (
                      product.allergens.map((alg) => (
                        <AllergenBadge key={alg} allergen={alg} size="md" />
                      ))
                    ) : (
                      <span className="text-xs text-[#8ED09E]">No common allergens recorded</span>
                    )}

                    {!product.allergensConfirmed && (
                      <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                        *Allergens pending kitchen verification
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customization 1: Sauces */}
              {product.availableSauces.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#F3EFE6]">
                      Choose your sauce or dressing:
                    </label>
                    <span className="text-xs text-[#8ED09E] font-medium">Included</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.availableSauces.map((sauce) => (
                      <button
                        key={sauce}
                        type="button"
                        onClick={() => handleSauceChange(sauce)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          selectedSauce === sauce
                            ? 'bg-[#E5B869]/15 border-[#E5B869] text-[#F3EFE6] shadow-sm'
                            : 'bg-[#191F1B] border-white/5 text-[#CFCBC0] hover:border-white/20'
                        }`}
                      >
                        <span className="font-medium">{sauce}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedSauce === sauce
                              ? 'border-[#E5B869] bg-[#E5B869]'
                              : 'border-white/30'
                          }`}
                        >
                          {selectedSauce === sauce && <Check className="w-3 h-3 text-[#111412] stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization 2: Remove ingredients */}
              {product.removableIngredients.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[#F3EFE6] block">
                    Would you like to remove any ingredients?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.removableIngredients.map((ing) => {
                      const isRemoved = removedIngredients.includes(ing);
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() => toggleRemoveIngredient(ing)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isRemoved
                              ? 'bg-red-950/40 border-red-500/50 text-red-200 line-through'
                              : 'bg-[#191F1B] border-white/10 text-[#CFCBC0] hover:border-white/30'
                          }`}
                        >
                          {isRemoved ? `Without ${ing}` : `Remove ${ing}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customization 3: Extra additions with cost */}
              {product.extraOptions.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#F3EFE6]">
                      Add-ons & Extras:
                    </label>
                    <span className="text-xs text-[#E5B869]">Additional cost</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.extraOptions.map((extra) => {
                      const isSelected = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-[#E5B869]/15 border-[#E5B869] text-[#F3EFE6]'
                              : 'bg-[#191F1B] border-white/5 text-[#CFCBC0] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{extra.name}</p>
                            <p className="text-[11px] text-[#E5B869] font-bold">
                              +${extra.priceExtra.toLocaleString('es-CO')} COP
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#E5B869] bg-[#E5B869]'
                                : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#111412] stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Observations */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#F3EFE6] block">
                  Special instructions for the kitchen:
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="E.g., Pack sauce separately, mild spicy, extra napkins..."
                  rows={2}
                  className="w-full rounded-xl bg-[#111412] border border-white/10 p-3 text-xs text-[#F3EFE6] placeholder-[#A6A298]/50 focus:border-[#E5B869] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer: Quantity & Add to Cart */}
          <div className="p-4 sm:p-6 bg-[#121614] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quantity control */}
            <div className="flex items-center gap-3 bg-[#191F1B] rounded-xl p-1.5 border border-white/10">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#242C27] hover:bg-[#2F3A33] text-white transition-colors"
                id="btn-decrease-modal-qty"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-display font-bold text-sm text-[#F3EFE6]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#242C27] hover:bg-[#2F3A33] text-white transition-colors"
                id="btn-increase-modal-qty"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total & Submit */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-[#CFCBC0]/70 block">Total:</span>
                <span className="font-display font-bold text-xl text-[#E5B869]">
                  ${totalPrice.toLocaleString('es-CO')} <span className="text-xs font-sans">COP</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-semibold py-3 px-6 text-sm shadow-lg shadow-[#E5B869]/20 transition-all active:scale-98"
                id="btn-modal-add-to-cart"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Order • ${totalPrice.toLocaleString('es-CO')} COP</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
