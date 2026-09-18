import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_CONFIG, INITIAL_PRODUCTS, INITIAL_PROMOTIONS } from './src/data/initialData';
import { Order, Product, Promotion, RestaurantConfig } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Database Persistence File
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'restaurant_db.json');

interface DatabaseState {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  promotions: Promotion[];
  orders: Order[];
  config: RestaurantConfig;
}

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Starters', slug: 'entradas' },
  { id: 'cat-2', name: 'Main Courses', slug: 'principales' },
  { id: 'cat-3', name: 'Desserts', slug: 'postres' },
  { id: 'cat-4', name: 'Beverages', slug: 'bebidas' },
];

function initDatabase(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
        categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES,
        promotions: parsed.promotions && parsed.promotions.length > 0 ? parsed.promotions : INITIAL_PROMOTIONS,
        orders: parsed.orders || [],
        config: parsed.config || INITIAL_CONFIG,
      };
    }
  } catch (error) {
    console.error('Error reading database file, using initial data:', error);
  }

  const initialDb: DatabaseState = {
    products: INITIAL_PRODUCTS,
    categories: DEFAULT_CATEGORIES,
    promotions: INITIAL_PROMOTIONS,
    orders: [],
    config: INITIAL_CONFIG,
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  } catch (err) {
    console.error('Error writing initial db:', err);
  }

  return initialDb;
}

let db = initDatabase();

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error persisting database:', err);
  }
}

// Lazy Gemini AI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// --- API ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', restaurant: db.config.name, time: new Date().toISOString() });
});

// Products
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'Nuevo Plato',
    category: req.body.category || 'principales',
    price: Number(req.body.price) || 0,
    description: req.body.description || '',
    prepTimeMinutes: Number(req.body.prepTimeMinutes) || 20,
    image: req.body.image || '/images/oriental_tostones_1789763707990.jpg',
    ingredients: req.body.ingredients || [],
    allergens: req.body.allergens || [],
    allergensConfirmed: req.body.allergensConfirmed ?? false,
    availableSauces: req.body.availableSauces || ['Salsa oriental', 'Salsa de la casa'],
    removableIngredients: req.body.removableIngredients || [],
    extraOptions: req.body.extraOptions || [],
    featured: !!req.body.featured,
  };

  db.products.push(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    id, // Keep ID stable
  };
  saveDatabase();
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  saveDatabase();
  res.json({ success: true, id });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const newCat = {
    id: `cat-${Date.now()}`,
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
  };
  db.categories.push(newCat);
  saveDatabase();
  res.status(201).json(newCat);
});

// Promotions
app.get('/api/promotions', (req, res) => {
  res.json(db.promotions);
});

app.post('/api/promotions', (req, res) => {
  const newPromo: Promotion = {
    id: `promo-${Date.now()}`,
    name: req.body.name || 'Nueva Promoción',
    badge: req.body.badge || 'Especial',
    description: req.body.description || '',
    benefit: req.body.benefit || '',
    discountPercentage: req.body.discountPercentage ? Number(req.body.discountPercentage) : undefined,
    type: req.body.type || 'special_date',
    active: req.body.active !== false,
    stackable: req.body.stackable === true,
    minGroupSize: req.body.minGroupSize ? Number(req.body.minGroupSize) : undefined,
    applicableDay: req.body.applicableDay !== undefined ? Number(req.body.applicableDay) : undefined,
    freeProductName: req.body.freeProductName || undefined,
    conditions: req.body.conditions || '',
    validUntil: req.body.validUntil || undefined,
  };
  db.promotions.push(newPromo);
  saveDatabase();
  res.status(201).json(newPromo);
});

app.put('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  const index = db.promotions.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Promoción no encontrada' });
  }

  db.promotions[index] = {
    ...db.promotions[index],
    ...req.body,
    id,
  };
  saveDatabase();
  res.json(db.promotions[index]);
});

app.delete('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  db.promotions = db.promotions.filter((p) => p.id !== id);
  saveDatabase();
  res.json({ success: true, id });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const currentYear = new Date().getFullYear();
  const orderCount = db.orders.length + 1;
  const orderSequence = String(orderCount).padStart(3, '0');
  const generatedId = `OF-${currentYear}-${orderSequence}`;

  const nowIso = new Date().toISOString();

  const newOrder: Order = {
    id: generatedId,
    createdAt: nowIso,
    modality: req.body.modality || 'domicilio',
    customer: req.body.customer || {
      name: 'Cliente Anónimo',
      phone: '3000000000',
      paymentMethod: 'Efectivo',
    },
    items: req.body.items || [],
    subtotal: Number(req.body.subtotal) || 0,
    discountAmount: Number(req.body.discountAmount) || 0,
    appliedPromotionName: req.body.appliedPromotionName,
    deliveryFee: Number(req.body.deliveryFee) || 0,
    total: Number(req.body.total) || 0,
    estimatedTimeMin: Number(req.body.estimatedTimeMin) || 40,
    status: 'Pedido recibido',
    statusUpdates: [
      {
        status: 'Pedido recibido',
        timestamp: nowIso,
      },
    ],
  };

  db.orders.unshift(newOrder);
  saveDatabase();
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  order.status = status;
  order.statusUpdates.push({
    status,
    timestamp: new Date().toISOString(),
  });
  saveDatabase();
  res.json(order);
});

// Restaurant Config
app.get('/api/config', (req, res) => {
  res.json(db.config);
});

app.put('/api/config', (req, res) => {
  db.config = {
    ...db.config,
    ...req.body,
  };
  saveDatabase();
  res.json(db.config);
});

// Oso Asistente (Chatbot)
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  // Generate system context from current real database state
  const menuSummary = db.products
    .map(
      (p) =>
        `- ${p.name} ($${p.price.toLocaleString('es-CO')} COP, Cat: ${p.category}): ${p.description}. Tiempo prep: ${p.prepTimeMinutes} min. Ingredientes: ${p.ingredients.join(', ')}. Alérgenos: ${p.allergens.length > 0 ? p.allergens.join(', ') : 'Ninguno registrado'}. Salsas: ${p.availableSauces.join(', ')}.`
    )
    .join('\n');

  const promoSummary = db.promotions
    .filter((pr) => pr.active)
    .map((pr) => `- ${pr.name}: ${pr.description} Beneficio: ${pr.benefit}. Condiciones: ${pr.conditions}`)
    .join('\n');

  const systemInstruction = `Eres "OSO ASISTENTE", el asesor de ventas inteligente, amable y servicial del restaurante OSO FUSIÓN en Ibagué, Tolima, Colombia.
Identidad y Estilo:
- Eres cálido, educado, hospitalario y conocedor. Inspirado en el oso de anteojos andino, amante de la gastronomía que une Asia y Colombia.
- Habla en español colombiano amable y respetuoso.
- Tu misión es responder preguntas frecuentes sobre el menú, ingredientes, alérgenos, precios, promociones, tiempos de preparación, domicilios, recoger en restaurante, ubicación y horarios.
- REGLA CRÍTICA: Debes utilizar ÚNICAMENTE la información disponible a continuación. Si el usuario pregunta algo que no está registrado (por ejemplo eventos privados fuera de regla, ingredientes secretos no listados, cambios de precio no oficiales, etc.), di con amabilidad que necesitas confirmación directa del restaurante vía WhatsApp (3227688168) o con el personal.

INFORMACIÓN DEL RESTAURANTE:
Nombre: ${db.config.name} (${db.config.slogan})
Ubicación: ${db.config.address}, ${db.config.city}, ${db.config.department}.
Teléfono y WhatsApp de pedidos: ${db.config.whatsappNumber} (+57 322 768 8168).
Horarios: ${db.config.openingHours}. ${db.config.scheduleDescription}.
Modalidades de pedido:
1. Domicilio (costo base $${db.config.baseDeliveryFee.toLocaleString('es-CO')} COP, tiempo estimado de entrega ${db.config.basePrepTimeMinutes + db.config.baseDeliveryTimeMinutes} a ${db.config.basePrepTimeMinutes + db.config.baseDeliveryTimeMinutes + 15} minutos).
2. Recoger en restaurante (sin costo adicional).
3. Comer en el restaurante (Mesa).

MENÚ DISPONIBLE:
${menuSummary}

PROMOCIONES ACTIVAS:
${promoSummary}

REGLAS DE RECOMENDACIÓN:
- Si el cliente busca algo picante: recomienda Sichuan Style Lomo.
- Si busca algo crujiente y típico fusionado: Oriental Tostones o Oriental Paisa Bowl.
- Si busca postre: Lulo & Ginger Cheesecake o Coconut & Guanábana Mochi.
- Si tiene alergia al gluten o lácteos: revisa rigurosamente los alérgenos listados de cada plato.
- Respuestas concisas, bien formateadas, con tono acogedor y apetitoso.`;

  const ai = getGenAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nPregunta del cliente: ${message}` }],
          },
        ],
      });

      const reply = response.text || '¡Con gusto te ayudo! Por favor pregúntame sobre cualquier plato o promoción de Oso Fusión.';
      return res.json({ reply, source: 'gemini' });
    } catch (err) {
      console.error('Gemini API call failed, falling back to local assistant engine:', err);
    }
  }

  // Smart local fallback if Gemini key is not set or network issue
  const q = message.toLowerCase();
  let localReply = '';

  if (q.includes('donde') || q.includes('dirección') || q.includes('direccion') || q.includes('ubicacion') || q.includes('ubicación') || q.includes('llegar')) {
    localReply = `¡Estamos ubicados en **${db.config.address}**, barrio Piedra Pintada en Ibagué, Tolima! Muy cerca de la Cra. 6ta con Calle 50. Puedes visitarnos o pedir tu domicilio al WhatsApp ${db.config.whatsappNumber}. 🐻`;
  } else if (q.includes('horario') || q.includes('hora') || q.includes('abierto') || q.includes('dias') || q.includes('días')) {
    localReply = `Nuestro horario de atención es: **${db.config.openingHours}**. ${db.config.scheduleDescription}. ¡Te esperamos con los mejores sabores de Asia y Colombia! 🎋`;
  } else if (q.includes('domicilio') || q.includes('entrega') || q.includes('costo') || q.includes('cuanto vale el envio')) {
    localReply = `Ofrecemos servicio a domicilio en Ibagué. El costo base es de **$${db.config.baseDeliveryFee.toLocaleString('es-CO')} COP** y el tiempo estimado de entrega suele ser de **${db.config.basePrepTimeMinutes + db.config.baseDeliveryTimeMinutes} a ${db.config.basePrepTimeMinutes + db.config.baseDeliveryTimeMinutes + 15} minutos**. Puedes hacer tu pedido desde esta web y enviarlo directamente a nuestro WhatsApp ${db.config.whatsappNumber}.`;
  } else if (q.includes('cumpleaños') || q.includes('cumple')) {
    localReply = `🎂 ¡En Oso Fusión celebramos contigo! En tu cumpleaños te obsequiamos **POSTRE GRATIS** (Cheesecake de Lulo y Jengibre o Mochi de Guanábana y Coco) en consumos mayores a $45.000 COP, presentando tu cédula durante la semana de tu cumpleaños.`;
  } else if (q.includes('miercoles') || q.includes('miércoles')) {
    localReply = `🎉 ¡Los miércoles son de **MIÉRCOLES FUSIÓN**! Tienes un **20% de descuento** en todos los Platos Principales (como el Oriental Paisa Bowl y el Sichuan Style Lomo).`;
  } else if (q.includes('domingo') || q.includes('pareja')) {
    localReply = `✨ Los domingos tenemos **DOMINGO PARA DOS**: combo especial de Limonadas de Coco + Wontons crocantes para disfrutar en pareja por la compra de dos platos.`;
  } else if (q.includes('grupo') || q.includes('familia') || q.includes('20 personas')) {
    localReply = `👨‍👩‍👧‍👦 Para familias y grupos de 20 o más personas tenemos **Entrada Sorpresa de cortesía** por cada 5 personas en la mesa. ¡Ideal para celebraciones y eventos!`;
  } else if (q.includes('alerg') || q.includes('gluten') || q.includes('lacteo') || q.includes('lácteo') || q.includes('mani') || q.includes('maní')) {
    localReply = `En Oso Fusión cuidamos tu salud. En cada plato del menú encontrarás los sellos de alérgenos claros (Gluten, Soya, Huevo, Lácteos, Sésamo, Mariscos). Si tienes una alergia severa o deseas retirar algún ingrediente, puedes indicarlo al personalizar tu plato o consultarnos por WhatsApp al ${db.config.whatsappNumber}.`;
  } else if (q.includes('recomiend') || q.includes('que me recomiendas') || q.includes('mas rico') || q.includes('especialidad')) {
    localReply = `¡Te recomiendo con total orgullo nuestro plato estrella: el **Oriental Paisa Bowl** ($38.900)! Combina arroz jazmín con coco, chicharrón crocante glaseado con hoisin y lulo del Tolima, aguacate, edamame y huevo de campo. Si prefieres algo picante al wok, el **Sichuan Style Lomo** ($39.900) es sensacional. Y de postre, el **Lulo & Ginger Cheesecake** ($18.900). 🐾`;
  } else {
    localReply = `¡Hola! Soy Oso Asistente 🐻. Con gusto puedo informarte sobre nuestro menú fusión, platos como el Oriental Paisa Bowl o Tostones Orientales, alérgenos, promociones como Miércoles Fusión o Cumpleaños, domicilios y nuestra ubicación en Piedra Pintada (Cra. 6 con Calle 50). Para consultas especiales o reservas no registradas, nuestro equipo te atenderá con gusto en el WhatsApp **${db.config.whatsappNumber}**.`;
  }

  res.json({ reply: localReply, source: 'local_knowledge' });
});

// --- VITE / STATIC SERVING ---
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Oso Fusión] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
