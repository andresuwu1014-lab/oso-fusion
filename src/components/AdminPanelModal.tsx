import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Unlock, 
  ShoppingBag, 
  Tag, 
  Utensils, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  AlertCircle,
  Save,
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import { 
  Product, 
  Promotion, 
  Order, 
  RestaurantConfig, 
  OrderStatus, 
  AllergenType,
  ProductCategory
} from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  promotions: Promotion[];
  orders: Order[];
  config: RestaurantConfig;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdatePromotion: (promotion: Promotion) => void;
  onAddPromotion: (promotion: Promotion) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
}

const ALL_ALLERGENS: AllergenType[] = [
  'Gluten',
  'Soya',
  'Maní',
  'Frutos secos',
  'Lácteos',
  'Huevo',
  'Mariscos',
  'Pescado',
  'Sésamo',
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  promotions,
  orders,
  config,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdatePromotion,
  onAddPromotion,
  onUpdateOrderStatus,
  onUpdateConfig,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'promotions' | 'settings'>('orders');

  // Order filters
  const [orderFilter, setOrderFilter] = useState<string>('todos');

  // Product edit modal inside admin
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // New Promotion form state
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);
  const [newPromoRules, setNewPromoRules] = useState('');

  // Settings form state
  const [tempConfig, setTempConfig] = useState<RestaurantConfig>(config);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Auth handler
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === config.adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Product saving handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingProduct) {
      onAddProduct(editingProduct);
    } else {
      onUpdateProduct(editingProduct);
    }

    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  // Promotion creation handler
  const handleSavePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle.trim()) return;

    const promo: Promotion = {
      id: `promo-${Date.now()}`,
      name: newPromoTitle.trim(),
      description: newPromoDesc.trim(),
      type: 'special',
      discountPercentage: Number(newPromoDiscount),
      rules: newPromoRules.split('\n').filter(Boolean),
      active: true,
      badgeText: `${newPromoDiscount}% OFF`,
    };

    onAddPromotion(promo);
    setIsCreatingPromo(false);
    setNewPromoTitle('');
    setNewPromoDesc('');
    setNewPromoRules('');
  };

  // Settings saving handler
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(tempConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Admin Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#141916] gold-border-glow shadow-2xl z-10 overflow-hidden"
        id="admin-panel-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1A221D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5B869]/15 border border-[#E5B869]/40 flex items-center justify-center text-[#E5B869]">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#F3EFE6]">
                Panel de Administración
              </h2>
              <p className="text-xs text-[#CFCBC0]/70">
                Oso Fusión • Gestión de pedidos, menú, promociones y ajustes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not authenticated view: PIN screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#1F2722] border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F3EFE6]">Acceso Administrativo</h3>
              <p className="text-xs text-[#CFCBC0] mt-1">
                Ingresa el PIN de seguridad del restaurante para acceder a pedidos y configuración (Por defecto: <strong>1234</strong>).
              </p>
            </div>

            <form onSubmit={handleAuth} className="w-full space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Ingresar PIN"
                className="w-full text-center tracking-widest text-lg font-bold rounded-xl bg-[#111412] border border-white/10 p-3 text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 font-medium">
                  PIN incorrecto. Intenta nuevamente.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] hover:from-[#D4AF37] hover:to-[#F4D396] text-[#111412] font-bold py-3 text-xs shadow-md transition-all active:scale-98"
              >
                Ingresar al Sistema
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Views */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-white/10 bg-[#161D18] px-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'orders'
                    ? 'border-[#E5B869] text-[#E5B869] bg-[#E5B869]/5'
                    : 'border-transparent text-[#CFCBC0] hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedidos en Vivo ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'products'
                    ? 'border-[#E5B869] text-[#E5B869] bg-[#E5B869]/5'
                    : 'border-transparent text-[#CFCBC0] hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Gestión de Menú ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('promotions')}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'promotions'
                    ? 'border-[#E5B869] text-[#E5B869] bg-[#E5B869]/5'
                    : 'border-transparent text-[#CFCBC0] hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Promociones ({promotions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'settings'
                    ? 'border-[#E5B869] text-[#E5B869] bg-[#E5B869]/5'
                    : 'border-transparent text-[#CFCBC0] hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Ajustes del Restaurante</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#121614]">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {['todos', 'Pedido recibido', 'En preparación', 'Listo', 'En camino', 'Entregado'].map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setOrderFilter(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${
                              orderFilter === st
                                ? 'bg-[#E5B869] text-[#111412] font-semibold'
                                : 'bg-[#1C231E] text-[#CFCBC0] hover:bg-[#252E28]'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                    <span className="text-xs text-[#CFCBC0]/70">
                      Total: {orders.length} pedidos
                    </span>
                  </div>

                  {/* Orders list */}
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-[#CFCBC0]/60">
                      <p className="font-display text-base">No hay pedidos registrados aún.</p>
                      <p className="text-xs mt-1">Los pedidos creados por los clientes aparecerán aquí en tiempo real.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders
                        .filter((o) => orderFilter === 'todos' || o.status === orderFilter)
                        .map((order) => (
                          <div
                            key={order.id}
                            className="rounded-2xl bg-[#19201B] border border-white/5 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow"
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-display font-bold text-base text-[#E5B869]">
                                  {order.id}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-[#28362D] text-[#8ED09E] border border-[#8ED09E]/30">
                                  {order.modality}
                                </span>
                                <span className="text-xs text-[#CFCBC0]/70">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div className="text-xs text-[#CFCBC0] space-y-0.5">
                                <p>
                                  <strong className="text-[#F3EFE6]">{order.customer.name}</strong> • {order.customer.phone}
                                </p>
                                {order.modality === 'domicilio' && (
                                  <p className="text-[11px] text-[#CFCBC0]/80">
                                    📍 {order.customer.address}, Barrio {order.customer.neighborhood}
                                  </p>
                                )}
                                {order.modality === 'restaurante' && (
                                  <p className="text-[11px] text-[#E5B869]">
                                    🪑 Mesa #{order.customer.tableNumber}
                                  </p>
                                )}
                              </div>

                              {/* Items summary */}
                              <div className="pt-2 border-t border-white/5 text-xs text-[#CFCBC0]">
                                {order.items.map((it) => (
                                  <span key={it.cartItemId} className="mr-3 inline-block">
                                    <strong>{it.quantity}x</strong> {it.product.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Status Changer & Price */}
                            <div className="flex sm:flex-col lg:items-end justify-between items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                              <span className="font-display font-bold text-lg text-[#E5B869]">
                                ${order.total.toLocaleString('es-CO')} <span className="text-xs font-sans font-normal text-[#CFCBC0]/60">COP</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <label className="text-[11px] text-[#CFCBC0]/60 hidden sm:inline">
                                  Estado:
                                </label>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                                  }
                                  className="rounded-xl bg-[#111412] border border-[#E5B869]/40 text-xs font-semibold text-[#F3EFE6] py-1.5 px-3 focus:outline-none"
                                >
                                  <option value="Pedido recibido">Pedido recibido</option>
                                  <option value="En preparación">En preparación</option>
                                  <option value="Listo">Listo</option>
                                  <option value="En camino">En camino</option>
                                  <option value="Entregado">Entregado</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                        Catálogo de Platos
                      </h3>
                      <p className="text-xs text-[#CFCBC0]/70">
                        Edita precios, ingredientes, alérgenos, tiempos de preparación y fotos.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          id: `prod-${Date.now()}`,
                          name: '',
                          category: 'principales',
                          price: 25000,
                          prepTimeMinutes: 20,
                          description: '',
                          image: '/images/hero_oso_fusion_1789763695701.jpg',
                          ingredients: [],
                          allergens: [],
                          allergensConfirmed: false,
                          availableSauces: ['Salsa oriental', 'Salsa de la casa'],
                          removableIngredients: [],
                          extraOptions: [],
                        });
                        setIsCreatingProduct(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] font-bold py-2 px-3 text-xs shadow transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Plato</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="rounded-2xl bg-[#19201B] border border-white/5 p-4 flex gap-3.5 items-start"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-display font-semibold text-sm text-[#F3EFE6] truncate">
                              {prod.name}
                            </h4>
                            <span className="font-display font-bold text-xs text-[#E5B869] whitespace-nowrap">
                              ${prod.price.toLocaleString('es-CO')}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#CFCBC0]/80 line-clamp-1">
                            {prod.description}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-[#CFCBC0]/70 pt-1">
                            <span>⏱️ {prod.prepTimeMinutes} min</span>
                            <span>•</span>
                            <span className="capitalize">{prod.category}</span>
                            <span>•</span>
                            <span className={prod.allergensConfirmed ? 'text-[#8ED09E]' : 'text-amber-400'}>
                              {prod.allergensConfirmed ? 'Alérgenos verificados' : 'Por confirmar'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct({ ...prod });
                                setIsCreatingProduct(false);
                              }}
                              className="flex items-center gap-1 text-xs text-[#E5B869] hover:underline font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <span className="text-white/20">|</span>
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(prod.id)}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROMOTIONS */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                        Promociones y Descuentos
                      </h3>
                      <p className="text-xs text-[#CFCBC0]/70">
                        Activa, desactiva o crea nuevas promociones (Cumpleaños, Grupos, Miércoles Fusión, etc.)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCreatingPromo(!isCreatingPromo)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] font-bold py-2 px-3 text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingPromo ? 'Cancelar' : 'Nueva Promo'}</span>
                    </button>
                  </div>

                  {/* Create promo form */}
                  {isCreatingPromo && (
                    <form onSubmit={handleSavePromotion} className="p-4 rounded-2xl bg-[#1C241F] border border-[#E5B869]/30 space-y-3">
                      <h4 className="text-xs font-bold text-[#E5B869] uppercase">Crear Nueva Promoción</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-[#CFCBC0] block mb-1">Nombre</label>
                          <input
                            type="text"
                            value={newPromoTitle}
                            onChange={(e) => setNewPromoTitle(e.target.value)}
                            placeholder="Ej: Jueves de Cócteles"
                            className="w-full rounded-xl bg-[#111412] border border-white/10 p-2 text-xs text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#CFCBC0] block mb-1">% de Descuento (opcional)</label>
                          <input
                            type="number"
                            value={newPromoDiscount}
                            onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                            className="w-full rounded-xl bg-[#111412] border border-white/10 p-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#CFCBC0] block mb-1">Descripción</label>
                        <textarea
                          value={newPromoDesc}
                          onChange={(e) => setNewPromoDesc(e.target.value)}
                          placeholder="Beneficio que recibe el cliente..."
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2 text-xs text-white resize-none"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#CFCBC0] block mb-1">Reglas (una por línea)</label>
                        <textarea
                          value={newPromoRules}
                          onChange={(e) => setNewPromoRules(e.target.value)}
                          placeholder="Aplica solo para consumo en mesa&#10;No acumulable con otras promos"
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2 text-xs text-white resize-none"
                          rows={2}
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#E5B869] text-[#111412] font-bold text-xs"
                      >
                        Guardar Promoción
                      </button>
                    </form>
                  )}

                  {/* Promotions list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {promotions.map((promo) => (
                      <div
                        key={promo.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          promo.active
                            ? 'bg-[#19201B] border-white/10'
                            : 'bg-[#141815] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-display font-bold text-sm text-[#F3EFE6]">
                            {promo.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5B869]/20 text-[#E5B869]">
                            {promo.badgeText || promo.badge || 'PROMO'}
                          </span>
                        </div>

                        <p className="text-xs text-[#CFCBC0] mb-3">{promo.description}</p>

                        <div className="space-y-1 mb-4 text-[11px] text-[#CFCBC0]/70">
                          {(promo.rules || (promo.conditions ? [promo.conditions] : [])).map((r: string, idx: number) => (
                            <p key={idx}>• {r}</p>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-xs text-[#CFCBC0]/80">
                            Estado: {promo.active ? 'Activa' : 'Inactiva'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdatePromotion({ ...promo, active: !promo.active })
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              promo.active
                                ? 'bg-red-950/50 text-red-300 hover:bg-red-900/50'
                                : 'bg-[#3F7A4D]/50 text-[#8ED09E] hover:bg-[#3F7A4D]'
                            }`}
                          >
                            {promo.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveConfig} className="max-w-xl space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                      Configuración General del Restaurante
                    </h3>
                    <p className="text-xs text-[#CFCBC0]/70">
                      Actualiza la dirección, tarifas de entrega, tiempos y PIN de seguridad.
                    </p>
                  </div>

                  {configSavedToast && (
                    <div className="p-3 rounded-xl bg-[#3F7A4D]/30 border border-[#3F7A4D] text-[#8ED09E] text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Ajustes actualizados correctamente!</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#CFCBC0] block mb-1">Nombre del Restaurante</label>
                      <input
                        type="text"
                        value={tempConfig.name}
                        onChange={(e) => setTempConfig({ ...tempConfig, name: e.target.value })}
                        className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">Dirección Física</label>
                        <input
                          type="text"
                          value={tempConfig.address}
                          onChange={(e) => setTempConfig({ ...tempConfig, address: e.target.value })}
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">Barrio / Ciudad</label>
                        <input
                          type="text"
                          value={tempConfig.city}
                          onChange={(e) => setTempConfig({ ...tempConfig, city: e.target.value })}
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">Tarifa Domicilio (COP)</label>
                        <input
                          type="number"
                          value={tempConfig.baseDeliveryFee}
                          onChange={(e) =>
                            setTempConfig({ ...tempConfig, baseDeliveryFee: Number(e.target.value) })
                          }
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">Tiempo Prep. (min)</label>
                        <input
                          type="number"
                          value={tempConfig.basePrepTimeMinutes}
                          onChange={(e) =>
                            setTempConfig({ ...tempConfig, basePrepTimeMinutes: Number(e.target.value) })
                          }
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">Tiempo Domicilio (min)</label>
                        <input
                          type="number"
                          value={tempConfig.baseDeliveryTimeMinutes}
                          onChange={(e) =>
                            setTempConfig({
                              ...tempConfig,
                              baseDeliveryTimeMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">WhatsApp de Pedidos</label>
                        <input
                          type="text"
                          value={tempConfig.phone}
                          onChange={(e) => setTempConfig({ ...tempConfig, phone: e.target.value })}
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#CFCBC0] block mb-1">PIN Administrador</label>
                        <input
                          type="text"
                          value={tempConfig.adminPin}
                          onChange={(e) => setTempConfig({ ...tempConfig, adminPin: e.target.value })}
                          className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] font-bold py-2.5 px-5 text-xs shadow mt-4 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Sub-window: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#171E19] gold-border-glow p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                  {isCreatingProduct ? 'Agregar Nuevo Plato' : `Editar: ${editingProduct.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-[#CFCBC0] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#CFCBC0] mb-1">Nombre del Plato</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#CFCBC0] mb-1">Precio (COP)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#CFCBC0] mb-1">Tiempo Prep. (min)</label>
                    <input
                      type="number"
                      value={editingProduct.prepTimeMinutes}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          prepTimeMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#CFCBC0] mb-1">Categoría</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                  >
                    <option value="entradas">Entradas</option>
                    <option value="principales">Platos Principales</option>
                    <option value="postres">Postres</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#CFCBC0] mb-1">URL de Imagen</label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#CFCBC0] mb-1">Descripción</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white resize-none"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#CFCBC0] mb-1">
                    Ingredientes (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.ingredients.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xl bg-[#111412] border border-white/10 p-2.5 text-white"
                  />
                </div>

                {/* Allergen check boxes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[#CFCBC0]">Alérgenos presentes</label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#8ED09E]">
                      <input
                        type="checkbox"
                        checked={editingProduct.allergensConfirmed}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            allergensConfirmed: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span>Alérgenos confirmados por cocina</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ALLERGENS.map((alg) => {
                      const isChecked = editingProduct.allergens.includes(alg);
                      return (
                        <button
                          key={alg}
                          type="button"
                          onClick={() => {
                            const newAllergens = isChecked
                              ? editingProduct.allergens.filter((a) => a !== alg)
                              : [...editingProduct.allergens, alg];
                            setEditingProduct({ ...editingProduct, allergens: newAllergens });
                          }}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                            isChecked
                              ? 'bg-[#E5B869]/20 border-[#E5B869] text-[#E5B869]'
                              : 'bg-[#111412] border-white/10 text-[#CFCBC0]'
                          }`}
                        >
                          {alg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 text-xs text-[#CFCBC0]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E5B869] text-[#111412] font-bold text-xs"
                  >
                    Guardar Plato
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
