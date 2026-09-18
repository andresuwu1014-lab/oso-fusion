import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, OrderModality } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  modality: OrderModality;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  deliveryFee: number;
  discountAmount: number;
  appliedPromoName?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  modality,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  deliveryFee,
  discountAmount,
  appliedPromoName,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const effectiveDeliveryFee = modality === 'domicilio' && items.length > 0 ? deliveryFee : 0;
  const total = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#141815] gold-border border-r-0 flex flex-col shadow-2xl"
              id="cart-drawer-panel"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181E1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#E5B869]/15 border border-[#E5B869]/30 text-[#E5B869]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#F3EFE6]">
                      Tu Pedido Fusión
                    </h2>
                    <p className="text-xs text-[#CFCBC0]/80">
                      {totalItemCount} {totalItemCount === 1 ? 'producto' : 'productos'} seleccionados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[11px] text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
                      title="Vaciar todo el carrito"
                      id="btn-clear-cart"
                    >
                      Vaciar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
                    id="btn-close-cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#CFCBC0]/70">
                    <div className="w-16 h-16 rounded-full bg-[#1F2621] flex items-center justify-center text-[#E5B869] border border-[#E5B869]/20">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <div>
                      <p className="font-display font-medium text-lg text-[#F3EFE6]">El carrito está vacío</p>
                      <p className="text-xs mt-1 max-w-xs">
                        Descubre nuestros platos fusión con ingredientes de Colombia y Asia para comenzar tu orden.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-2 text-xs font-semibold text-[#E5B869] hover:underline"
                    >
                      Ver menú de platos →
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="rounded-2xl bg-[#1A211D] border border-white/5 p-3.5 flex gap-3.5 items-start relative group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-semibold text-sm text-[#F3EFE6] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-[#CFCBC0]/40 hover:text-red-400 p-1 transition-colors"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Customization Badges */}
                        <div className="mt-1 space-y-0.5 text-[11px] text-[#CFCBC0]/90">
                          {item.customization.selectedSauce && (
                            <p className="text-[#8ED09E]">
                              • Salsa: {item.customization.selectedSauce}
                            </p>
                          )}
                          {item.customization.removedIngredients.length > 0 && (
                            <p className="text-red-300">
                              • Sin: {item.customization.removedIngredients.join(', ')}
                            </p>
                          )}
                          {item.customization.addedExtras.length > 0 && (
                            <p className="text-[#E5B869]">
                              • Extras: {item.customization.addedExtras.map((e) => e.name).join(', ')}
                            </p>
                          )}
                          {item.customization.specialInstructions && (
                            <p className="italic text-[#A5C4D4] text-[10px]">
                              "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2 bg-[#121614] rounded-lg p-1 border border-white/10">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-[#222A24] hover:bg-[#2B352E] text-white text-xs transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-[#F3EFE6]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-[#222A24] hover:bg-[#2B352E] text-white text-xs transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-display font-bold text-sm text-[#E5B869]">
                            ${item.subtotal.toLocaleString('es-CO')} <span className="text-[10px] font-sans font-normal text-[#CFCBC0]/60">COP</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Summary */}
              {items.length > 0 && (
                <div className="p-5 bg-[#171D19] border-t border-white/10 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#CFCBC0]">
                      <span>Subtotal platos:</span>
                      <span>${subtotal.toLocaleString('es-CO')} COP</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#8ED09E] font-medium items-center">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#8ED09E]" />
                          Descuento ({appliedPromoName || 'Promoción'}):
                        </span>
                        <span>-${discountAmount.toLocaleString('es-CO')} COP</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#CFCBC0]">
                      <span>
                        Modalidad:{' '}
                        <span className="text-[#E5B869] font-medium capitalize">
                          {modality === 'domicilio'
                            ? 'Domicilio en Ibagué'
                            : modality === 'recoger'
                            ? 'Recoger en restaurante'
                            : 'Comer en el restaurante'}
                        </span>
                      </span>
                      <span>
                        {modality === 'domicilio'
                          ? `$${effectiveDeliveryFee.toLocaleString('es-CO')} COP`
                          : 'Sin costo ($0 COP)'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                      <span className="font-display font-semibold text-sm text-[#F3EFE6]">
                        Total orden:
                      </span>
                      <span className="font-display font-bold text-xl text-[#E5B869]">
                        ${total.toLocaleString('es-CO')} <span className="text-xs font-sans font-normal text-[#CFCBC0]/70">COP</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onProceedToCheckout();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-3 px-4 text-sm shadow-xl shadow-[#E5B869]/20 transition-all active:scale-98"
                    id="btn-proceed-checkout"
                  >
                    <span>Confirmar y Enviar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
