import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Boutique from './components/Boutique';
import SourcingForm from './components/SourcingForm';
import SourcingTracking from './components/SourcingTracking';
import BlogAndTips from './components/BlogAndTips';
import TrackingAndFaq from './components/TrackingAndFaq';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import { LocalDB, ADMIN_EMAIL, ADMIN_PASS, ADMIN_AUTH_KEY } from './data/store';
import { Product, Order, SourcingRequest, Coupon, ShippingFee, FAQItem, BlogPost, Review } from './types';
import { Sparkles, MessageSquare, Heart, X, ShoppingBag, Eye, Trash2, Send, ShieldAlert, CheckCircle, Mail, Key, User, Paintbrush, Check, Type } from 'lucide-react';

// Curated themes that Hamza (and clients) can switch between to preview the look live
const CURATED_THEMES = [
  {
    id: "velvet-rose",
    name: "🌸 Velvet Rose & Or",
    description: "La quintessence de l'ultra-féminité. Un accord sublime de framboise velvet poudrée, de crèmes d'amande blanches croustillantes et de reflets précieux or jaune champagne.",
    colors: {
      "--clr-gold-50": "#fff5f6",
      "--clr-gold-100": "#ffe4e6",
      "--clr-gold-200": "#fecdd3",
      "--clr-gold-300": "#e5a93b",
      "--clr-gold-400": "#c98e26",
      "--clr-gold-500": "#c5a880",
      "--clr-gold-600": "#aa7d33",
      "--clr-gold-700": "#7c5820",
      "--clr-rose-50": "#fff9fa",
      "--clr-rose-100": "#ffe8ec",
      "--clr-rose-200": "#fcccd6",
      "--clr-rose-300": "#f472b6",
      "--clr-rose-400": "#e14e7a",
      "--clr-rose-500": "#be123c",
      "--clr-rose-600": "#9f1239",
      "--clr-rose-700": "#881337",
      "--glow-gradient": "linear-gradient(135deg, #fbcfe8 0%, #be123c 50%, #e5a93b 100%)",
      "--rose-gold-gradient-bg": "linear-gradient(135deg, #ffffff 0%, #fff9fa 50%, #ffe8ec 100%)",
      "--text-gold-gradient-bg": "linear-gradient(135deg, #be123c 0%, #e5a93b 50%, #be123c 100%)"
    }
  },
  {
    id: "satin-gold",
    name: "✨ Satin Champagne & Gold",
    description: "Ambiance reine de Sicile. Tons chauds et pures de draps de soie ivoire nacrés, de sable de dunes dorées et d'accessoires de luxe en laiton brossé.",
    colors: {
      "--clr-gold-50": "#faf6f0",
      "--clr-gold-100": "#f4ebd9",
      "--clr-gold-200": "#e9d5bc",
      "--clr-gold-300": "#cca464",
      "--clr-gold-400": "#b3894b",
      "--clr-gold-500": "#aa8144",
      "--clr-gold-600": "#8c6530",
      "--clr-gold-700": "#63451e",
      "--clr-rose-50": "#faf8f2",
      "--clr-rose-100": "#f3eee2",
      "--clr-rose-200": "#e6dcc6",
      "--clr-rose-300": "#cca464",
      "--clr-rose-400": "#b3894b",
      "--clr-rose-500": "#aa8144",
      "--clr-rose-600": "#7d5c2a",
      "--clr-rose-700": "#5a411b",
      "--glow-gradient": "linear-gradient(135deg, #f3eee2 0%, #cca464 50%, #8c6530 100%)",
      "--rose-gold-gradient-bg": "linear-gradient(135deg, #ffffff 0%, #faf8f2 50%, #f3eee2 100%)",
      "--text-gold-gradient-bg": "linear-gradient(135deg, #aa8144 0%, #cca464 50%, #aa8144 100%)"
    }
  },
  {
    id: "royal-orchid",
    name: "🔮 Royal Orchid & Silver",
    description: "Délicat, doux et envoûtant. Un accord moderne de lilas provençal, de fuchsias impériaux d'Orient et d'effets satinés platinium scintillants.",
    colors: {
      "--clr-gold-50": "#fbf7ff",
      "--clr-gold-100": "#f3e8ff",
      "--clr-gold-200": "#e9d5ff",
      "--clr-gold-300": "#c084fc",
      "--clr-gold-400": "#a855f7",
      "--clr-gold-500": "#8b5cf6",
      "--clr-gold-600": "#7c3aed",
      "--clr-gold-700": "#6d28d9",
      "--clr-rose-50": "#faf5ff",
      "--clr-rose-100": "#f3e8ff",
      "--clr-rose-200": "#e9d8fd",
      "--clr-rose-300": "#d6bcfa",
      "--clr-rose-400": "#b794f4",
      "--clr-rose-500": "#702459",
      "--clr-rose-600": "#5b1747",
      "--clr-rose-700": "#440d33",
      "--glow-gradient": "linear-gradient(135deg, #f3e8ff 0%, #8b5cf6 50%, #702459 100%)",
      "--rose-gold-gradient-bg": "linear-gradient(135deg, #ffffff 0%, #faf5ff 50%, #f3e8ff 100%)",
      "--text-gold-gradient-bg": "linear-gradient(135deg, #702459 0%, #b794f4 50%, #702459 100%)"
    }
  },
  {
    id: "paris-obsidian",
    name: "🖤 Obsidian Couture Paris",
    description: "Le minimalisme ultime du Faubourg Saint-Honoré. Une structure noire d'obsidienne mate, blanc de coton pur et détails d'étiquettes en or noble.",
    colors: {
      "--clr-gold-50": "#fafaf9",
      "--clr-gold-100": "#f5f5f4",
      "--clr-gold-200": "#e7e5e4",
      "--clr-gold-300": "#bd9a55",
      "--clr-gold-400": "#a38240",
      "--clr-gold-500": "#bd9a55",
      "--clr-gold-600": "#78602e",
      "--clr-gold-700": "#4d3e1d",
      "--clr-rose-50": "#fafaf9",
      "--clr-rose-100": "#f5f5f4",
      "--clr-rose-200": "#e7e5e4",
      "--clr-rose-300": "#bd9a55",
      "--clr-rose-400": "#1c1917",
      "--clr-rose-500": "#1c1917",
      "--clr-rose-600": "#000000",
      "--clr-rose-700": "#000000",
      "--glow-gradient": "linear-gradient(135deg, #ffffff 0%, #1c1917 50%, #bd9a55 100%)",
      "--rose-gold-gradient-bg": "linear-gradient(135deg, #ffffff 0%, #f5f5f4 50%, #e7e5e4 100%)",
      "--text-gold-gradient-bg": "linear-gradient(135deg, #1c1917 0%, #bd9a55 50%, #1c1917 100%)"
    }
  }
];

// Curated fonts Hamza can select for the Title / Logo BRAND font
const LOGO_FONTS = [
  { id: "Cinzel", name: "Cinzel (Classique Luxe Bvlgari)", stack: '"Cinzel", "Playfair Display", Georgia, serif' },
  { id: "Great Vibes", name: "Great Vibes (Calligraphie de Rêve)", stack: '"Great Vibes", "Alex Brush", cursive, serif' },
  { id: "Alex Brush", name: "Alex Brush (Cursive Couture Girly)", stack: '"Alex Brush", "Playfair Display", cursive, serif' },
  { id: "Playfair Display", name: "Playfair Display (Moderne Vogue)", stack: '"Playfair Display", Georgia, serif' },
  { id: "Cormorant Garamond", name: "Cormorant Garamond (Sérif Impérial)", stack: '"Cormorant Garamond", Georgia, serif' }
];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('accueil');
  const [initialBoutiqueCat, setInitialBoutiqueCat] = useState<string>('Tous');

  // Database State (instantly synced with localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sourcingRequests, setSourcingRequests] = useState<SourcingRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shippingFees, setShippingFees] = useState<ShippingFee[]>([]);

  // Interactive Client Shopping State
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  // Controls overlays/modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('velvet-rose');
  const [activeLogoFont, setActiveLogoFont] = useState('Cinzel');
  
  // Custom Success banners
  const [successBanner, setSuccessBanner] = useState<{ message: string; sub?: string } | null>(null);

  // Secure Admin Authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Initial Database Loader
  const loadDatabase = () => {
    setProducts(LocalDB.getProducts());
    setReviews(LocalDB.getReviews());
    setBlogs(LocalDB.getBlogs());
    setFaqs(LocalDB.getFAQ());
    setOrders(LocalDB.getOrders());
    setSourcingRequests(LocalDB.getSourcingRequests());
    setCoupons(LocalDB.getCoupons());
    setShippingFees(LocalDB.getShippingFees());
  };

  const applyThemeColorsAndFont = (themeId: string, fontId: string) => {
    const themeObj = CURATED_THEMES.find(t => t.id === themeId) || CURATED_THEMES[0];
    const fontObj = LOGO_FONTS.find(f => f.id === fontId) || LOGO_FONTS[0];

    // Apply colors to document root
    Object.entries(themeObj.colors).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });

    // Apply font
    document.documentElement.style.setProperty('--font-logo-var', fontObj.stack);
  };

  useEffect(() => {
    loadDatabase();

    // Load theme & font settings from localStorage or defaults
    const savedTheme = localStorage.getItem('pnd_active_theme') || 'velvet-rose';
    const savedFont = localStorage.getItem('pnd_logo_font') || 'Cinzel';
    setActiveTheme(savedTheme);
    setActiveLogoFont(savedFont);
    applyThemeColorsAndFont(savedTheme, savedFont);

    // Check existing auth in storage
    const authed = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (authed === 'true') {
      setIsAdminLoggedIn(true);
    }

    // Load persistent wishlist / cart
    const savedWish = localStorage.getItem('pnd_wishlist');
    if (savedWish) {
      setWishlistIds(JSON.parse(savedWish));
    }

    const savedCart = localStorage.getItem('pnd_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    applyThemeColorsAndFont(themeId, activeLogoFont);
    localStorage.setItem('pnd_active_theme', themeId);
  };

  const handleSelectFont = (fontId: string) => {
    setActiveLogoFont(fontId);
    applyThemeColorsAndFont(activeTheme, fontId);
    localStorage.setItem('pnd_logo_font', fontId);
  };

  // Sync core changes back
  const handleRefreshCore = () => {
    loadDatabase();
  };

  // Nav helper
  const handleNavigate = (viewId: string, initialCat?: string) => {
    if (initialCat) {
      setInitialBoutiqueCat(initialCat);
    } else {
      setInitialBoutiqueCat('Tous');
    }
    // Automatically switch down if from admin panel, back to public
    setCurrentView(viewId);
    window.scrollTo(0, 0);
  };

  // Cart Add and update functions
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Cet article est malheureusement épuisé.");
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let updated;
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Limite de stock disponible (${product.stock} pièces) atteinte.`);
          return prev;
        }
        updated = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      localStorage.setItem('pnd_cart', JSON.stringify(updated));
      return updated;
    });

    // Notify beautiful success bubble
    setSuccessBanner({
      message: "Produit ajouté avec succès au panier !",
      sub: `${product.name} — Prêt pour la commande.`
    });
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  const handleUpdateCartQty = (prodId: string, nextQty: number) => {
    if (nextQty <= 0) {
      handleRemoveFromCart(prodId);
      return;
    }
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.product.id === prodId ? { ...item, quantity: nextQty } : item
      );
      localStorage.setItem('pnd_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (prodId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.product.id !== prodId);
      localStorage.setItem('pnd_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('pnd_cart');
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const updated = prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id];
      localStorage.setItem('pnd_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Order Placement callback
  const handleOrderPlaced = (order: Order) => {
    // Reload items to update stocks on screen
    loadDatabase();
    setSuccessBanner({
      message: `Félicitations, commande ${order.id} validée !`,
      sub: "Veuillez cliquer pour envoyer votre panier sur WhatsApp."
    });
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Admin authentication handlers
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminEmailInput === ADMIN_EMAIL && adminPassInput === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setCurrentView('admin-dashboard');
      setAdminEmailInput('');
      setAdminPassInput('');
    } else {
      setLoginError('Identifiant ou mot de passe administratif incorrect.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setCurrentView('accueil');
  };

  // Route router element mapping
  const renderViewContent = () => {
    switch (currentView) {
      case 'accueil':
        return (
          <Home
            products={products}
            reviews={reviews}
            blogs={blogs}
            faqs={faqs}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigate={handleNavigate}
          />
        );
      
      case 'boutique':
        return (
          <Boutique
            products={products}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            initialCategory={initialBoutiqueCat}
          />
        );

      case 'sourcing':
        return (
          <div className="space-y-12">
            <SourcingForm onSuccess={() => handleRefreshCore()} />
            <SourcingTracking requests={sourcingRequests} onNewRequestClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
          </div>
        );

      case 'blog':
        return <BlogAndTips blogs={blogs} />;

      case 'suivi':
      case 'faq':
      case 'contact':
        return <TrackingAndFaq faqs={faqs} />;

      case 'admin-login':
        return (
          <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-white p-8 shadow-xl text-center space-y-6" id="admin-login-box">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <ShieldAlert className="h-7 w-7" />
            </div>
            
            <div>
              <h3 className="font-serif text-2xl font-extrabold text-zinc-900">Espace Privé Administrateur</h3>
              <p className="text-xs text-zinc-400 mt-1">Authentification protégée requise.</p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs font-semibold text-left">
              <div>
                <label className="block mb-1.5 text-zinc-700 uppercase tracking-widest text-[10px] font-bold">Email Administrateur</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@beautybypnd.com"
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 pl-10 pr-4 py-3 placeholder:text-zinc-300 font-medium focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-zinc-700 uppercase tracking-widest text-[10px] font-bold">Mot de Passe Unique</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••"
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 pl-10 pr-4 py-3 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {loginError && <p className="text-[10px] text-rose-500 font-extrabold">{loginError}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-rose-500 hover:bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95"
              >
                Se connecter en sécurité
              </button>
            </form>
          </div>
        );

      case 'admin-dashboard':
        if (!isAdminLoggedIn) {
          return <p className="text-center font-bold text-rose-500 py-12">Accès non autorisé.</p>;
        }
        return (
          <AdminPanel
            onLogout={handleAdminLogout}
            products={products}
            orders={orders}
            sourcingRequests={sourcingRequests}
            coupons={coupons}
            shippingFees={shippingFees}
            onRefreshDB={handleRefreshCore}
          />
        );

      default:
        return <p className="text-center py-10 font-mono text-zinc-400">Section non trouvée.</p>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffcfc] text-zinc-850" id="main-applicative-body">
      {/* 1. Header Navigation elements */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => {
          if (v === 'admin-dashboard') {
            if (isAdminLoggedIn) {
              setCurrentView('admin-dashboard');
            } else {
              setCurrentView('admin-login');
            }
          } else {
            setCurrentView(v);
          }
          window.scrollTo(0,0);
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => {
          if (isAdminLoggedIn) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('admin-login');
          }
          window.scrollTo(0,0);
        }}
      />

      {/* 2. Success Banner Pop-up toast */}
      {successBanner && (
        <div className="fixed bottom-24 right-6 z-50 rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl flex gap-3 max-w-sm animate-bounce animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0">
            <CheckCircle className="h-5.5 w-5.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">{successBanner.message}</h4>
            <p className="text-[10px] text-zinc-550 mt-0.5">{successBanner.sub}</p>
          </div>
        </div>
      )}

      {/* 3. Core dynamic workspace section */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        {renderViewContent()}
      </main>

      {/* 4. Sliding cart drawer and overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        shippingFees={shippingFees}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 5. Custom Quick Wishlist sidebar modal overlay */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-modal-backdrop">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsWishlistOpen(false)} />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white border-l border-rose-pnd-100 p-6 shadow-2xl flex flex-col justify-between text-zinc-800">
              <div className="flex justify-between items-center border-b border-rose-pnd-100/30 pb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-pnd-500 fill-rose-pnd-500" />
                  <h3 className="font-serif text-lg font-extrabold text-zinc-900">Ma Liste de Souhaits ({wishlistIds.length})</h3>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} className="rounded-full p-1 text-zinc-400 hover:bg-rose-pnd-50"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {wishlistIds.length === 0 ? (
                  <p className="text-center text-xs text-zinc-400 py-12">Aucun coup de cœur pour le moment.</p>
                ) : (
                  products
                    .filter(p => wishlistIds.includes(p.id))
                    .map(p => (
                      <div key={p.id} className="flex gap-3 justify-between items-center rounded-xl border border-rose-pnd-100 p-2 bg-rose-pnd-50/50">
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="h-12 w-12 object-cover rounded-lg" />
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                          <p className="font-mono text-rose-pnd-500 font-bold mt-0.5">{p.price} DH</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              handleAddToCart(p);
                              setIsWishlistOpen(false);
                            }}
                            className="bg-rose-pnd-500 hover:bg-rose-pnd-600 text-white p-1.5 rounded-lg text-xs font-bold"
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleToggleWishlist(p)} className="text-zinc-400 hover:text-rose-pnd-500 p-1.5">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.5 Floating Aesthetic Customizer Button (Bottom-Left) */}
      <button
        onClick={() => setIsCustomizerOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-5 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        title="Personnalisez le design de votre boutique"
      >
        <Paintbrush className="h-5 w-5 animate-pulse text-rose-50" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Aesthetic Studio</span>
        <span className="text-xs font-bold uppercase tracking-wider md:hidden">Design</span>
      </button>

      {/* 5.6 Aesthetic customization suite drawer */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="customizer-modal-backdrop">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsCustomizerOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex max-w-full">
            <div className="w-screen max-w-md bg-white border-r border-rose-100 p-6 shadow-2xl flex flex-col justify-between text-zinc-800 animate-slide-in">
              <div className="flex justify-between items-center border-b border-rose-100/30 pb-4">
                <div className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5 text-rose-500" />
                  <h3 className="font-serif text-lg font-extrabold text-zinc-900">Studio d'Élégance Visuelle</h3>
                </div>
                <button onClick={() => setIsCustomizerOpen(false)} className="rounded-full p-1 text-zinc-400 hover:bg-rose-50"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-5 space-y-6">
                <div>
                  <h4 className="text-xs font-extrabold tracking-widest text-rose-500 uppercase mb-1">Choix des Couleurs & Thème</h4>
                  <p className="text-[11px] text-zinc-500 mb-4">Cliquez sur un univers pour l'appliquer instantanément sur toute la boutique et convaincre vos clientes d'acheter !</p>
                  
                  <div className="space-y-3">
                    {CURATED_THEMES.map((theme) => {
                      const isSelected = activeTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleSelectTheme(theme.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border-2 transition duration-200 flex gap-3 relative items-start ${
                            isSelected 
                              ? 'border-rose-500 bg-rose-50/40 shadow-xs' 
                              : 'border-zinc-100 bg-zinc-50/50 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-zinc-900">{theme.name}</span>
                              {isSelected && (
                                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Actif</span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{theme.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 pt-1">
                            <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: theme.colors["--clr-rose-500"] }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: theme.colors["--clr-gold-300"] }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: theme.colors["--clr-rose-100"] }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-5">
                  <h4 className="text-xs font-extrabold tracking-widest text-rose-500 uppercase mb-1">Police du Logo (Beauty By PND)</h4>
                  <p className="text-[11px] text-zinc-500 mb-4">Sélectionnez la typographie du logo pour l'adapter au style que vous préférez.</p>
                  
                  <div className="space-y-2">
                    {LOGO_FONTS.map((font) => {
                      const isSelected = activeLogoFont === font.id;
                      return (
                        <button
                          key={font.id}
                          onClick={() => handleSelectFont(font.id)}
                          className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                            isSelected 
                              ? 'border-rose-500 bg-rose-50 rounded-xl text-rose-700' 
                              : 'border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{font.name}</p>
                            <p className="text-[14px] mt-1 text-zinc-800" style={{ fontFamily: font.stack }}>
                              BEAUTY by PND
                            </p>
                          </div>
                          {isSelected && <Check className="h-4.5 w-4.5 text-rose-550" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 mt-2">
                <button
                  onClick={() => {
                    setIsCustomizerOpen(false);
                    setSuccessBanner({
                      message: "Style enregistré avec succès !",
                      sub: "Ce magnifique design esthétique restera actif sur votre boutique."
                    });
                    setTimeout(() => setSuccessBanner(null), 3500);
                  }}
                  className="w-full bg-rose-550 hover:bg-rose-600 font-bold uppercase tracking-wider text-white text-xs py-3 rounded-xl shadow-md transition"
                >
                  Confirmer mon Design
                </button>
                <p className="text-center text-[9px] text-zinc-400 mt-2 font-bold uppercase tracking-widest">
                  Beauty By PND Customizer Suite
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Professional Floating WhatsApp Widget Button */}
      <a
        id="floating-whatsapp-widget"
        href="https://wa.me/34631276315?text=Bonjour%20Beauty%20By%20PND,%20je%20souhaite%20des%20conseils%20ou%20faire%20un%20sourcing%20!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition hover:scale-110 hover:rotate-6 shadow-emerald-500/20"
        title="Discutez en direct sur WhatsApp avec notre équipe"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </a>

      {/* 7. Visually Elegant Footer */}
      <footer className="border-t border-rose-100 bg-rose-50 py-12 block">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 grid gap-8 md:grid-cols-4 text-xs font-medium text-rose-900/80">
          <div className="space-y-4">
            <h1 className="font-logo text-xl font-bold tracking-[0.18em] text-rose-500">
              BEAUTY <span className="italic lowercase font-serif font-light tracking-normal">by</span> PND
            </h1>
            <p className="leading-relaxed text-rose-900/70">
              Le secret par excellence des cosmétiques de marques internationales, des parfums sélectifs d'Europe et de la mode tendance au Maroc.
            </p>
            <p className="text-[10px] text-rose-900/50">© 2026 Beauty By PND. Tous droits réservés.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-rose-950">Nos Univers</h4>
            <ul className="space-y-2 text-rose-900/60 font-semibold">
              <li><button onClick={() => handleNavigate('boutique', 'Parfums')} className="hover:text-rose-pnd-500">Parfums de Luxe</button></li>
              <li><button onClick={() => handleNavigate('boutique', 'Cosmétiques')} className="hover:text-rose-pnd-500">Cosmétiques & Soins</button></li>
              <li><button onClick={() => handleNavigate('boutique', 'Sacs')} className="hover:text-rose-pnd-500">Sacs de Marque</button></li>
              <li><button onClick={() => handleNavigate('boutique', 'Vêtements')} className="hover:text-rose-pnd-500">Prêt-à-porter Chic</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-rose-950">Sourcing sur demande</h4>
            <ul className="space-y-2 text-rose-900/60 font-semibold">
              <li><button onClick={() => handleNavigate('sourcing')} className="hover:text-rose-pnd-500">Créer une Demande Sourcing</button></li>
              <li><button onClick={() => handleNavigate('sourcing')} className="hover:text-rose-pnd-500">Demandes en cours d'achat</button></li>
              <li><button onClick={() => handleNavigate('suivi')} className="hover:text-rose-pnd-500">Suivi Colis en Ligne</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-rose-300">Horaires & Service Client</h4>
            <p className="leading-relaxed text-zinc-600">
              Lundi - Samedi : 09:00 — 20:00
              <br />
              Dimanche : Fermé
              <br /><br />
              Assistance direct par N° :  
              <a href="https://wa.me/34631276315" className="text-zinc-900 font-bold hover:underline ml-1">+34 631 27 63 15</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
