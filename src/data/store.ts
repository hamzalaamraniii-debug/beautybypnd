import { Product, Review, SourcingRequest, Order, Client, Coupon, ShippingFee, FAQItem, BlogPost } from '../types';

// Constants
export const ADMIN_AUTH_KEY = 'beauty_by_pnd_admin_auth';
export const ADMIN_EMAIL = 'chbabimane95@gmail.com';
export const ADMIN_PASS = 'Imane@Hamza';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'YSL Libre Eau de Parfum (Inspiration Europe)',
    category: 'Parfums',
    price: 950,
    originalPrice: 1150,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    description: 'Une eau de parfum florale audacieuse et sensuelle avec des notes de lavande, de fleur d\'oranger et de vanille. Un classique incontournable importé directement.',
    rating: 4.9,
    reviewsCount: 34,
    tag: 'Best',
    inspiration: 'Europe',
    collection: 'Aucune'
  },
  {
    id: 'prod-2',
    name: 'Delina de Marly - Rose Mystique',
    category: 'Parfums',
    price: 1200,
    originalPrice: 1450,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    description: 'Un parfum floral fruité absolument éblouissant de luxe. Ce flacon rose poudré abrite des notes de litchi, de rhubarbe, de rose turque et de vanille veloutée.',
    rating: 5.0,
    reviewsCount: 18,
    tag: 'Limité',
    inspiration: 'Aucune',
    collection: 'Été'
  },
  {
    id: 'prod-3',
    name: 'Sérum Éclat Vitamine C (Inspiration Mercadona)',
    category: 'Cosmétiques',
    price: 95,
    originalPrice: 130,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    description: 'Le sérum éclat espagnol culte très recherché. Illumine le teint en 7 jours, élimine les taches et repulpe délicatement grâce à sa haute concentration en vitamine C stabilisée et d\'huile de rose.',
    rating: 4.8,
    reviewsCount: 41,
    tag: 'Promo',
    inspiration: 'Mercadona',
    collection: 'Aucune'
  },
  {
    id: 'prod-4',
    name: 'Dior Addict Lip Glow Oil (TikTok Viral)',
    category: 'Cosmétiques',
    price: 390,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
    description: 'L\'huile à lèvres brillante iconique de TikTok qui rehausse la couleur naturelle de vos lèvres. Formule enrichie en huile de cerise pour une hydratation intense.',
    rating: 4.9,
    reviewsCount: 125,
    tag: 'TikTok',
    inspiration: 'Europe',
    collection: 'Aucune'
  },
  {
    id: 'prod-5',
    name: 'Gloss Fenty Beauty Gloss Bomb Rose Poudré',
    category: 'Cosmétiques',
    price: 240,
    originalPrice: 280,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
    description: 'Une brillance explosive pour des lèvres irrésistibles. Sa teinte or rose et sa texture douce non collante nourrissent intensément vos lèvres.',
    rating: 4.7,
    reviewsCount: 16,
    tag: 'Best',
    inspiration: 'Aucune',
    collection: 'Aucune'
  },
  {
    id: 'prod-6',
    name: 'Sac Chic Lady Jacquemus',
    category: 'Sacs',
    price: 520,
    originalPrice: 750,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    description: 'Le sac à main ultra tendance aux détails dorés. Porté épaule ou main, son cuir finement texturé apporte une touche de chic instantanée à vos tenues.',
    rating: 4.6,
    reviewsCount: 8,
    tag: 'Limité',
    inspiration: 'Shein',
    collection: 'Été'
  },
  {
    id: 'prod-7',
    name: 'Sac Matelassé Chaîne Dorée Divine',
    category: 'Sacs',
    price: 390,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&q=80&w=600',
    description: 'Pochette de soirée chic matelassée rose poudrée avec bandoulière chaîne dorée. Parfaite pour se marier avec nos tenues de fête.',
    rating: 4.8,
    reviewsCount: 19,
    tag: 'Nouveau',
    inspiration: 'Aucune',
    collection: 'Hiver'
  },
  {
    id: 'prod-8',
    name: 'Montre Michael Kors Slim Runway Gold',
    category: 'Montres',
    price: 490,
    originalPrice: 790,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
    description: 'Une montre majestueuse entièrement dorée avec un cadran soleil assorti. Un bijou de poignet féminin résistant et éternel.',
    rating: 4.9,
    reviewsCount: 22,
    tag: 'Best',
    inspiration: 'Europe',
    collection: 'Aucune'
  },
  {
    id: 'prod-9',
    name: 'Montre Quartz Minimaliste Rose & Or',
    category: 'Montres',
    price: 180,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600',
    description: 'L\'élégance de tous les jours au prix doux. Bracelet en cuir rose tendre et cadran de précision or rose orné de brillants subtils.',
    rating: 4.5,
    reviewsCount: 15,
    tag: 'Pack',
    inspiration: 'Action',
    collection: 'Aucune'
  },
  {
    id: 'prod-10',
    name: 'Robe Longue Glamour en Satin Rose Poudré',
    category: 'Vêtements',
    price: 450,
    originalPrice: 590,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    description: 'Splendide robe en satin de soie avec col bénitier et dos nu délicat. Parfaite pour les grandes occasions d\'été ou de soirée chic.',
    rating: 4.8,
    reviewsCount: 12,
    tag: 'Best',
    inspiration: 'Shein',
    collection: 'Été'
  },
  {
    id: 'prod-11',
    name: 'Ensemble Lin Cosy Chic de la Semaine',
    category: 'Vêtements',
    price: 290,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    description: 'Léger et ultra confortable. Cet ensemble chemise ample et pantalon fluide en lin de coton est l\'incarnation de la mode estivale Shein moderne.',
    rating: 4.4,
    reviewsCount: 29,
    tag: 'Nouveau',
    inspiration: 'Shein',
    collection: 'Été'
  },
  {
    id: 'prod-12',
    name: 'Kit Pinceaux Premium Soft Rose & Gold (Inspiration Action)',
    category: 'Cosmétiques',
    price: 89,
    originalPrice: 120,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
    description: 'Un ensemble complet de 10 pinceaux en poils d\'une douceur extraordinaire avec des manches or rose pailletés. Des prix Action super doux chez Beauty By PND.',
    rating: 4.7,
    reviewsCount: 56,
    tag: 'Promo',
    inspiration: 'Action',
    collection: 'Aucune'
  },
  {
    id: 'prod-13',
    name: 'Pack Cadeau Impérial - Parfum & Son Mini Sac',
    category: 'Parfums',
    price: 1100,
    originalPrice: 1400,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    description: 'Le coffret de rêve associant le parfum d\'exception Delina Rose avec une pochette dorée exclusive de soirée. Offrez l\'incomparable !',
    rating: 5.0,
    reviewsCount: 9,
    tag: 'Pack',
    inspiration: 'Aucune',
    collection: 'Hiver'
  },
  {
    id: 'prod-14',
    name: 'Crème Anti-Âge d\'Exception (Mercadona Sisbela)',
    category: 'Cosmétiques',
    price: 79,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    description: 'La crème régénératrice Sisbela culte à bas prix de Mercadona. Hydrate, ferme et ravive la texture cutanée instantanément.',
    rating: 4.6,
    reviewsCount: 45,
    tag: 'Promo',
    inspiration: 'Mercadona',
    collection: 'Aucune'
  },
  {
    id: 'prod-15',
    name: 'Bombe Corporelle Shimmer Brillantissime',
    category: 'Cosmétiques',
    price: 150,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
    description: 'Brillez de mille feux ! Vaporisateur pailleté corporel or rose ultra nacré, le produit star sur TikTok pour des soirées inoubliables.',
    rating: 4.9,
    reviewsCount: 88,
    tag: 'TikTok',
    inspiration: 'Europe',
    collection: 'Été'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-4',
    productName: 'Dior Addict Lip Glow Oil (TikTok Viral)',
    customerName: 'Sara K.',
    rating: 5,
    comment: 'L\'huile est incroyable ! Elle donne un fini tellement glowy et n\'est absolument pas collante. Mes amies me l\'ont toutes enviée ! Livraison en 24h à Casablanca.',
    date: '2026-06-01',
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    productName: 'Sérum Éclat Vitamine C (Inspiration Mercadona)',
    customerName: 'Meryem T.',
    rating: 5,
    comment: 'Un produit magique venu d\'Espagne. Merci à Beauty by PND de le proposer au Maroc à ce prix défiant toute concurrence. J\'adore !',
    date: '2026-06-03',
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'prod-10',
    productName: 'Robe Longue Glamour en Satin Rose Poudré',
    customerName: 'Yasmine B.',
    rating: 4,
    comment: 'Très belle robe décolletée, le tissu satin brille d\'une façon magnifique sous les lumières du soir. La taille M me va comme un gant.',
    date: '2026-06-05',
    approved: true
  }
];

const INITIAL_COUPONS: Coupon[] = [
  { code: 'PNDWELCOME', discountType: 'fixed', value: 50, minOrderAmount: 300, active: true },
  { code: 'GOLDEN10', discountType: 'percentage', value: 10, minOrderAmount: 150, active: true },
  { code: 'BEAUTYFLUX', discountType: 'percentage', value: 15, minOrderAmount: 600, active: true }
];

const INITIAL_SHIPPING_FEES: ShippingFee[] = [
  { city: 'Casablanca', fee: 20 },
  { city: 'Rabat', fee: 30 },
  { city: 'Marrakech', fee: 35 },
  { city: 'Tanger', fee: 35 },
  { city: 'Agadir', fee: 40 },
  { city: 'Fès', fee: 35 },
  { city: 'Autre Ville du Maroc', fee: 45 }
];

const INITIAL_FAQS: FAQItem[] = [
  {
    question: 'Combien de temps prend la livraison ?',
    answer: 'La livraison est rapide ! Les commandes en stock sont expédiées sous 24 à 48 heures. Le délai s\'élève à 24-48-72h selon votre ville de résidence (Casablanca, Rabat, Marrakech, Agadir, etc.).',
    category: 'Livraison'
  },
  {
    question: 'Proposez-vous le paiement à la livraison au Maroc ?',
    answer: 'Oui, absolument ! Nous proposons le paiement 100% à la livraison (Cash on Delivery) sur tout le Maroc. Vous réglez vos achats en espèces directement auprès du livreur à la réception de votre colis.',
    category: 'Paiement'
  },
  {
    question: 'Puis-je retourner un produit s\'il ne me plaît pas ?',
    answer: 'Oui ! Vous disposez de 7 jours après réception de votre commande pour demander un retour ou un échange. Les articles doivent être retournés intacts dans leur emballage d\'origine non ouverts pour des raisons d\'hygiène.',
    category: 'Retours'
  },
  {
    question: 'Je ne trouve pas un article, comment commander un produit sur demande ?',
    answer: 'C\'est notre spécialité ! Cliquez sur le bouton "Demander un produit" dans le menu. Remplissez le formulaire avec la photo, le nom, la couleur/taille et la description. Nous recherchons l\'article auprès de nos fournisseurs partenaires en Europe et Shein et vous contactons en 7 à 15 jours.',
    category: 'Sourcing'
  }
];

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Les 5 Secrets de Peaux Célèbres pour le Teint de Poupée',
    excerpt: 'Comment obtenir le glow radieux dont tout le monde parle sur Instagram et TikTok ? Découvrez nos conseils exclusifs.',
    content: 'Obtenir une peau lumineuse et saine demande de la rigueur et le choix des bons actifs. Les vedettes s\'appuient sur une combinaison gagnante de Vitamine C pour l\'éclat matinal, combinée à une protection solaire ultra-légère. L\'hydratation ultime nécessite de boire suffissament d\'eau, mais aussi de sceller l\'hydratation avec des huiles hydratantes subtiles ou un masque de nuit aux peptides. Retrouvez nos sérums de soin Mercadona et huiles Dior Addict pour reproduire ce look chez vous !',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
    date: '2026-06-08',
    author: 'PND Beauté Expert',
    readTime: '3 min'
  },
  {
    id: 'blog-2',
    title: 'Parfums de Luxe : Comment les Faire Tenir Toute la Journée',
    excerpt: 'Quelques astuces simples mais redoutables pour optimiser la longévité de votre sillage parfumé de luxe.',
    content: 'La tenue d\'un parfum dépend de sa concentration mais surtout de la façon de l\'appliquer. Le grand secret est d\'appliquer un corps gras comme de la vaseline neutre ou une crème non parfumée sur les points de pulsation (poignets, derrière l\'oreille, creux des coudes) avant d\'y vaporiser votre parfum Libre YSL ou Delina. Les molécules odorantes adhèrent majestueusement plus longtemps aux liants lipidiques, libérant le précieux sillage pendant des heures !',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    date: '2026-06-02',
    author: 'Amira Parfumier',
    readTime: '4 min'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9844',
    customerName: 'Samira Alaoui',
    customerPhone: '0612345678',
    customerCity: 'Casablanca',
    customerAddress: 'Anfa, Boulevard de l\'Océan, Résidence 4B',
    items: [
      { productId: 'prod-4', productName: 'Dior Addict Lip Glow Oil (TikTok Viral)', price: 390, quantity: 1, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600' },
      { productId: 'prod-3', productName: 'Sérum Éclat Vitamine C (Inspiration Mercadona)', price: 95, quantity: 2, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600' }
    ],
    totalPrice: 580,
    shippingFee: 20,
    status: 'En attente',
    date: '2026-06-09T08:30:00Z',
    paymentMethod: 'Paiement à la livraison'
  },
  {
    id: 'ORD-7633',
    customerName: 'Nawal Laroui',
    customerPhone: '0677112233',
    customerCity: 'Rabat',
    customerAddress: 'Hay Riad, Avenue des Palmiers, Villa 15',
    items: [
      { productId: 'prod-1', productName: 'YSL Libre Eau de Parfum (Inspiration Europe)', price: 950, quantity: 1, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600' }
    ],
    totalPrice: 980,
    shippingFee: 30,
    status: 'Confirmée',
    date: '2026-06-08T15:20:00Z',
    paymentMethod: 'Paiement à la livraison'
  }
];

const INITIAL_SOURCING: SourcingRequest[] = [
  {
    id: 'REQ-101',
    productName: 'Ensemble Shein Tweed Rose Pailleté',
    description: 'Ensemble veste en tweed rose avec boutons en fausses perles et jupe plissée de style coréen.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    colorOrSize: 'Taille M / Rose Poudre',
    quantity: 1,
    status: 'En recherche',
    date: '2026-06-09T09:15:00Z',
    customerName: 'Salma El Fassi',
    customerPhone: '0654321098',
    customerCity: 'Marrakech'
  }
];

// Helper and store manager
export class LocalDB {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
    return defaultValue;
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }

  static getProducts(): Product[] {
    return this.get<Product[]>('pnd_products', INITIAL_PRODUCTS);
  }

  static saveProducts(products: Product[]): void {
    this.set('pnd_products', products);
  }

  static getReviews(): Review[] {
    return this.get<Review[]>('pnd_reviews', INITIAL_REVIEWS);
  }

  static saveReviews(reviews: Review[]): void {
    this.set('pnd_reviews', reviews);
  }

  static getCoupons(): Coupon[] {
    return this.get<Coupon[]>('pnd_coupons', INITIAL_COUPONS);
  }

  static saveCoupons(coupons: Coupon[]): void {
    this.set('pnd_coupons', coupons);
  }

  static getShippingFees(): ShippingFee[] {
    return this.get<ShippingFee[]>('pnd_shipping_fees', INITIAL_SHIPPING_FEES);
  }

  static saveShippingFees(fees: ShippingFee[]): void {
    this.set('pnd_shipping_fees', fees);
  }

  static getOrders(): Order[] {
    return this.get<Order[]>('pnd_orders', INITIAL_ORDERS);
  }

  static saveOrders(orders: Order[]): void {
    this.set('pnd_orders', orders);
  }

  static getSourcingRequests(): SourcingRequest[] {
    return this.get<SourcingRequest[]>('pnd_sourcing', INITIAL_SOURCING);
  }

  static saveSourcingRequests(requests: SourcingRequest[]): void {
    this.set('pnd_sourcing', requests);
  }

  static getFAQ(): FAQItem[] {
    return this.get<FAQItem[]>('pnd_faq', INITIAL_FAQS);
  }

  static saveFAQ(faqs: FAQItem[]): void {
    this.set('pnd_faq', faqs);
  }

  static getBlogs(): BlogPost[] {
    return this.get<BlogPost[]>('pnd_blogs', INITIAL_BLOGS);
  }

  static saveBlogs(blogs: BlogPost[]): void {
    this.set('pnd_blogs', blogs);
  }

  static getClients(): Client[] {
    // Generate derived client list based on orders for consistency, but also save
    const orders = this.getOrders();
    const clientsMap = new Map<string, Client>();

    orders.forEach(ord => {
      const key = ord.customerPhone;
      if (clientsMap.has(key)) {
        const cl = clientsMap.get(key)!;
        cl.ordersCount += 1;
        cl.totalSpent += ord.totalPrice;
      } else {
        clientsMap.set(key, {
          id: `cli-${key}`,
          name: ord.customerName,
          phone: ord.customerPhone,
          city: ord.customerCity,
          ordersCount: 1,
          totalSpent: ord.totalPrice
        });
      }
    });

    return Array.from(clientsMap.values());
  }
}
