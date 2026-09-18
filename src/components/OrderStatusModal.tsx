import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Clock, Bike, ChefHat, Check, Send } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderStatusModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'Pedido recibido', label: 'Pedido recibido', icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: 'En preparación', label: 'En cocina', icon: <ChefHat className="w-4 h-4" /> },
  { status: 'Listo', label: 'Listo para entrega', icon: <Check className="w-4 h-4" /> },
  { status: 'En camino', label: 'En camino / Mesa', icon: <Bike className="w-4 h-4" /> },
  { status: 'Entregado', label: 'Entregado', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ order, isOpen, onClose }) => {
  if (!order || !isOpen) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Oso Fusión, consulto sobre el estado de mi pedido ${order.id} a nombre de ${order.customer.name}.`
    );
    window.open(`https://api.whatsapp.com/send?phone=573227688168&text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#161B18] gold-border-glow shadow-2xl p-6 sm:p-8 z-10 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] text-[#CFCBC0]/70 uppercase tracking-wider block">
                Seguimiento de orden
              </span>
              <h3 className="font-display font-bold text-xl text-[#F3EFE6]">
                {order.id}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper tracker */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#E5B869] uppercase tracking-wider">
              Estado en tiempo real
            </h4>
            <div className="relative pl-6 space-y-6 border-l-2 border-white/10">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.status} className="relative">
                    {/* Circle badge */}
                    <div
                      className={`absolute -left-[31px] -top-1 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        isCompleted
                          ? 'bg-[#E5B869] border-[#E5B869] text-[#111412] shadow-[0_0_10px_rgba(229,184,105,0.4)]'
                          : 'bg-[#19211C] border-white/20 text-white/40'
                      }`}
                    >
                      {step.icon}
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-[#E5B869]'
                            : isCompleted
                            ? 'text-[#F3EFE6]'
                            : 'text-[#CFCBC0]/40'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-[#8ED09E] mt-0.5">
                          En proceso actual • Estimado: ~{order.estimatedTimeMin} min
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Preview */}
          <div className="rounded-2xl bg-[#111412] p-4 border border-white/5 space-y-2 text-xs text-[#CFCBC0]">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span className="font-semibold text-[#F3EFE6]">{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Modalidad:</span>
              <span className="font-semibold capitalize text-[#F3EFE6]">{order.modality}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-[#E5B869]">${order.total.toLocaleString('es-CO')} COP</span>
            </div>
          </div>

          {/* WhatsApp communication */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/30 font-semibold py-2.5 px-4 text-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Consultar novedades por WhatsApp (3227688168)</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
