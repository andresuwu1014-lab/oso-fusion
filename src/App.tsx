import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { PromotionsSection } from './components/PromotionsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OsoAssistantChat } from './components/OsoAssistantChat';
import { 
  Product, 
  Promotion, 
  Order, 
  RestaurantConfig, 
  CartItem, 
  OrderModality, 
  CartCustomization, 
  OrderStatus 
} from './types';
import { INITIAL_PRODUCTS, INITIAL_PROMOTIONS, INITIAL_CONFIG } from './data/initialData';
import { ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function App() {
  // Main Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<RestaurantConfig>(INITIAL_CONFIG);

  // Cart & Order Modality
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [modality, setModality] = useState<OrderModality>('domicilio');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);

  // Added-to-cart temporary notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, promoRes, ordRes, cfgRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/promotions').catch(() => null),
          fetch('/api/orders').catch(() => null),
          fetch('/api/config').catch(() => null),
        ]);

        if (prodRes && prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        }
        if (promoRes && promoRes.ok) {
          const promos = await promoRes.json();
          if (Array.isArray(promos) && promos.length > 0) setPromotions(promos);
        }
        if (ordRes && ordRes.ok) {
          const ords = await ordRes.json();
          if (Array.isArray(ords)) setOrders(ords);
        }
        if (cfgRes && cfgRes.ok) {
          const cfg = await cfgRes.json();
          if (cfg && cfg.name) setConfig(cfg);
        }
      } catch (err) {
        console.warn('Backend sync note, using client fallback:', err);
      }
    };

    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Actions
  const handleQuickAdd = (product: Product) => {
    const defaultSauce = product.availableSauces.length > 0 ? product.availableSauces[0] : undefined;
    const defaultCustomization: CartCustomization = {
      selectedSauce: defaultSauce,
      removedIngredients: [],
      addedExtras: [],
    };

    const cartItemId = `${product.id}-${defaultSauce || 'none'}`;
    const existingIndex = cartItems.findIndex((i) => i.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        product,
        quantity: 1,
        customization: defaultCustomization,
        unitPrice: product.price,
        subtotal: product.price,
      };
      setCartItems([...cartItems, newItem]);
    }

    showToast(`Added ${product.name} to your order!`);
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleCustomizeProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleAddToCartWithCustomization = (
    product: Product,
    quantity: number,
    customization: CartCustomization
  ) => {
    const extrasTotal = customization.addedExtras.reduce((sum, e) => sum + e.priceExtra, 0);
    const unitPrice = product.price + extrasTotal;
    const subtotal = unitPrice * quantity;

    // Generate unique signature for this customization
    const sig = `${product.id}-${customization.selectedSauce || ''}-${customization.removedIngredients.sort().join('-')}-${customization.addedExtras.map((e) => e.id).sort().join('-')}-${customization.specialInstructions || ''}`;

    const existingIndex = cartItems.findIndex((i) => i.cartItemId === sig);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].subtotal = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: sig,
        product,
        quantity,
        customization,
        unitPrice,
        subtotal,
      };
      setCartItems([...cartItems, newItem]);
    }

    showToast(`Added ${quantity}x ${product.name} to your order!`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            subtotal: item.unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Promotion calculation for Cart Drawer
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  let discountAmount = 0;
  let appliedPromoName: string | undefined = undefined;
  const activePromoWednesday = promotions.find((p) => p.type === 'wednesday' && p.active);
  const currentDay = new Date().getDay(); // 3 is Wednesday

  if (activePromoWednesday && currentDay === 3) {
    const mainDishesSubtotal = cartItems
      .filter((i) => i.product.category === 'principales')
      .reduce((sum, i) => sum + i.subtotal, 0);
    if (mainDishesSubtotal > 0) {
      discountAmount = Math.round(mainDishesSubtotal * 0.2);
      appliedPromoName = 'Miércoles Fusión (20% OFF en platos fuertes)';
    }
  }

  // Order creation callback from checkout
  const handleOrderCreated = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setCurrentTrackedOrder(newOrder);
    setCartItems([]); // clear cart
  };

  // Admin handlers
  const handleAdminUpdateProduct = async (updated: Product) => {
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminAddProduct = async (newProd: Product) => {
    setProducts([...products, newProd]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminDeleteProduct = async (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminUpdatePromotion = async (updated: Promotion) => {
    setPromotions(promotions.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await fetch(`/api/promotions/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminAddPromotion = async (newPromo: Promotion) => {
    setPromotions([...promotions, newPromo]);
    try {
      await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            statusUpdates: [...o.statusUpdates, { status: newStatus, timestamp: new Date().toISOString() }],
          };
        }
        return o;
      })
    );

    if (currentTrackedOrder && currentTrackedOrder.id === orderId) {
      setCurrentTrackedOrder({
        ...currentTrackedOrder,
        status: newStatus,
        statusUpdates: [
          ...currentTrackedOrder.statusUpdates,
          { status: newStatus, timestamp: new Date().toISOString() },
        ],
      });
    }

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminUpdateConfig = async (newConfig: RestaurantConfig) => {
    setConfig(newConfig);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111412] text-[#F3EFE6] bg-andean-pattern relative selection:bg-[#E5B869]/30 selection:text-[#E5B869]">
      {/* Desktop Custom Spectacled Bear Cursor */}
      <CustomCursor />

      {/* Navigation Header */}
      <Navbar
        cartItemCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        modality={modality}
        setModality={setModality}
        onNavigate={scrollToSection}
      />

      <main>
        {/* Hero Section with Andean landscape & Ocobos */}
        <HeroSection
          onExploreMenu={() => scrollToSection('menu')}
          modality={modality}
          setModality={setModality}
        />

        {/* Menu Section with Categories & Allergen Badges */}
        <MenuSection
          products={products}
          onOpenDetails={handleOpenProductDetail}
          onQuickAdd={handleQuickAdd}
          onCustomize={handleCustomizeProduct}
        />

        {/* Promotions Section */}
        <PromotionsSection promotions={promotions} />

        {/* Location & Schedule Section */}
        <LocationSection config={config} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Cart Trigger Button (Always visible bottom-left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          type="button"
          onClick={() => setIsCartOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 rounded-full bg-[#181E1A] gold-border-glow p-3 pr-5 shadow-2xl text-[#F3EFE6]"
          id="btn-floating-cart"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#181E1A]">
                {totalCartCount}
              </span>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <span className="font-display font-bold text-xs text-[#E5B869] block">
              {totalCartCount > 0 ? `$${subtotal.toLocaleString('es-CO')} COP` : 'Ver Pedido'}
            </span>
            <span className="text-[10px] text-[#CFCBC0]/70">
              {totalCartCount} {totalCartCount === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* If there's an active order, show floating tracker button */}
      {currentTrackedOrder && (
        <div className="fixed bottom-24 left-6 z-40">
          <motion.button
            type="button"
            onClick={() => setIsOrderStatusOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-[#1F2E24] border border-[#3F7A4D] px-3.5 py-2 shadow-xl text-xs text-[#8ED09E]"
            id="btn-floating-order-tracker"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Seguimiento: {currentTrackedOrder.id}</span>
          </motion.button>
        </div>
      )}

      {/* Oso Asistente Floating Chatbot */}
      <OsoAssistantChat />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        modality={modality}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        deliveryFee={config.baseDeliveryFee}
        discountAmount={discountAmount}
        appliedPromoName={appliedPromoName}
      />

      {/* Product Details & Customization Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onAddToCart={handleAddToCartWithCustomization}
      />

      {/* Checkout Modal & WhatsApp Order Generator */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        modality={modality}
        setModality={setModality}
        config={config}
        promotions={promotions}
        onOrderCreated={handleOrderCreated}
      />

      {/* Order Status Live Tracker Modal */}
      <OrderStatusModal
        order={currentTrackedOrder}
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
      />

      {/* Admin Management Panel */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        promotions={promotions}
        orders={orders}
        config={config}
        onUpdateProduct={handleAdminUpdateProduct}
        onAddProduct={handleAdminAddProduct}
        onDeleteProduct={handleAdminDeleteProduct}
        onUpdatePromotion={handleAdminUpdatePromotion}
        onAddPromotion={handleAdminAddPromotion}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onUpdateConfig={handleAdminUpdateConfig}
      />

      {/* Quick Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 right-6 z-50 rounded-2xl bg-[#1A221D] gold-border-glow px-4 py-3 text-xs text-[#F3EFE6] shadow-2xl flex items-center gap-2.5 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#8ED09E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
