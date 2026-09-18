import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Store, 
  UtensilsCrossed, 
  CreditCard, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Phone,
  User,
  Sparkles
} from 'lucide-react';
import { 
  CartItem, 
  OrderModality, 
  PaymentMethod, 
  OrderCustomerInfo, 
  Order, 
  RestaurantConfig,
  Promotion
} from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  modality: OrderModality;
  setModality: (m: OrderModality) => void;
  config: RestaurantConfig;
  promotions: Promotion[];
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  modality,
  setModality,
  config,
  promotions,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Modalidad y Datos, 2: Pago y Revisión, 3: Confirmación Final
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reference, setReference] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Nequi');
  const [customerNotes, setCustomerNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Check promotions
  let discountAmount = 0;
  let appliedPromo: Promotion | null = null;
  const activePromoWednesday = promotions.find((p) => p.type === 'wednesday' && p.active);
  const currentDay = new Date().getDay(); // 3 = Miércoles

  if (activePromoWednesday && currentDay === 3) {
    const mainDishesSubtotal = items
      .filter((i) => i.product.category === 'principales')
      .reduce((sum, i) => sum + i.subtotal, 0);
    if (mainDishesSubtotal > 0) {
      discountAmount = Math.round(mainDishesSubtotal * 0.2);
      appliedPromo = activePromoWednesday;
    }
  }

  const effectiveDeliveryFee = modality === 'domicilio' ? config.baseDeliveryFee : 0;
  const total = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);

  // Estimated preparation & delivery time
  const estimatedTimeMinutes =
    modality === 'domicilio'
      ? config.basePrepTimeMinutes + config.baseDeliveryTimeMinutes
      : config.basePrepTimeMinutes;

  const validateStep1 = () => {
    if (!customerName.trim()) {
      setFormError('Por favor ingresa tu nombre completo.');
      return false;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 7) {
      setFormError('Por favor ingresa un número de teléfono válido para coordinar tu pedido.');
      return false;
    }
    if (modality === 'domicilio') {
      if (!address.trim()) {
        setFormError('Por favor ingresa tu dirección de entrega en Ibagué.');
        return false;
      }
      if (!neighborhood.trim()) {
        setFormError('Por favor indica el barrio o sector de Ibagué.');
        return false;
      }
    }
    setFormError('');
    return true;
  };

  const handleCreateOrder = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    setFormError('');

    const customer: OrderCustomerInfo = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      address: modality === 'domicilio' ? address.trim() : undefined,
      neighborhood: modality === 'domicilio' ? neighborhood.trim() : undefined,
      reference: modality === 'domicilio' ? reference.trim() : undefined,
      tableNumber: modality === 'restaurante' ? tableNumber : undefined,
      paymentMethod,
      notes: customerNotes.trim() ? customerNotes.trim() : undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modality,
          customer,
          items,
          subtotal,
          discountAmount,
          appliedPromotionName: appliedPromo ? appliedPromo.name : undefined,
          deliveryFee: effectiveDeliveryFee,
          total,
          estimatedTimeMin: estimatedTimeMinutes,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo guardar la orden');
      }

      const newOrder: Order = await res.json();
      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
      setStep(3);
    } catch (err) {
      console.error('Error creating order:', err);
      // Fallback local order creation if backend network glitches
      const fallbackOrder: Order = {
        id: `OF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        modality,
        customer,
        items,
        subtotal,
        discountAmount,
        appliedPromotionName: appliedPromo ? appliedPromo.name : undefined,
        deliveryFee: effectiveDeliveryFee,
        total,
        estimatedTimeMin: estimatedTimeMinutes,
        status: 'Pedido recibido',
        statusUpdates: [{ status: 'Pedido recibido', timestamp: new Date().toISOString() }],
      };
      setCreatedOrder(fallbackOrder);
      onOrderCreated(fallbackOrder);
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate structured WhatsApp message
  const handleOpenWhatsApp = (orderToUse?: Order) => {
    const ord = orderToUse || createdOrder;
    if (!ord) return;

    const itemsSummary = ord.items
      .map((item) => {
        let details = `*${item.quantity}x ${item.product.name}* ($${item.subtotal.toLocaleString('es-CO')} COP)`;
        if (item.customization.selectedSauce) details += `\n   - Salsa: ${item.customization.selectedSauce}`;
        if (item.customization.removedIngredients.length > 0)
          details += `\n   - Sin: ${item.customization.removedIngredients.join(', ')}`;
        if (item.customization.addedExtras.length > 0)
          details += `\n   - Extras: ${item.customization.addedExtras.map((e) => e.name).join(', ')}`;
        if (item.customization.specialInstructions)
          details += `\n   - Obs: ${item.customization.specialInstructions}`;
        return details;
      })
      .join('\n\n');

    let locationDetails = '';
    if (ord.modality === 'domicilio') {
      locationDetails = `📍 *Dirección:* ${ord.customer.address}\n🏘️ *Barrio:* ${ord.customer.neighborhood || 'N/A'}${
        ord.customer.reference ? `\n📌 *Referencia:* ${ord.customer.reference}` : ''
      }`;
    } else if (ord.modality === 'recoger') {
      locationDetails = `🥡 *Para recoger en:* Cra. 6 con Calle 50, Piedra Pintada, Ibagué`;
    } else {
      locationDetails = `🪑 *Para comer en restaurante:* Mesa #${ord.customer.tableNumber || '1'}`;
    }

    const message = `Hola, Oso Fusión. Quiero realizar el siguiente pedido:

📋 *Número de pedido:* ${ord.id}
👤 *Cliente:* ${ord.customer.name}
📱 *Teléfono:* ${ord.customer.phone}
🛵 *Modalidad:* ${ord.modality.toUpperCase()}
${locationDetails}

🛒 *PRODUCTOS:*
${itemsSummary}

---------------------------
💵 *Subtotal:* $${ord.subtotal.toLocaleString('es-CO')} COP
${ord.discountAmount > 0 ? `🎁 *Descuento:* -$${ord.discountAmount.toLocaleString('es-CO')} COP\n` : ''}${
      ord.deliveryFee > 0 ? `🛵 *Domicilio:* $${ord.deliveryFee.toLocaleString('es-CO')} COP\n` : ''
    }💰 *TOTAL:* $${ord.total.toLocaleString('es-CO')} COP
💳 *Método de pago:* ${ord.customer.paymentMethod}
${ord.customer.notes ? `📝 *Observaciones:* ${ord.customer.notes}\n` : ''}
⏱️ *Tiempo estimado:* ${ord.estimatedTimeMin} minutos aprox.

_Quedo a la espera de la confirmación de recepción y preparación por parte del restaurante._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573227688168&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 3 ? onClose : undefined}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#151A17] gold-border-glow shadow-2xl z-10 overflow-hidden"
        id="checkout-modal-container"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#1A211D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#E5B869]/20 border border-[#E5B869]/40 flex items-center justify-center text-[#E5B869] font-bold">
              {step === 3 ? '✓' : step}
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F3EFE6]">
                {step === 1 && 'Modalidad y Datos de Entrega'}
                {step === 2 && 'Método de Pago y Revisión'}
                {step === 3 && '¡Pedido Generado con Éxito!'}
              </h3>
              <p className="text-xs text-[#CFCBC0]/75">
                {step < 3 ? `Paso ${step} de 2 • Oso Fusión Ibagué` : 'Orden lista para enviar a cocina'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: Modalidad y Datos */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Order Modality Picker */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#E5B869] block mb-2.5">
                  ¿Cómo deseas recibir tu pedido?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setModality('domicilio')}
                    className={`p-3.5 rounded-2xl border text-left flex sm:flex-col gap-3 items-center sm:items-start transition-all ${
                      modality === 'domicilio'
                        ? 'bg-[#E5B869]/15 border-[#E5B869] shadow-md shadow-[#E5B869]/10'
                        : 'bg-[#1A211D] border-white/5 text-[#CFCBC0] hover:border-white/20'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-black/40 text-[#E5B869]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#F3EFE6]">Domicilio</p>
                      <p className="text-[11px] text-[#CFCBC0]/70 mt-0.5">En toda Ibagué</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModality('recoger')}
                    className={`p-3.5 rounded-2xl border text-left flex sm:flex-col gap-3 items-center sm:items-start transition-all ${
                      modality === 'recoger'
                        ? 'bg-[#E5B869]/15 border-[#E5B869] shadow-md shadow-[#E5B869]/10'
                        : 'bg-[#1A211D] border-white/5 text-[#CFCBC0] hover:border-white/20'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-black/40 text-[#E5B869]">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#F3EFE6]">Recoger</p>
                      <p className="text-[11px] text-[#CFCBC0]/70 mt-0.5">En el restaurante</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModality('restaurante')}
                    className={`p-3.5 rounded-2xl border text-left flex sm:flex-col gap-3 items-center sm:items-start transition-all ${
                      modality === 'restaurante'
                        ? 'bg-[#E5B869]/15 border-[#E5B869] shadow-md shadow-[#E5B869]/10'
                        : 'bg-[#1A211D] border-white/5 text-[#CFCBC0] hover:border-white/20'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-black/40 text-[#E5B869]">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#F3EFE6]">En Mesa</p>
                      <p className="text-[11px] text-[#CFCBC0]/70 mt-0.5">Comer acá</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                      Nombre y Apellido *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej: Laura Gómez"
                        className="w-full rounded-xl bg-[#111412] border border-white/10 px-3.5 py-2.5 pl-9 text-xs text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none transition-colors"
                        required
                      />
                      <User className="w-4 h-4 text-[#CFCBC0]/50 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ej: 3101234567"
                        className="w-full rounded-xl bg-[#111412] border border-white/10 px-3.5 py-2.5 pl-9 text-xs text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none transition-colors"
                        required
                      />
                      <Phone className="w-4 h-4 text-[#CFCBC0]/50 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Specific Fields according to modality */}
                {modality === 'domicilio' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-2 border-t border-white/5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                          Dirección de Entrega *
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Ej: Calle 50 # 5-20 Apto 302"
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                          Barrio o Sector en Ibagué *
                        </label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Ej: Piedra Pintada, El Vergel, Cádiz..."
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                        Punto de referencia o indicaciones
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ej: Al lado del supermercado, reja negra, timbre 302"
                        className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {modality === 'recoger' && (
                  <div className="p-4 rounded-2xl bg-[#1B231E] border border-[#3F7A4D]/40 space-y-1.5">
                    <p className="text-xs font-semibold text-[#8ED09E] flex items-center gap-1.5">
                      <Store className="w-4 h-4" />
                      Punto de recogida:
                    </p>
                    <p className="text-xs text-[#F3EFE6] font-medium">
                      Cra. 6 con Calle 50, Piedra Pintada, Ibagué, Tolima.
                    </p>
                    <p className="text-[11px] text-[#CFCBC0]/70">
                      Te avisaremos por WhatsApp cuando tu orden esté empacada y lista.
                    </p>
                  </div>
                )}

                {modality === 'restaurante' && (
                  <div className="p-4 rounded-2xl bg-[#1B231E] border border-[#E5B869]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#F3EFE6]">
                        Selecciona tu número de mesa:
                      </label>
                      <span className="text-xs font-bold text-[#E5B869]">Mesa {tableNumber}</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setTableNumber(String(n))}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${
                            tableNumber === String(n)
                              ? 'bg-[#E5B869] text-[#111412] shadow-sm'
                              : 'bg-[#121614] border border-white/10 text-[#CFCBC0] hover:border-white/30'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Pago y Confirmación */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#E5B869] block mb-2.5">
                  Método de pago
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      'Nequi',
                      'Daviplata',
                      'Efectivo',
                      'Tarjeta contraentrega',
                      'Transferencia Bancolombia',
                    ] as PaymentMethod[]
                  ).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                        paymentMethod === pm
                          ? 'bg-[#E5B869]/15 border-[#E5B869] text-[#F3EFE6] font-semibold'
                          : 'bg-[#1A211D] border-white/5 text-[#CFCBC0] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-[#E5B869]" />
                        <span>{pm}</span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border ${
                          paymentMethod === pm ? 'bg-[#E5B869] border-[#E5B869]' : 'border-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs text-[#CFCBC0] font-medium block mb-1">
                  Observaciones generales para el pedido (opcional)
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ej: Cambio para billete de $50.000, servilletas extra, llamar al llegar..."
                  rows={2}
                  className="w-full rounded-xl bg-[#111412] border border-white/10 p-3 text-xs text-[#F3EFE6] placeholder-[#A6A298]/50 focus:border-[#E5B869] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Order summary box */}
              <div className="rounded-2xl bg-[#121614] p-4 border border-white/10 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6] pb-2 border-b border-white/5">
                  Resumen de la orden
                </h4>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between items-start text-[#CFCBC0]">
                      <div>
                        <span className="font-semibold text-[#F3EFE6]">{item.quantity}x</span> {item.product.name}
                        {item.customization.addedExtras.length > 0 && (
                          <span className="block text-[10px] text-[#E5B869]">
                            + {item.customization.addedExtras.map((e) => e.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-[#F3EFE6] whitespace-nowrap">
                        ${item.subtotal.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-[#CFCBC0]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString('es-CO')} COP</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#8ED09E]">
                      <span>Descuento aplicado:</span>
                      <span>-${discountAmount.toLocaleString('es-CO')} COP</span>
                    </div>
                  )}
                  {effectiveDeliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Costo de Domicilio:</span>
                      <span>${effectiveDeliveryFee.toLocaleString('es-CO')} COP</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-[#E5B869]">
                    <span>Total a Pagar:</span>
                    <span>${total.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                {/* Delivery Time Estimation */}
                <div className="p-3 rounded-xl bg-[#1B231E] border border-[#3F7A4D]/30 flex items-center gap-2.5 text-xs text-[#8ED09E]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    Tu pedido estará listo en aproximadamente <strong>{estimatedTimeMinutes} - {estimatedTimeMinutes + 15} minutos</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmación Final y Pantalla de Celebración */}
          {step === 3 && createdOrder && (
            <div className="text-center py-4 space-y-6">
              {/* Celebrating Bear Mascot Animation */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-b from-[#253028] to-[#121614] gold-border-glow p-4 shadow-xl flex items-center justify-center overflow-hidden"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10"
                  >
                    <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
                      {/* Ears */}
                      <circle cx="25" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2.5" />
                      <circle cx="75" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2.5" />
                      {/* Head */}
                      <circle cx="50" cy="54" r="34" fill="#181C19" stroke="#E5B869" strokeWidth="2.5" />
                      {/* Spectacles */}
                      <path d="M 28 46 C 26 38, 44 38, 45 47 C 46 54, 30 55, 28 46 Z" stroke="#E5B869" strokeWidth="3" />
                      <path d="M 72 46 C 74 38, 56 38, 55 47 C 54 54, 70 55, 72 46 Z" stroke="#E5B869" strokeWidth="3" />
                      <path d="M 45 47 Q 50 44 55 47" stroke="#E5B869" strokeWidth="2" />
                      {/* Happy Wink Eyes */}
                      <path d="M 33 46 Q 37 42 41 46" stroke="#F3EFE6" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 59 46 Q 63 42 67 46" stroke="#F3EFE6" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Snout & Smiling Mouth */}
                      <ellipse cx="50" cy="61" rx="12" ry="8" fill="#262D28" />
                      <path d="M 47 58 Q 50 56 53 58 Q 50 62 47 58 Z" fill="#E5B869" />
                      <path d="M 46 64 Q 50 69 54 64" stroke="#F3EFE6" strokeWidth="2" strokeLinecap="round" />
                      {/* Ocobo flower on head */}
                      <circle cx="74" cy="22" r="4.5" fill="#E89DA8" />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3F7A4D]/20 border border-[#3F7A4D]/50 text-xs font-semibold text-[#8ED09E] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Orden registrada en el sistema
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F3EFE6]">
                  ¡Gracias por tu compra! 🐻
                </h3>
                <p className="text-xs text-[#CFCBC0] mt-1 max-w-md mx-auto">
                  Hemos generado tu orden oficial. Para que la cocina comience la preparación inmediatamente, por favor confírmala por WhatsApp.
                </p>
              </div>

              {/* Order Card Details */}
              <div className="p-4 rounded-2xl bg-[#111412] border border-[#E5B869]/40 text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#CFCBC0]/70 block">
                      Número de Pedido
                    </span>
                    <span className="font-display font-bold text-lg text-[#E5B869]">
                      {createdOrder.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#26312A] text-[#8ED09E] border border-[#8ED09E]/30">
                    {createdOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#CFCBC0]">
                  <div>
                    <span className="text-[#CFCBC0]/60 block text-[11px]">Cliente:</span>
                    <span className="font-medium text-[#F3EFE6]">{createdOrder.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-[#CFCBC0]/60 block text-[11px]">Total:</span>
                    <span className="font-bold text-[#E5B869]">
                      ${createdOrder.total.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div>
                    <span className="text-[#CFCBC0]/60 block text-[11px]">Modalidad:</span>
                    <span className="font-medium capitalize text-[#F3EFE6]">{createdOrder.modality}</span>
                  </div>
                  <div>
                    <span className="text-[#CFCBC0]/60 block text-[11px]">Tiempo estimado:</span>
                    <span className="font-medium text-[#8ED09E]">~{createdOrder.estimatedTimeMin} min</span>
                  </div>
                </div>

                {/* Important notice */}
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                  ⚠️ <strong>Nota:</strong> El restaurante confirmará la recepción oficial del pedido una vez enviado el mensaje por WhatsApp.
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-bold py-3.5 px-6 text-sm shadow-xl shadow-[#25D366]/20 transition-all transform hover:-translate-y-0.5 active:scale-98"
                id="btn-send-order-whatsapp"
              >
                <Send className="w-4 h-4" />
                <span>Enviar pedido por WhatsApp (3227688168)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#171D19] border-t border-white/10 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#CFCBC0] hover:text-white transition-colors"
              >
                Volver al carrito
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-2.5 px-5 text-xs shadow-md shadow-[#E5B869]/20 transition-all active:scale-95"
              >
                <span>Continuar a Pago</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#CFCBC0] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a datos</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCreateOrder}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-2.5 px-6 text-xs shadow-lg shadow-[#E5B869]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Procesando orden...' : 'Confirmar Pedido'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 3 && (
            <div className="w-full flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#E5B869] hover:underline font-semibold"
              >
                ← Volver al menú
              </button>
              <span className="text-[11px] text-[#CFCBC0]/60">
                Piedra Pintada, Ibagué • Cra. 6 con Cll 50
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
