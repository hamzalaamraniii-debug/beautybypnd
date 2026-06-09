import React, { useMemo } from 'react';
import { Product, Review, FAQItem, BlogPost } from '../types';
import { Sparkles, Star, TrendingUp, Compass, ShoppingBag, Eye, Heart, ShieldCheck, Truck, RotateCcw, Award, MessageSquare, ChevronDown, ChevronUp, Clock, HelpCircle, ArrowRight } from 'lucide-react';

interface HomeProps {
  products: Product[];
  reviews: Review[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  wishlistIds: string[];
  onNavigate: (viewId: string, initialCat?: string) => void;
}

export default function Home({
  products,
  reviews,
  blogs,
  faqs,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  onNavigate
}: HomeProps) {
  // Memoized lists for sections in prompt
  const trendings = useMemo(() => products.filter(p => p.tag === 'Best').slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.filter(p => p.tag === 'Nouveau').slice(0, 4), [products]);
  const tiktokVirals = useMemo(() => products.filter(p => p.tag === 'TikTok').slice(0, 4), [products]);
  const cheap99 = useMemo(() => products.filter(p => p.price <= 99).slice(0, 4), [products]);
  const cheap199 = useMemo(() => products.filter(p => p.price > 99 && p.price <= 199).slice(0, 4), [products]);
  
  // Inspirations lists
  const sheinInsp = useMemo(() => products.filter(p => p.inspiration === 'Shein').slice(0, 4), [products]);
  const actionInsp = useMemo(() => products.filter(p => p.inspiration === 'Action').slice(0, 4), [products]);
  const mercadonaInsp = useMemo(() => products.filter(p => p.inspiration === 'Mercadona').slice(0, 4), [products]);
  const europeInsp = useMemo(() => products.filter(p => p.inspiration === 'Europe').slice(0, 4), [products]);

  // Faq state
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  // Main Category items helper
  const categoryShortcuts = [
    { name: 'Parfums', icon: '✨', count: products.filter(p => p.category === 'Parfums').length, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cosmétiques', icon: '💄', count: products.filter(p => p.category === 'Cosmétiques').length, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sacs', icon: '👜', count: products.filter(p => p.category === 'Sacs').length, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200' },
    { name: 'Montres', icon: '⌚', count: products.filter(p => p.category === 'Montres').length, img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200' },
    { name: 'Vêtements', icon: '👗', count: products.filter(p => p.category === 'Vêtements').length, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200' }
  ];

  const renderProductRow = (productList: Product[], rowTitle: string, subtitle?: string, viewTag?: string) => {
    if (productList.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
              {rowTitle}
            </h3>
            {subtitle && <p className="text-xs text-rose-900/75 font-semibold mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={() => onNavigate('boutique')}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-500 transition"
          >
            <span>Voir tout</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {productList.map((p) => {
            const isWish = wishlistIds.includes(p.id);
            return (
              <div 
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-100 bg-white p-3 shadow-sm transition duration-300 hover:scale-[1.02] hover:border-rose-300 hover:shadow-md"
              >
                {/* Tag pill */}
                {p.tag && (
                  <span className="absolute left-3.5 top-3.5 z-10 bg-rose-500 px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                    {p.tag === 'Best' ? 'Best Seller' : p.tag === 'Limité' ? 'Stock Limité' : p.tag === 'Promo' ? 'Promo' : p.tag}
                  </span>
                )}

                {/* Main image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-rose-50/50">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {p.isTikToK && (
                    <div className="absolute top-2 right-2 rounded bg-rose-600 px-1.5 py-0.5 text-[8px] text-white uppercase font-bold tracking-wider shadow-sm animate-pulse">
                      TikTok Viral
                    </div>
                  )}
                </div>

                {/* Rating details & Name */}
                <div className="mt-3 flex-1 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#c5a880]">
                    {p.category}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-zinc-805 line-clamp-2 min-h-[36px] group-hover:text-rose-600 transition">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-zinc-600">{p.rating}</span>
                  </div>
                </div>

                {/* Price fields */}
                <div className="mt-3 pt-2.5 border-t border-rose-100 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-sm font-extrabold text-rose-600">
                        {p.price} DH
                      </span>
                      {p.originalPrice && (
                        <span className="font-mono text-[11px] text-zinc-400 line-through">
                          {p.originalPrice} DH
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy/Wish button action */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onAddToWishlist(p)}
                      aria-label="Ajouter aux favoris"
                      className={`rounded-lg border p-2 transition ${
                        isWish 
                          ? 'border-rose-300 bg-rose-100 text-rose-600' 
                          : 'border-rose-100 bg-rose-50/40 text-rose-500 hover:bg-rose-100'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => onAddToCart(p)}
                      disabled={p.stock === 0}
                      className="flex-1 rounded-lg bg-rose-500 hover:bg-rose-600 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs transition hover:opacity-95 disabled:opacity-40"
                    >
                      {p.stock > 0 ? 'Ajouter' : 'Rupture'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12" id="home-view-container">
      {/* 1. Hero Luxury Banner Section */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-rose-50 shadow-md">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          {/* Slogan details and info */}
          <div className="p-8 sm:p-12 md:p-16 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-rose-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-600 shadow-xs">
              <Sparkles className="h-4 w-4 text-rose-500 animate-spin" />
              Boutique de Beauté Marocaine Sélective
            </span>
            
            <h2 className="font-serif text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl leading-tight">
              Sublimez Votre <br />
              <span className="text-rose-500">Beauté Divine</span>
            </h2>
            
            <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
              Découvrez notre sélection exclusive de parfums authentiques importés d'Europe, cosmétiques de grandes marques, sacs tendances et vêtements d'inspirations Shein & Action. Livraison express partout au Maroc !
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('boutique')}
                className="rounded-full bg-rose-500 hover:bg-rose-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:scale-[1.02]"
              >
                Visiter la Boutique
              </button>
              <button
                onClick={() => onNavigate('sourcing')}
                className="rounded-full border border-rose-200 bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-rose-700 hover:bg-rose-50 shadow-xs"
              >
                Sourcing Sur-Mesure
              </button>
            </div>
          </div>

          {/* Luxury background image mockup */}
          <div className="relative h-[250px] md:h-[450px] overflow-hidden bg-rose-100/10 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800"
              alt="Luxury cosmetic luxury mock"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            {/* Elegant Fade Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-transparent to-transparent md:bg-gradient-to-l" />
          </div>
        </div>
      </section>

      {/* 2. Beautiful Categories Shortcuts Circles */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block">
            L'élégance par univers
          </span>
          <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900">
            Explorer les univers Beauty by PND
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-6" id="categories-shortcuts">
          {categoryShortcuts.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigate('boutique', cat.name)}
              className="group flex cursor-pointer flex-col items-center space-y-2 select-none"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-rose-100 bg-rose-50 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-rose-500 group-hover:shadow-md">
                <img
                  src={cat.img}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 text-white font-bold text-xl">
                  {cat.icon}
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 group-hover:text-rose-600">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE PRODUCTS SUB-SECTIONS (Tendances, Nouveautés, Promos, TikTok) */}
      <section className="space-y-10">
        {renderProductRow(trendings, '🔥 Les Tendances du Moment', 'Les indispensables plébiscités par nos fidèles clients au Maroc')}
        {renderProductRow(newArrivals, '✨ Nouveautés de la Semaine', 'Dernières trouvailles exclusives importées directement d\'Europe')}
        {renderProductRow(tiktokVirals, '🦄 Produits Viraux TikTok', 'Les cosmétiques et astuces vus des millions de fois dénichés pour vous')}
      </section>

      {/* 4. BUDGET DEALS SECTIONS (Moins de 99 DH / Moins de 199 DH) */}
      <section className="rounded-3xl bg-rose-50 border border-rose-100 p-8 space-y-8 shadow-sm">
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Le luxe accessible au Maroc</span>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-zinc-900 mt-1">Sangles & Tarifs Doux</h3>
          <p className="text-xs text-zinc-500 mt-1">Faites-vous plaisir sans culpabiliser grâce à nos sections dédiées aux prix minis.</p>
        </div>

        <div className="space-y-8">
          {renderProductRow(cheap99, '🏷️ Moins de 99 DH', 'Des pépites beauté et soins à tout petit prix')}
          {renderProductRow(cheap199, '🎁 Moins de 199 DH', 'Cadeaux parfaits et accessoires indispensables pour parfaire votre routine')}
        </div>
      </section>

      {/* 5. INSPIRATIONS & ORIGINS (Shein, Action, Mercadona, Europe) */}
      <section className="space-y-10">
        <div className="border-t border-rose-pnd-100/10 pt-8">
          {renderProductRow(sheinInsp, '👗 Inspirations Shein (Mode Tendance)', 'Les vêtements, tuniques et ensembles d\'été les plus fashion')}
        </div>
        <div>
          {renderProductRow(actionInsp, '🎯 Inspirations Action (Petits Prix)', 'Accessoires de make-up astucieux et pinceaux ultra-doux')}
        </div>
        <div>
          {renderProductRow(mercadonaInsp, '🧼 Inspirations Mercadona (Soin d\'Espagne)', 'Les fameuses crèmes Sisbela et sérums espagnols tant demandés')}
        </div>
        <div>
          {renderProductRow(europeInsp, '🌍 Produits Tendance en Europe', 'Parfums d\'exception et soins exclusifs d\'officines européennes')}
        </div>
      </section>

      {/* 6. EXCLUSIVE Sourcing Service "Vous ne trouvez pas ?" */}
      <section className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-zinc-800 shadow-md sm:p-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose-300/5 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500">
            Service Sourcing sur demande
          </span>
          <h3 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">
            Vous ne trouvez pas l’article que vous recherchez au Maroc ?
          </h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Beauty By PND peut le rechercher pour vous ! Qu'il s'agisse d'un parfum de niche introuvable en magasin marocain, d'une tenue de créateur, d'un accessoire Shein précis ou d'un soin Mercadona. Indiquez nous simplement le nom de l'article avec sa photo !
          </p>

          <div className="grid gap-4 sm:grid-cols-4 text-xs font-medium text-zinc-700">
            <div className="bg-white p-3 rounded-xl border border-rose-100 text-center shadow-xs">
              <span className="text-rose-500 block font-bold text-sm mb-1">⏱️ Délai Estimé</span>
              7 à 15 jours maximum
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 text-center shadow-xs">
              <span className="text-rose-500 block font-bold text-sm mb-1">📦 Livraison</span>
              Paiement à la livraison
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 text-center shadow-xs">
              <span className="text-rose-500 block font-bold text-sm mb-1">💬 Canal</span>
              WhatsApp & En Ligne
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 text-center shadow-xs">
              <span className="text-rose-500 block font-bold text-sm mb-1">🔍 Recherche</span>
              Réseau Direct Europe
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('sourcing')}
              className="rounded-full bg-rose-500 hover:bg-rose-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:scale-[1.02] transition"
            >
              Demander un produit maintenant
            </button>
          </div>
        </div>
      </section>

      {/* 7. Blog Beauté highlights */}
      {blogs.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c5a880] block">Blog Beauté & Conseils</span>
            <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900 font-serif">Les Conseils de nos Expertes</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {blogs.map((b) => (
              <div 
                key={b.id} 
                onClick={() => onNavigate('blog')}
                className="group cursor-pointer flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-rose-100 bg-white p-4 shadow-sm hover:border-rose-300 hover:shadow-md transition duration-300"
              >
                <div className="h-40 sm:h-full w-full sm:w-40 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={b.image}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="h-3 w-3 text-rose-500" /> {b.readTime} de lecture
                    </span>
                    <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-zinc-600 line-clamp-2">
                      {b.excerpt}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">
                    {new Date(b.date).toLocaleDateString('fr-FR')} — Par {b.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Verified Reviews */}
      {reviews.length > 0 && (
        <section className="rounded-3xl bg-rose-50 border border-rose-100 p-8 space-y-6 shadow-xs">
          <div className="text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c5a880] block">Ce que disent nos clientes</span>
            <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900 font-serif">Avis de nos Beauties au Maroc</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl bg-white border border-rose-100 p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex gap-0.5 text-amber-500 mb-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-3">
                  <span className="text-xs font-bold text-zinc-800">{rev.customerName}</span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Achat vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Core Policy Guarantees */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-rose-100 bg-white p-6 text-center space-y-2 shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Truck className="h-5 w-5 text-rose-500" />
          </div>
          <h4 className="font-serif text-sm font-bold text-zinc-900">Livraison Rapide</h4>
          <p className="text-xs text-zinc-650">À domicile sur Casablanca (24h) et partout au Maroc (2-3 jours) avec suivi régulier.</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-6 text-center space-y-2 shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <RotateCcw className="h-5 w-5 text-rose-500" />
          </div>
          <h4 className="font-serif text-sm font-bold text-zinc-900">Politique de Retour</h4>
          <p className="text-xs text-zinc-650">Satisfait ou échangé sous 7 jours pour tout produit esthétique intact non ouvert.</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-6 text-center space-y-2 shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Award className="h-5 w-5 text-rose-500" />
          </div>
          <h4 className="font-serif text-sm font-bold text-zinc-900">Originalité Garantie</h4>
          <p className="text-xs text-zinc-650">Marques et parfums achetés directement auprès des distributeurs agréés européens.</p>
        </div>
      </section>

      {/* 10. Mini FAQ Summary Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h3 className="font-serif text-xl font-bold tracking-tight text-zinc-900 font-serif">Questions Fréquentes</h3>
          <p className="text-xs text-zinc-500 mt-1">Trouvez rapidement réponse à toutes vos préoccupations.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.slice(0, 3).map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="rounded-xl border border-rose-100 bg-white overflow-hidden shadow-xs transition"
              >
                <button
                  id={`home-faq-title-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold text-zinc-800 hover:bg-rose-50/40"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-rose-500" />
                    {item.question}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-rose-500" /> : <ChevronDown className="h-4 w-4 text-rose-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-rose-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <button
            onClick={() => onNavigate('faq')}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Voir toute la foire aux questions (FAQ)
          </button>
        </div>
      </section>
    </div>
  );
}
