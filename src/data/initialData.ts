import { Product, Promotion, RestaurantConfig } from '../types';

export const INITIAL_CONFIG: RestaurantConfig = {
  name: "OSO FUSIÓN",
  slogan: "Sabores de Asia y Colombia",
  address: "Cra. 6 con Calle 50, Piedra Pintada",
  city: "Ibagué",
  department: "Tolima, Colombia",
  phone: "+57 322 768 8168",
  whatsappNumber: "3227688168",
  baseDeliveryFee: 5000,
  basePrepTimeMinutes: 25,
  baseDeliveryTimeMinutes: 20,
  openingHours: "Martes a Domingo: 12:00 PM - 10:30 PM",
  scheduleDescription: "Lunes festivos abierto. Domicilios en toda la zona urbana de Ibagué.",
  adminPin: "1234",
  allowStackablePromos: false,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Oriental Tostones",
    category: "entradas",
    price: 24900,
    description: "Crispy Colombian green plantain patacones topped with slow-braised pulled pork shoulder in a sweet soy and ginger glaze, scallions, toasted sesame, and edible flower petals.",
    prepTimeMinutes: 15,
    image: "/images/oriental_tostones_1789763707990.jpg",
    ingredients: [
      "Handcrafted crispy green plantain",
      "Slow-braised pulled pork shoulder",
      "Sweet soy and ginger reduction",
      "Fresh scallions",
      "Toasted sesame seeds",
      "Edible flower petals"
    ],
    allergens: ["Soya", "Sésamo", "Gluten"],
    allergensConfirmed: true,
    availableSauces: ["Asian glaze sauce", "BBQ sauce", "Spicy chili sauce", "House fusion sauce", "No sauce"],
    removableIngredients: ["Fresh scallions", "Toasted sesame seeds", "Mild chili"],
    extraOptions: [
      { id: "ext-1", name: "Extra portion of Asian pulled pork", priceExtra: 6500 },
      { id: "ext-2", name: "Additional large crispy patacón", priceExtra: 3500 },
      { id: "ext-3", name: "Diced Hass avocado", priceExtra: 4000 }
    ],
    featured: true
  },
  {
    id: "prod-2",
    name: "BBQ Pork Gyozas",
    category: "entradas",
    price: 22900,
    description: "Five artisanal Japanese dumplings stuffed with spiced pork and Chinese cabbage, pan-seared and glazed with Colombian tamarind BBQ and microgreens.",
    prepTimeMinutes: 18,
    image: "/images/bbq_pork_gyozas_1789763720998.jpg",
    ingredients: [
      "Delicate steamed & pan-seared gyoza dough",
      "Lean seasoned pork & Chinese cabbage",
      "Artisanal tamarind BBQ glaze",
      "Cold-pressed sesame oil",
      "Chives and chili threads"
    ],
    allergens: ["Gluten", "Soya", "Sésamo"],
    allergensConfirmed: true,
    availableSauces: ["Tamarind BBQ", "Asian sauce", "Sweet chili spicy sauce", "House fusion sauce", "No sauce"],
    removableIngredients: ["Chili threads", "Chives"],
    extraOptions: [
      { id: "ext-4", name: "2 Additional Gyozas", priceExtra: 7000 },
      { id: "ext-5", name: "Extra tamarind BBQ dip", priceExtra: 2500 }
    ],
    featured: true
  },
  {
    id: "prod-3",
    name: "Oriental Paisa Bowl",
    category: "principales",
    price: 38900,
    description: "Our signature fusion creation: Coconut-infused jasmine rice, crispy pork belly glazed in hoisin and lulo fruit, steamed edamame, caramelized sweet plantains, fresh Hass avocado, and a farm-fresh fried egg with sesame.",
    prepTimeMinutes: 25,
    image: "/images/paisa_bowl_1789763734770.jpg",
    ingredients: [
      "Steamed coconut jasmine rice",
      "Crispy pork belly (chicharrón)",
      "Sweet & tangy hoisin-lulo glaze",
      "Japanese edamame",
      "Caramelized sweet plantains",
      "Fresh Hass avocado",
      "Tender fried egg",
      "Scallions and sesame"
    ],
    allergens: ["Huevo", "Soya", "Sésamo"],
    allergensConfirmed: true,
    availableSauces: ["House hoisin-lulo glaze", "Asian sauce", "Andean spicy sauce", "No sauce"],
    removableIngredients: ["Tender fried egg", "Scallions", "Sesame", "Sweet plantains"],
    extraOptions: [
      { id: "ext-6", name: "Extra crispy pork belly (100g)", priceExtra: 9500 },
      { id: "ext-7", name: "Additional fried egg", priceExtra: 2800 },
      { id: "ext-8", name: "Double Hass avocado", priceExtra: 4000 },
      { id: "ext-9", name: "Rice noodles base instead of jasmine rice", priceExtra: 2000 }
    ],
    featured: true
  },
  {
    id: "prod-4",
    name: "Sichuan Style Lomo",
    category: "principales",
    price: 39900,
    description: "Tender beef tenderloin wok-seared over high flame with aromatic Sichuan pepper, sweet Colombian chili, crunchy baby bok choy, red onions, and golden baby criolla potatoes tossed with ginger.",
    prepTimeMinutes: 22,
    image: "/images/sichuan_lomo_1789763790363.jpg",
    ingredients: [
      "Prime beef tenderloin (220g)",
      "Aromatic Sichuan peppercorns",
      "Colombian sweet ají chili",
      "Crunchy baby bok choy",
      "Golden Andean criolla potatoes",
      "Oyster sauce and light soy"
    ],
    allergens: ["Soya", "Gluten", "Mariscos"],
    allergensConfirmed: true,
    availableSauces: ["Original Sichuan sauce", "Mild Asian sauce", "House fusion sauce", "No sauce"],
    removableIngredients: ["Spicy pepper", "Red onion", "Bok choy"],
    extraOptions: [
      { id: "ext-10", name: "Side of jasmine rice", priceExtra: 4500 },
      { id: "ext-11", name: "Double golden criolla potatoes", priceExtra: 5000 },
      { id: "ext-12", name: "Extra spicy Sichuan level", priceExtra: 0 }
    ],
    featured: true
  },
  {
    id: "prod-5",
    name: "Lulo & Ginger Cheesecake",
    category: "postres",
    price: 18900,
    description: "Creamy baked cheesecake on an Andean-spiced cookie crust, topped with a glossy mirror glaze of fresh Tolima lulo fruit and delicate candied ginger crystals.",
    prepTimeMinutes: 10,
    image: "/images/lulo_cheesecake_1789763746777.jpg",
    ingredients: [
      "Premium cream cheese",
      "Spiced ginger cookie crust",
      "Fresh native lulo fruit pulp",
      "Candied ginger crystals",
      "Fresh garden mint"
    ],
    allergens: ["Lácteos", "Gluten", "Huevo"],
    allergensConfirmed: true,
    availableSauces: ["Lulo & ginger coulis", "Passion fruit syrup", "No coulis"],
    removableIngredients: ["Candied ginger", "Fresh mint"],
    extraOptions: [
      { id: "ext-13", name: "Scoop of artisanal vanilla ice cream", priceExtra: 4500 }
    ],
    featured: true
  },
  {
    id: "prod-6",
    name: "Coconut & Guanábana Mochi",
    category: "postres",
    price: 16900,
    description: "Two artisanal traditional Japanese mochis filled with a velvety mousse of Colombian soursop (guanábana) and coconut cream, dusted with toasted coconut and powdered sugar.",
    prepTimeMinutes: 8,
    image: "/images/coconut_mochi_1789763800569.jpg",
    ingredients: [
      "Soft mochiko glutinous rice dough",
      "Natural Colombian soursop (guanábana) mousse",
      "Rich coconut milk cream",
      "Finely toasted grated coconut"
    ],
    allergens: ["Lácteos"],
    allergensConfirmed: true,
    availableSauces: ["Light lulo syrup", "Sweetened coconut condensed milk", "No sauce"],
    removableIngredients: ["Outer toasted coconut"],
    extraOptions: [
      { id: "ext-14", name: "Additional Mochi", priceExtra: 7500 }
    ],
    featured: true
  },
  {
    id: "prod-7",
    name: "Coconut & Mint Lemonade",
    category: "bebidas",
    price: 9900,
    description: "Refreshing blended frozen lemonade crafted with natural coconut cream, freshly squeezed regional limes, and muddled garden mint. The ultimate balance of citrus and creaminess.",
    prepTimeMinutes: 6,
    image: "/images/fusion_drinks_1789763809747.jpg",
    ingredients: [
      "Rich coconut cream",
      "Fresh squeezed lime juice",
      "Fresh garden mint",
      "Crushed ice",
      "Pure cane sugar syrup"
    ],
    allergens: [],
    allergensConfirmed: true,
    availableSauces: [],
    removableIngredients: ["Fresh mint", "Sweetener"],
    extraOptions: [
      { id: "ext-15", name: "Fresh ginger kick", priceExtra: 1500 },
      { id: "ext-16", name: "Upgrade to 24oz large", priceExtra: 3500 }
    ],
    featured: true
  },
  {
    id: "prod-8",
    name: "Lychee & Blackberry Iced Tea",
    category: "bebidas",
    price: 10900,
    description: "Cold brewed Ceylon black tea with wild Andean blackberries, muddled Asian lychee, and a splash of citrus served over crystal-clear ice.",
    prepTimeMinutes: 5,
    image: "/images/fusion_drinks_1789763809747.jpg",
    ingredients: [
      "Slow-infused premium black tea",
      "Fresh Andean blackberries",
      "Lychees in light syrup",
      "Purified ice",
      "Spearmint"
    ],
    allergens: [],
    allergensConfirmed: true,
    availableSauces: [],
    removableIngredients: ["Spearmint", "Whole fruit"],
    extraOptions: [
      { id: "ext-17", name: "Lychee popping boba", priceExtra: 3000 }
    ]
  },
  {
    id: "prod-9",
    name: "Traditional Colombian Coffee",
    category: "bebidas",
    price: 6900,
    description: "Specialty Tolima origin coffee, cultivated above 1,800m altitude. Tasting notes of dark chocolate, panela, and subtle citrus, brewed via V60 pour-over or double espresso.",
    prepTimeMinutes: 6,
    image: "/images/fusion_drinks_1789763809747.jpg",
    ingredients: [
      "100% Tolima specialty Arabica coffee",
      "Hot mineral water",
      "Optional: steamed coconut or whole dairy milk"
    ],
    allergens: [],
    allergensConfirmed: true,
    availableSauces: [],
    removableIngredients: ["Sugar / Panela"],
    extraOptions: [
      { id: "ext-18", name: "With steamed coconut milk", priceExtra: 2000 },
      { id: "ext-19", name: "Additional espresso shot", priceExtra: 2500 }
    ]
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-birthday",
    name: "Cumpleaños Fusión",
    badge: "¡Cumpleañero Fest!",
    description: "¡Celebra tu cumpleaños con nosotros en Oso Fusión!",
    benefit: "POSTRE GRATIS (Cheesecake de Lulo o Mochi) para el festejado en consumos superiores a $45.000 COP.",
    type: "birthday",
    active: true,
    stackable: false,
    freeProductName: "Postre a elección (Cheesecake o Mochi)",
    conditions: "Presentar documento de identidad que certifique la fecha de cumpleaños durante la semana de celebración."
  },
  {
    id: "promo-groups",
    name: "Promoción Grupos & Familias",
    badge: "Todos los días",
    description: "Para familias o grupos mayores de 20 personas que reserven o pidan juntos.",
    benefit: "ENTRADA SORPRESA de cortesía por cada 5 personas en la mesa.",
    type: "groups",
    minGroupSize: 20,
    active: true,
    stackable: true,
    freeProductName: "Ronda de Gyozas y Tostones para el grupo",
    conditions: "Válido para grupos de 20 o más personas con reserva previa o consumo grupal."
  },
  {
    id: "promo-wednesday",
    name: "MIÉRCOLES FUSIÓN",
    badge: "20% OFF",
    description: "Mitad de semana para consentir el paladar con nuestra fusión única.",
    benefit: "20% de descuento en todos los Platos Principales.",
    discountPercentage: 20,
    applicableDay: 3, // Miércoles
    type: "wednesday",
    active: true,
    stackable: false,
    conditions: "Aplica exclusivamente los miércoles en consumo en restaurante y domicilios directos."
  },
  {
    id: "promo-sunday",
    name: "DOMINGO PARA DOS",
    badge: "Combo Parejas",
    description: "El plan ideal para compartir en domingo.",
    benefit: "Combo especial: 2 Limonadas de Coco + Wontons crocantes con salsa agridulce por solo $19.900 COP en la compra de dos platos.",
    discountPercentage: 15,
    applicableDay: 0, // Domingo
    type: "sunday",
    active: true,
    stackable: false,
    conditions: "Válido todos los domingos a partir de la 1:00 PM."
  },
  {
    id: "promo-special-love",
    name: "San Valentín & Aniversarios",
    badge: "Fechas Especiales",
    description: "Ambiente romántico bajo los ocobos rosados con maridaje asiático-colombiano.",
    benefit: "Copa de bienvenida + 10% de descuento en la cuenta final.",
    discountPercentage: 10,
    type: "special_date",
    active: true,
    stackable: false,
    conditions: "Requiere reserva anticipada de mesa."
  }
];
