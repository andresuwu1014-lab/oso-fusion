export type OrderModality = 'domicilio' | 'recoger' | 'restaurante';

export type OrderStatus = 
  | 'Pedido recibido'
  | 'En preparación'
  | 'Listo'
  | 'En camino'
  | 'Entregado';

export type PaymentMethod = 
  | 'Efectivo'
  | 'Nequi'
  | 'Daviplata'
  | 'Tarjeta contraentrega'
  | 'Transferencia Bancolombia';

export type ProductCategory = 'entradas' | 'principales' | 'postres' | 'bebidas';

export type AllergenType = 
  | 'Gluten'
  | 'Soya'
  | 'Maní'
  | 'Frutos secos'
  | 'Lácteos'
  | 'Huevo'
  | 'Mariscos'
  | 'Pescado'
  | 'Sésamo';

export interface ProductCustomizationOption {
  id: string;
  name: string;
  priceExtra: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  price: number;
  description: string;
  prepTimeMinutes: number;
  image: string;
  ingredients: string[];
  allergens: AllergenType[];
  allergensConfirmed: boolean;
  availableSauces: string[];
  removableIngredients: string[];
  extraOptions: ProductCustomizationOption[];
  featured?: boolean;
}

export interface CartCustomization {
  selectedSauce?: string;
  removedIngredients: string[];
  addedExtras: ProductCustomizationOption[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  customization: CartCustomization;
  unitPrice: number;
  unitPriceWithExtras?: number;
  subtotal: number;
}

export interface Promotion {
  id: string;
  name: string;
  badge?: string;
  badgeText?: string;
  description: string;
  benefit?: string;
  discountPercentage?: number;
  type: 'birthday' | 'groups' | 'wednesday' | 'sunday' | 'special_date' | 'special';
  active: boolean;
  stackable?: boolean;
  minGroupSize?: number;
  applicableDay?: number; // 0 = Domingo, 3 = Miércoles
  freeProductName?: string;
  conditions?: string;
  rules?: string[];
  validUntil?: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  address?: string;
  neighborhood?: string;
  reference?: string;
  tableNumber?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Order {
  id: string; // e.g. OF-2026-001
  createdAt: string;
  modality: OrderModality;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedPromotionName?: string;
  deliveryFee: number;
  total: number;
  estimatedTimeMin: number;
  status: OrderStatus;
  statusUpdates: { status: OrderStatus; timestamp: string }[];
}

export interface RestaurantConfig {
  name: string;
  slogan: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  whatsappNumber: string;
  baseDeliveryFee: number;
  basePrepTimeMinutes: number;
  baseDeliveryTimeMinutes: number;
  openingHours: string;
  scheduleDescription: string;
  adminPin: string;
  allowStackablePromos: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
