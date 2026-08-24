/* ==========================================================================
   HAMIDA FOOD - data.js
   Data Only - No Functions - Global Scope for script.js
   ========================================================================== */

/* ---------------- 1. Categories ---------------- */
const categories = [
  { id: "all", name: "Tous" },
  { id: "burgers", name: "Burgers" },
  { id: "pizzas", name: "Pizzas" },
  { id: "sandwichs", name: "Sandwichs" },
  { id: "plats", name: "Plats" },
  { id: "boissons", name: "Boissons" },
  { id: "desserts", name: "Desserts" }
];

/* ---------------- 2. Products (22 products) ---------------- */
const products = [
  // Burgers
  {
    id: 1,
    name: "Classic Burger",
    category: "burgers",
    description: "Pain brioché, steak 100% bœuf grillé, fromage cheddar et sauce maison.",
    price: 45,
    oldPrice: null,
    image: "images/products/burger-classic.jpg",
    badge: "Populaire",
    popular: true,
    available: true
  },
  {
    id: 2,
    name: "Cheese Burger",
    category: "burgers",
    description: "Double cheddar fondant, steak juteux, oignons caramélisés et sauce fromagère.",
    price: 49,
    oldPrice: 59,
    image: "images/products/burger-cheese.jpg",
    badge: "Offre",
    popular: true,
    available: true
  },
  {
    id: 3,
    name: "Chicken Burger",
    category: "burgers",
    description: "Filet de poulet croustillant, salade fraîche, tomate et sauce blanche légère.",
    price: 42,
    oldPrice: null,
    image: "images/products/burger-chicken.jpg",
    badge: "Nouveau",
    popular: false,
    available: true
  },
  {
    id: 4,
    name: "Double Burger",
    category: "burgers",
    description: "Double steak, double fromage, bacon, sauce barbecue fumée et frites maison.",
    price: 65,
    oldPrice: null,
    image: "images/products/burger-double.jpg",
    badge: "Populaire",
    popular: true,
    available: true
  },
  // Pizzas
  {
    id: 5,
    name: "Pizza Margherita",
    category: "pizzas",
    description: "Sauce tomate San Marzano, mozzarella fior di latte, basilic frais et huile d'olive.",
    price: 49,
    oldPrice: null,
    image: "images/products/pizza-margherita.jpg",
    badge: null,
    popular: true,
    available: true
  },
  {
    id: 6,
    name: "Pizza Poulet",
    category: "pizzas",
    description: "Poulet mariné, poivrons grillés, champignons, mozzarella et sauce crème.",
    price: 69,
    oldPrice: null,
    image: "images/products/pizza-poulet.jpg",
    badge: "Nouveau",
    popular: false,
    available: true
  },
  {
    id: 7,
    name: "Pizza Viande",
    category: "pizzas",
    description: "Viande hachée assaisonnée, merguez, oignons rouges, olives et fromage.",
    price: 75,
    oldPrice: 85,
    image: "images/products/pizza-viande.jpg",
    badge: "Offre",
    popular: true,
    available: true
  },
  {
    id: 8,
    name: "Pizza 4 Fromages",
    category: "pizzas",
    description: "Mozzarella, gorgonzola, emmental, chèvre, miel et noix concassées.",
    price: 72,
    oldPrice: null,
    image: "images/products/pizza-4-fromages.jpg",
    badge: null,
    popular: false,
    available: true
  },
  // Sandwichs
  {
    id: 9,
    name: "Sandwich Poulet",
    category: "sandwichs",
    description: "Émincé de poulet grillé, crudités croquantes et sauce yaourt citronnée.",
    price: 35,
    oldPrice: null,
    image: "images/products/sandwich-poulet.jpg",
    badge: "Populaire",
    popular: true,
    available: true
  },
  {
    id: 10,
    name: "Sandwich Viande",
    category: "sandwichs",
    description: "Viande grillée, fromage, frites maison et sauce harissa douce.",
    price: 38,
    oldPrice: null,
    image: "images/products/sandwich-viande.jpg",
    badge: null,
    popular: false,
    available: true
  },
  {
    id: 11,
    name: "Sandwich Mixte",
    category: "sandwichs",
    description: "Poulet et viande, double fromage, œuf, salade et sauce cocktail maison.",
    price: 42,
    oldPrice: 48,
    image: "images/products/sandwich-mixte.jpg",
    badge: "Offre",
    popular: false,
    available: true
  },
  // Plats
  {
    id: 12,
    name: "Plat Poulet Grillé",
    category: "plats",
    description: "Demi poulet grillé au charbon, riz parfumé, légumes et sauce maison.",
    price: 68,
    oldPrice: null,
    image: "images/products/plat-poulet.jpg",
    badge: "Populaire",
    popular: true,
    available: true
  },
  {
    id: 13,
    name: "Plat Viande Hachée",
    category: "plats",
    description: "Brochettes de kefta, frites, salade marocaine et pain maison chaud.",
    price: 75,
    oldPrice: null,
    image: "images/products/plat-viande.jpg",
    badge: null,
    popular: false,
    available: true
  },
  {
    id: 14,
    name: "Menu Familial",
    category: "plats",
    description: "2 pizzas familiales, 4 burgers, frites géantes et 1,5L boisson pour 4 personnes.",
    price: 199,
    oldPrice: 239,
    image: "images/products/menu-familial.jpg",
    badge: "Offre",
    popular: true,
    available: true
  },
  {
    id: 15,
    name: "Chawarma Poulet",
    category: "plats",
    description: "Chawarma généreux, frites, crudités, sauces et pain pita artisanal.",
    price: 55,
    oldPrice: null,
    image: "images/products/chawarma-poulet.jpg",
    badge: "Nouveau",
    popular: false,
    available: true
  },
  {
    id: 16,
    name: "Tacos Gratiné",
    category: "plats",
    description: "Tortilla gratinée, viande au choix, frites, fromage et sauce fromagère.",
    price: 48,
    oldPrice: null,
    image: "images/products/tacos-gratine.jpg",
    badge: "Populaire",
    popular: true,
    available: true
  },
  // Boissons
  {
    id: 17,
    name: "Coca-Cola 33cl",
    category: "boissons",
    description: "Boisson fraîche et pétillante, servie bien glacée.",
    price: 9,
    oldPrice: null,
    image: "images/products/boisson-coca.jpg",
    badge: null,
    popular: false,
    available: true
  },
  {
    id: 18,
    name: "Fanta Orange 33cl",
    category: "boissons",
    description: "Goût fruité et rafraîchissant à l'orange, idéal avec nos menus.",
    price: 9,
    oldPrice: null,
    image: "images/products/boisson-fanta.jpg",
    badge: null,
    popular: false,
    available: true
  },
  {
    id: 19,
    name: "Eau Minérale 50cl",
    category: "boissons",
    description: "Eau minérale naturelle, fraîcheur garantie.",
    price: 7,
    oldPrice: null,
    image: "images/products/boisson-eau.jpg",
    badge: null,
    popular: false,
    available: true
  },
  // Desserts
  {
    id: 20,
    name: "Tiramisu Maison",
    category: "desserts",
    description: "Tiramisu onctueux au mascarpone, café et cacao, préparé chaque jour.",
    price: 22,
    oldPrice: null,
    image: "images/products/dessert-tiramisu.jpg",
    badge: "Nouveau",
    popular: true,
    available: true
  },
  {
    id: 21,
    name: "Cheesecake Fruits Rouges",
    category: "desserts",
    description: "Base biscuitée, crème onctueuse et coulis de fruits rouges maison.",
    price: 25,
    oldPrice: 30,
    image: "images/products/dessert-cheesecake.jpg",
    badge: "Offre",
    popular: false,
    available: true
  },
  {
    id: 22,
    name: "Mousse au Chocolat",
    category: "desserts",
    description: "Mousse intense au chocolat noir 70%, texture aérienne et gourmande.",
    price: 18,
    oldPrice: null,
    image: "images/products/dessert-mousse.jpg",
    badge: null,
    popular: false,
    available: true
  }
];

/* ---------------- 3. Offers ---------------- */
const offers = [
  {
    id: "burger-menu",
    title: "Menu Burger + Frites + Boisson",
    description: "Un menu complet et gourmand avec burger au choix, frites croustillantes et boisson fraîche.",
    price: 59,
    oldPrice: 69,
    image: "images/offers/burger-menu.jpg",
    active: true
  },
  {
    id: "familial",
    title: "Menu Familial - 4 Personnes",
    description: "2 pizzas familiales + 4 burgers + frites géantes + boisson 1,5L. Idéal pour vos soirées.",
    price: 199,
    oldPrice: 239,
    image: "images/offers/menu-familial.jpg",
    active: true
  },
  {
    id: "pizza-offre",
    title: "Offre Pizza Double",
    description: "Achetez une pizza viande et recevez une margherita à moitié prix.",
    price: 99,
    oldPrice: 124,
    image: "images/offers/pizza-double.jpg",
    active: true
  },
  {
    id: "livraison-offerte",
    title: "Livraison Offerte",
    description: "Livraison gratuite dès 150 DH d'achat dans votre zone.",
    price: 0,
    oldPrice: null,
    image: "images/offers/livraison.jpg",
    active: true
  }
];

/* ---------------- 4. Restaurant Info ---------------- */
const restaurantInfo = {
  name: "Hamida Food",
  tagline: "Le goût authentique",
  phone: "+212600000000",
  whatsapp: "212600000000",
  address: "Votre adresse",
  openingHours: "10:00 - 23:00",
  currency: "DH",
  email: "contact@hamidafood.com",
  city: "Votre ville"
};

/* ---------------- 5. Delivery Settings ---------------- */
const deliverySettings = {
  fee: 10,
  freeDeliveryFrom: 150,
  estimatedTime: "30-45 min",
  minOrder: 30
};

/* ---------------- 6. Social Links ---------------- */
const socialLinks = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  whatsapp: "https://wa.me/212600000000"
};

/* ---------------- 7. Hero Slides ---------------- */
const heroSlides = [
  {
    id: 1,
    badge: "Le goût authentique",
    title: "HAMIDA FOOD",
    subtitle: "Savourez des plats préparés avec des ingrédients frais et de qualité.",
    image: "images/hero.jpg",
    ctaPrimary: "Voir le menu",
    ctaSecondary: "Commander maintenant"
  },
  {
    id: 2,
    badge: "Livraison rapide",
    title: "FRAIS & SAVOUREUX",
    subtitle: "Des recettes préparées avec passion et livrées chaudes chez vous.",
    image: "images/hero-2.jpg",
    ctaPrimary: "Découvrir nos offres",
    ctaSecondary: "Commander"
  },
  {
    id: 3,
    badge: "Ingrédients sélectionnés",
    title: "LE GOÛT QUI RASSEMBLE",
    subtitle: "Burgers, pizzas, plats et desserts faits maison pour toute la famille.",
    image: "images/hero-3.jpg",
    ctaPrimary: "Voir le menu",
    ctaSecondary: "Nous contacter"
  }
];
