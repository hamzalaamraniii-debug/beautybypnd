import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, Heart, ShoppingBag, SlidersHorizontal, Check, RefreshCw, Sparkles, Star, Eye } from 'lucide-react';

interface BoutiqueProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  wishlistIds: string[];
  initialCategory?: string;
}

export default function Boutique({
  products,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  initialCategory = 'Tous'
}: BoutiqueProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Custom Filter Tags (matching sections in requirements)
  const [filterTag, setFilterTag] = useState<'Tous' | 'Nouveau' | 'Promo' | 'Best' | 'TikTok' | 'Pack' | 'Limité'>('Tous');
  const [filterInspiration, setFilterInspiration] = useState<'Toutes' | 'Shein' | 'Action' | 'Mercadona' | 'Europe'>('Toutes');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [showFilters, setShowFilters] = useState(false);

  // Categories list
  const categories = ['Tous', 'Parfums', 'Cosmétiques', 'Sacs', 'Montres', 'Vêtements'];

  // Refined filter mechanism
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Text Search
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      
      // 2. Category
      const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;

      // 3. Tag
      const matchesTag = filterTag === 'Tous' || p.tag === filterTag;

      // 4. Inspiration
      const matchesInspiration = filterInspiration === 'Toutes' || p.inspiration === filterInspiration;

      // 5. Price
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesTag && matchesInspiration && matchesPrice;
    });
  }, [products, search, selectedCategory, filterTag, filterInspiration, minPrice, maxPrice]);

  return (
    <div className="space-y-6" id="boutique-container">
      {/* Search and Advanced filter toggle */}
      <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher un parfum, une marque, un sac, etc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-rose-100 bg-[#fffbfc] text-zinc-800 pl-11 pr-4 py-3 text-xs focus:border-rose-400 focus:outline-none placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                showFilters 
                  ? 'border-rose-400 bg-rose-50 text-rose-700' 
                  : 'border-rose-100 bg-rose-50 text-zinc-800 hover:bg-rose-100'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-rose-500" />
              <span>Plus de filtres</span>
              {(filterTag !== 'Tous' || filterInspiration !== 'Toutes' || minPrice > 0 || maxPrice < 1500) && (
                <span className="ml-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
            
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('Tous');
                setFilterTag('Tous');
                setFilterInspiration('Toutes');
                setMinPrice(0);
                setMaxPrice(1500);
              }}
              className="rounded-xl border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Categories Fast Filter Row */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-rose-100 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-rose-50 text-zinc-700 hover:bg-rose-100/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expandable Advanced Filters Box */}
        {showFilters && (
          <div className="mt-4 grid gap-5 border-t border-rose-100 pt-4 sm:grid-cols-3">
            {/* Tag Selection */}
            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Sélection thématique
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'Tous', label: 'Toutes Sélections' },
                  { id: 'Nouveau', label: 'Nouveautés' },
                  { id: 'Promo', label: 'Promotions' },
                  { id: 'Best', label: 'Best Sellers' },
                  { id: 'TikTok', label: 'Viraux TikTok' },
                  { id: 'Pack', label: 'Packs Cadeaux' },
                  { id: 'Limité', label: 'Stock Limité' }
                ].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setFilterTag(tag.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      filterTag === tag.id
                        ? 'bg-rose-500 text-white font-bold'
                        : 'border border-rose-100 bg-white text-zinc-750 hover:bg-rose-50'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inspiration and Origin */}
            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Inspirations & Provenance
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'Toutes', label: 'Toutes Inspirations' },
                  { id: 'Shein', label: 'Shein (Mode)' },
                  { id: 'Action', label: 'Action (Petits Prix)' },
                  { id: 'Mercadona', label: 'Mercadona (Soins)' },
                  { id: 'Europe', label: 'Tendance Europe' }
                ].map((insp) => (
                  <button
                    key={insp.id}
                    onClick={() => setFilterInspiration(insp.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      filterInspiration === insp.id
                        ? 'bg-rose-500 text-white font-bold'
                        : 'border border-rose-100 bg-white text-zinc-750 hover:bg-rose-50'
                    }`}
                  >
                    {insp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price budgets slider & presets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Budget d'Achat (DH)
                </span>
                <span className="font-mono text-xs font-extrabold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full shadow-xs">
                  {minPrice} - {maxPrice === 1500 ? '1500+' : `${maxPrice}`} DH
                </span>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxPrice(val);
                    if (val < minPrice) {
                      setMinPrice(0);
                    }
                  }}
                  className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                  <span>0 DH</span>
                  <span>750 DH</span>
                  <span>1500 DH+</span>
                </div>
              </div>

              {/* Range Presets buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'all', label: 'Tout voir', min: 0, max: 1500 },
                  { id: '99', label: 'Moins de 99 DH', min: 0, max: 99 },
                  { id: '100-299', label: '99 - 299 DH', min: 99, max: 299 },
                  { id: '300-599', label: '300 - 599 DH', min: 300, max: 599 },
                  { id: '600', label: 'Luxe (600+)', min: 600, max: 1500 }
                ].map((preset) => {
                  const isSelected = minPrice === preset.min && maxPrice === preset.max;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setMinPrice(preset.min);
                        setMaxPrice(preset.max);
                      }}
                      className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                        isSelected
                          ? 'bg-rose-500 text-white font-semibold shadow-xs'
                          : 'border border-rose-100 bg-white text-zinc-700 hover:bg-rose-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-rose-50 py-16 text-center shadow-xs">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-rose-300" />
          <h3 className="mt-4 font-serif text-lg font-bold text-zinc-900">Aucun produit ne correspond à vos filtres</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500">
            Essayez d'ajuster vos filtres de prix, thématique ou tapez un autre terme de recherche.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Tous');
              setFilterTag('Tous');
              setFilterInspiration('Toutes');
              setMinPrice(0);
              setMaxPrice(1500);
              setSearch('');
            }}
            className="mt-6 rounded-full bg-rose-500 hover:bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition"
          >
            Voir tous les articles
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4" id="boutique-products-grid">
          {filteredProducts.map((p) => {
            const isWish = wishlistIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-100 bg-white p-3 shadow-sm transition duration-300 hover:scale-[1.02] hover:border-rose-300 hover:shadow-md"
              >
                {/* Special Tags / Displayer */}
                {p.tag && p.tag !== 'TikTok' && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-rose-500 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {p.tag === 'Best' ? 'Best Seller' : p.tag === 'Limité' ? 'Stock Limité' : p.tag === 'Promo' ? 'Offre Spéciale' : p.tag}
                  </span>
                )}

                {/* TikTok Badge */}
                {p.tag === 'TikTok' && (
                  <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm border border-zinc-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    TikTok Viral
                  </span>
                )}

                {/* Inspiration Indicator */}
                {p.inspiration && p.inspiration !== 'Aucune' && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-50 border border-rose-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-600 shadow-sm">
                    {p.inspiration}
                  </span>
                )}

                {/* Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-rose-50/50">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 transition group-hover:opacity-100" />
                </div>

                {/* Title & Stats */}
                <div className="mt-4 flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                    {p.category}
                  </span>
                  
                  <h3 className="font-serif text-sm font-bold text-zinc-900 line-clamp-2 min-h-[40px] group-hover:text-rose-600 transition">
                    {p.name}
                  </h3>

                  {/* Stars / Reviews count */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-zinc-700">{p.rating}</span>
                    <span className="text-zinc-400 font-medium font-mono">({p.reviewsCount || 12})</span>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-rose-100 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-base font-extrabold text-rose-600">
                        {p.price} DH
                      </span>
                      {p.originalPrice && (
                        <span className="font-mono text-xs text-zinc-400 line-through">
                          {p.originalPrice} DH
                        </span>
                      )}
                    </div>
                    {/* Stock counter */}
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${p.stock > 0 ? 'text-[#10b981]' : 'text-rose-450'}`}>
                      {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Add to Wishlist */}
                    <button
                      onClick={() => onAddToWishlist(p)}
                      className={`rounded-xl border p-2.5 transition ${
                        isWish 
                          ? 'border-rose-300 bg-rose-100 text-rose-600' 
                          : 'border-rose-100 bg-rose-50/50 hover:bg-rose-100 text-rose-400'
                      }`}
                      title={isWish ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={`h-4.5 w-4.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={() => onAddToCart(p)}
                      disabled={p.stock === 0}
                      className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
