import React from 'react';
import { ShoppingBag, Heart, User, Search, Sparkles, MessageSquare, Menu, X, HelpCircle, PhoneCall, Gift } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  isAdminLoggedIn,
  onAdminClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'boutique', label: 'Boutique' },
    { id: 'sourcing', label: 'Sourcing Sur-Mesure' },
    { id: 'blog', label: 'Blog & Conseils' },
    { id: 'suivi', label: 'Suivi de commande' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'À propos & Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100 bg-white/95 backdrop-blur-md">
      {/* Upper Info Bar */}
      <div className="flex h-9 w-full items-center justify-between bg-[#0c0a09] px-4 text-xs font-semibold text-rose-100 sm:px-8">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-3 w-3 text-gold-300 animate-pulse" />
          <span>Service client WhatsApp : <a href="https://wa.me/34631276315" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 underline">+34 631 27 63 15</a></span>
        </div>
        <div className="hidden items-center gap-4 md:flex text-[11px]">
          <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-gold-300" /> Parfums de Marque 100% Authentiques</span>
          <span className="h-3 w-[1px] bg-zinc-800"></span>
          <span className="flex items-center gap-1"><Gift className="h-3.5 w-3.5 text-gold-300" /> Cadeau offert dès 500 DH d'achat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold-600 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-zinc-950">
            Paiement à la livraison
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Mobile Toggle */}
        <button 
          id="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-rose-100 hover:bg-rose-pnd-100 md:hidden"
          aria-label="Menu principal"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo & Slogan */}
        <div 
          onClick={() => handleNavClick('accueil')} 
          className="flex cursor-pointer flex-col justify-center text-center select-none group"
        >
          <h1 className="font-logo text-2xl font-bold tracking-[0.18em] text-zinc-900 sm:text-3xl transition duration-300 group-hover:text-rose-500">
            BEAUTY <span className="text-rose-500 italic lowercase font-serif font-light tracking-normal">by</span> PND
          </h1>
          <p className="text-[9px] uppercase tracking-[0.35em] text-rose-400 font-bold -mt-0.5">
            L'élégance & la Beauté au Maroc
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {menuItems.map((item) => (
            <button
              id={`nav-btn-${item.id}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 hover:text-rose-500 ${
                currentView === item.id 
                  ? 'text-rose-500 font-black after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-rose-500' 
                  : 'text-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Sourcing shortcut */}
          <button
            id="sourcing-btn-shortcut"
            onClick={() => handleNavClick('sourcing')}
            className="hidden items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 lg:flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
            <span>Sourcing Sur-Mesure</span>
          </button>

          {/* Wishlists */}
          <button
            id="wishlist-btn-nav"
            onClick={onOpenWishlist}
            className="relative rounded-full p-2.5 text-zinc-700 hover:bg-rose-50 hover:text-rose-500 transition"
            title="Favoris"
          >
            <Heart className="h-5.5 w-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-pnd-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart triggers */}
          <button
            id="cart-btn-nav"
            onClick={onOpenCart}
            className="relative flex items-center gap-1 rounded-full p-2.5 text-zinc-700 hover:bg-rose-50 hover:text-rose-500 transition"
            title="Panier"
          >
            <ShoppingBag className="h-5.5 w-5.5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-pnd-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <span className="h-6 w-[1px] bg-rose-200 hidden sm:block"></span>

          {/* Admin Login Button */}
          <button
            id="admin-btn-nav"
            onClick={onAdminClick}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
              isAdminLoggedIn 
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <User className="h-4 w-4 text-rose-500" />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Admin Connecté' : 'Espace Admin'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-[116px] w-full border-b border-rose-100 bg-white px-6 py-5 shadow-2xl md:hidden">
          <ul className="space-y-3.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left text-sm font-extrabold uppercase tracking-wider py-2 border-b border-rose-50 block transition-colors ${
                    currentView === item.id ? 'text-rose-500 font-black' : 'text-zinc-700 hover:text-rose-500'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <button
                id="mobile-nav-sourcing-cta"
                onClick={() => handleNavClick('sourcing')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Demander un article (Sourcing)</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
