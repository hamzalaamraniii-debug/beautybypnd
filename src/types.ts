export interface Product {
  id: string;
  name: string;
  category: 'Parfums' | 'Cosmétiques' | 'Sacs' | 'Montres' | 'Vêtements';
  price: number; // in DH
  originalPrice?: number; // for promo/discount items, in DH
  stock: number;
  image: string;
  description: string;
  rating: number; // e.g. 4.8
  viewsCount?: number; // for "TikTok viraux"
  tag?: 'Nouveau' | 'Promo' | 'Best' | 'TikTok' | 'Flash' | 'Pack' | 'Limité';
  inspiration?: 'Shein' | 'Action' | 'Mercadona' | 'Europe' | 'Aucune';
  collection?: 'Été' | 'Hiver' | 'Aucune';
  isTikToK?: boolean;
  isCustomIdea?: boolean;
  reviewsCount?: number;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface SourcingRequest {
  id: string;
  productName: string;
  description: string;
  image?: string; // Data URL or external link
  colorOrSize?: string;
  quantity: number;
  status: 'En attente' | 'En recherche' | 'Trouvé' | 'Livré';
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  shippingFee: number;
  couponApplied?: string;
  status: 'En attente' | 'Confirmée' | 'En cours d\'expédition' | 'Livrée' | 'Annulée';
  date: string;
  paymentMethod: 'Paiement à la livraison';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
}

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  value: number; // discount amount/percent
  minOrderAmount?: number; // in DH
  active: boolean;
}

export interface ShippingFee {
  city: string;
  fee: number; // in DH
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}
