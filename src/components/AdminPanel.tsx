import React, { useState, useMemo } from 'react';
import { Product, Order, SourcingRequest, Client, Coupon, ShippingFee, Review } from '../types';
import { LocalDB, ADMIN_EMAIL, ADMIN_PASS, ADMIN_AUTH_KEY } from '../data/store';
import { 
  BarChart2, Package, ShoppingBag, Users, Sparkles, Tag, Check, X, Edit, Plus, Trash2, 
  Settings, LogOut, ArrowUpRight, TrendingUp, DollarSign, Clock, CheckCircle, RotateCcw, FileSpreadsheet, Gift, ShieldAlert, AlertTriangle, PhoneCall 
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  products: Product[];
  orders: Order[];
  sourcingRequests: SourcingRequest[];
  coupons: Coupon[];
  shippingFees: ShippingFee[];
  onRefreshDB: () => void;
}

export default function AdminPanel({
  onLogout,
  products,
  orders,
  sourcingRequests,
  coupons,
  shippingFees,
  onRefreshDB
}: AdminPanelProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'stock' | 'orders' | 'clients' | 'sourcing' | 'coupons'>('dashboard');

  // Products state & modals
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Add Product Form inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Parfums' | 'Cosmétiques' | 'Sacs' | 'Montres' | 'Vêtements'>('Parfums');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdTag, setNewProdTag] = useState<'Nouveau' | 'Promo' | 'Best' | 'TikTok' | 'Flash' | 'Pack' | 'Limité' | ''>('');
  const [newProdInspiration, setNewProdInspiration] = useState<'Shein' | 'Action' | 'Mercadona' | 'Europe' | 'Aucune'>('Aucune');

  // Coupon inputs
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(0);

  // Ship fee inputs (Casablanca edit)
  const [editingCityFee, setEditingCityFee] = useState<string | null>(null);
  const [editingFeeValue, setEditingFeeValue] = useState(20);

  // Notifications live alert bar
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.status === 'En attente').length, [orders]);
  const pendingSourcingCount = useMemo(() => sourcingRequests.filter(s => s.status === 'En attente').length, [sourcingRequests]);

  // Statistics calculation helpers
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== 'Annulée')
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }, [orders]);

  const salesByCity = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      if (o.status !== 'Annulée') {
        map[o.customerCity] = (map[o.customerCity] || 0) + o.totalPrice;
      }
    });
    return map;
  }, [orders]);

  // Derived Client list
  const clientList = useMemo(() => {
    return LocalDB.getClients();
  }, [orders]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  // Handle Order Status Mutation
  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const all = LocalDB.getOrders();
    const updated = all.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });
    LocalDB.saveOrders(updated);
    onRefreshDB();
  };

  // Handle Sourcing Status Mutation
  const handleUpdateSourcingStatus = (reqId: string, nextStatus: SourcingRequest['status']) => {
    const all = LocalDB.getSourcingRequests();
    const updated = all.map(r => {
      if (r.id === reqId) {
        return { ...r, status: nextStatus };
      }
      return r;
    });
    LocalDB.saveSourcingRequests(updated);
    onRefreshDB();
  };

  // Export Orders as CSV file representation
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID Commande,Date,Client,Telephone,Ville,Adresse,Total (DH),Frais Port (DH),Statut,Articles\n";
      
      orders.forEach(o => {
        const itemNames = o.items.map(i => `${i.productName} (x${i.quantity})`).join(' | ');
        const row = [
          o.id,
          new Date(o.date).toLocaleDateString('fr-FR'),
          o.customerName.replace(/,/g, ' '),
          o.customerPhone,
          o.customerCity,
          o.customerAddress.replace(/,/g, ' '),
          o.totalPrice,
          o.shippingFee,
          o.status,
          itemNames.replace(/,/g, ' ')
        ].join(',');
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `BeautyByPND_Commandes_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Erreur lors de l'export des commandes.");
    }
  };

  // Delete product action handles
  const handleDeleteProduct = (prodId: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet article de la boutique ?")) {
      const all = LocalDB.getProducts();
      const next = all.filter(p => p.id !== prodId);
      LocalDB.saveProducts(next);
      onRefreshDB();
    }
  };

  // Add Product Action
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdImage) {
      alert("Le nom et l'image du produit sont indispensables.");
      return;
    }

    const newProd: Product = {
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: newProdOriginalPrice ? Number(newProdOriginalPrice) : undefined,
      stock: Number(newProdStock),
      image: newProdImage,
      description: newProdDesc || "Aucune description.",
      rating: 4.8,
      reviewsCount: 1,
      tag: newProdTag ? newProdTag as any : undefined,
      inspiration: newProdInspiration,
      collection: 'Aucune'
    };

    const all = LocalDB.getProducts();
    LocalDB.saveProducts([newProd, ...all]);
    onRefreshDB();

    // Reset Inputs
    setNewProdName('');
    setNewProdImage('');
    setNewProdPrice(0);
    setNewProdOriginalPrice('');
    setNewProdDesc('');
    setNewProdTag('');
    setIsAddFormOpen(false);
  };

  // Stock instant quick adjustment helper
  const handleStockAdj = (prodId: string, delta: number) => {
    const all = LocalDB.getProducts();
    const updated = all.map(p => {
      if (p.id === prodId) {
        const next = p.stock + delta;
        return { ...p, stock: next < 0 ? 0 : next };
      }
      return p;
    });
    LocalDB.saveProducts(updated);
    onRefreshDB();
  };

  // Create Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    if (!code) return;

    const all = LocalDB.getCoupons();
    if (all.some(c => c.code === code)) {
      alert("Ce code promo existe déjà !");
      return;
    }

    const newCp: Coupon = {
      code,
      discountType: newCouponType,
      value: Number(newCouponValue),
      minOrderAmount: newCouponMin ? Number(newCouponMin) : undefined,
      active: true
    };

    LocalDB.saveCoupons([newCp, ...all]);
    onRefreshDB();

    setNewCouponCode('');
    setNewCouponMin(0);
    setNewCouponValue(10);
  };

  // Toggle Coupon active/inactive status
  const toggleCouponStatus = (code: string) => {
    const all = LocalDB.getCoupons();
    const next = all.map(c => {
      if (c.code === code) {
        return { ...c, active: !c.active };
      }
      return c;
    });
    LocalDB.saveCoupons(next);
    onRefreshDB();
  };

  // Delete Coupon
  const handleDeleteCoupon = (code: string) => {
    const all = LocalDB.getCoupons();
    const next = all.filter(c => c.code !== code);
    LocalDB.saveCoupons(next);
    onRefreshDB();
  };

  // Edit City shipping fee
  const handleSaveCityFee = (city: string) => {
    const all = LocalDB.getShippingFees();
    const next = all.map(f => {
      if (f.city === city) {
        return { ...f, fee: Number(editingFeeValue) };
      }
      return f;
    });
    LocalDB.saveShippingFees(next);
    setEditingCityFee(null);
    onRefreshDB();
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in" id="admin-panel-container">
      {/* Notifications and Header stats info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-rose-pnd-200 pb-5 mb-6">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-gold-600 block">
            Espace Sécurisé Administratif
          </span>
          <h2 className="font-serif text-2xl font-extrabold tracking-tight text-zinc-900">
            Beauty By PND — Console de Gestion
          </h2>
          <p className="text-xs text-zinc-450 mt-1">Gérez vos articles, surveillez le stock et visualisez vos commandes instantanées.</p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap gap-2">
          {/* Notifications badges */}
          {(pendingOrdersCount > 0 || pendingSourcingCount > 0) && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-pnd-100 border border-rose-pnd-200 px-3.5 py-1.5 text-[11px] font-bold text-rose-500 animate-pulse">
              <ShieldAlert className="h-4 w-4 text-rose-pnd-500" />
              <span>{pendingOrdersCount} com. en attente • {pendingSourcingCount} sourcing en ligne</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
          >
            <LogOut className="h-4 w-4 text-zinc-400" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Admin tabs navigators */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-3 mb-6">
        {[
          { id: 'dashboard', label: 'Dashboard & Stats', icon: <BarChart2 className="h-4 w-4" /> },
          { id: 'products', label: 'Catalogue Produits', icon: <Package className="h-4 w-4" /> },
          { id: 'stock', label: 'Gestion Stocks', icon: <AlertTriangle className="h-4 w-4" /> },
          { id: 'orders', label: 'Commandes Client', icon: <ShoppingBag className="h-4 w-4" /> },
          { id: 'clients', label: 'Portefeuille Clients', icon: <Users className="h-4 w-4" /> },
          { id: 'sourcing', label: 'Demandes Sourcing', icon: <Sparkles className="h-4 w-4" /> },
          { id: 'coupons', label: 'Codes & Frais Port', icon: <Tag className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            id={`tab-btn-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === tab.id
                ? 'gold-gradient-bg text-white shadow-sm'
                : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1 : DASHBOARD STATS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6" id="panel-tab-dashboard">
          {/* Key metrics blocks */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Chiffre d\'Affaires Réel</span>
              <p className="font-mono text-2xl font-extrabold text-gold-600">{totalRevenue} DH</p>
              <p className="text-[9px] text-zinc-400 font-medium">Commandes validées ou en cours</p>
            </div>
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total commandes</span>
              <p className="font-mono text-2xl font-extrabold text-zinc-900">{orders.length}</p>
              <p className="text-[9px] text-zinc-400 font-medium">{pendingOrdersCount} en attente finale</p>
            </div>
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sourcing sur-mesure</span>
              <p className="font-mono text-2xl font-extrabold text-blue-600">{sourcingRequests.length}</p>
              <p className="text-[9px] text-zinc-400 font-medium">{pendingSourcingCount} nouveaux formulaires</p>
            </div>
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Produits en rupture</span>
              <p className="font-mono text-2xl font-extrabold text-rose-500">
                {products.filter(p => p.stock === 0).length}
              </p>
              <p className="text-[9px] text-zinc-400 font-medium">À réapprovisionner de toute urgence</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Sales breakdown by city custom chart */}
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 md:col-span-1 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600">Performance par Villes</h3>
              <div className="space-y-3">
                {Object.entries(salesByCity).map(([city, val], idx) => {
                  const numVal = val as number;
                  const percent = Math.round((numVal / (totalRevenue || 1)) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-700">
                        <span>{city}</span>
                        <span className="font-mono">{numVal} DH ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full gold-gradient-bg" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(salesByCity).length === 0 && (
                  <p className="text-xs text-zinc-400 italic">Aucune donnée de vente disponible.</p>
                )}
              </div>
            </div>

            {/* Recent Orders Overview with live actions */}
            <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600">Commandes Urgentes Recueillies</h3>
                <span className="text-[10px] bg-rose-pnd-100 text-rose-pnd-500 font-bold px-2 py-0.5 rounded-full">
                  {pendingOrdersCount} Commande(s) Active(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">ID</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Client</th>
                      <th className="py-2.5">Montant</th>
                      <th className="py-2.5">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.id} className="border-b border-zinc-50 font-medium">
                        <td className="py-3 font-mono text-gold-700 font-bold">{ord.id}</td>
                        <td className="py-3 text-zinc-400">{new Date(ord.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3">
                          <p className="font-bold text-zinc-800">{ord.customerName}</p>
                          <p className="text-[10px] text-zinc-400">{ord.customerPhone} ({ord.customerCity})</p>
                        </td>
                        <td className="py-3 font-mono font-bold text-zinc-900">{ord.totalPrice} DH</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'En attente' ? 'bg-amber-100 text-amber-700' : 
                            ord.status === 'Confirmée' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-zinc-400 italic">Aucune commande récemment enregistrée.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 : GESTION DES PRODUITS */}
      {activeTab === 'products' && (
        <div className="space-y-6" id="panel-tab-products">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Filtrer ou rechercher par nom de produit..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs focus:border-gold-300 focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-1 rounded-xl gold-gradient-bg px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:opacity-95"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Ajouter un produit</span>
            </button>
          </div>

          {/* Add product modal/overlay container */}
          {isAddFormOpen && (
            <div className="rounded-2xl border border-gold-300 bg-rose-pnd-50/20 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-rose-pnd-100 pb-2">
                <h4 className="font-serif text-sm font-bold text-zinc-905">Nouveau Produit d\'Exception</h4>
                <button onClick={() => setIsAddFormOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="grid gap-4 sm:grid-cols-3 text-xs font-medium">
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dior Joy Eau de Parfum 90ml"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Catégorie *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  >
                    <option value="Parfums">Parfums</option>
                    <option value="Cosmétiques">Cosmétiques</option>
                    <option value="Sacs">Sacs</option>
                    <option value="Montres">Montres</option>
                    <option value="Vêtements">Vêtements</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="Lien d'image unsplash..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full rounded-lg border border-zinc-255 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Prix Direct (DH) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Prix Initial pour Promo (Optionnel)</label>
                  <input
                    type="number"
                    placeholder="Ex: 500"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Stock initial *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Slogan / Tag visuel</label>
                  <select
                    value={newProdTag}
                    onChange={(e) => setNewProdTag(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  >
                    <option value="">Aucun</option>
                    <option value="Nouveau">Nouveau</option>
                    <option value="Promo">Promo</option>
                    <option value="Best">Best Seller</option>
                    <option value="TikTok">TikTok Viral</option>
                    <option value="Limité">Stock Limité</option>
                    <option value="Pack">Pack Cadeau</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-700">Inspiration Provenance</label>
                  <select
                    value={newProdInspiration}
                    onChange={(e) => setNewProdInspiration(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  >
                    <option value="Aucune">Aucune particuliere</option>
                    <option value="Shein">Shein Inspiration</option>
                    <option value="Action">Action Inspiration</option>
                    <option value="Mercadona">Mercadona Inspiration</option>
                    <option value="Europe">Europe Importation</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block mb-1 font-bold text-zinc-700">Slogan / Description complète</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Entrez les notes olfactives ou caractéristiques..."
                    className="w-full rounded-lg border border-zinc-250 bg-white p-2"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddFormOpen(false)} className="rounded-lg px-4 py-2 border bg-white">
                    Annuler
                  </button>
                  <button type="submit" className="rounded-lg gold-gradient-bg text-white px-6 py-2">
                    Enregistrer l\'article
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Core Table Grid of product configurations */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-rose-pnd-50/30 border-b border-rose-pnd-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Produit</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Stock d\'urgence</th>
                    <th className="p-4">Propriétés / Provenance</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-rose-pnd-50/10">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="h-10 w-10 object-cover rounded-lg border" />
                        <div>
                          <p className="font-bold text-zinc-900 leading-tight">{p.name}</p>
                          <span className="font-mono text-[9px] text-zinc-400">ID: {p.id}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-700">{p.category}</td>
                      <td className="p-4 font-mono font-bold text-gold-600">{p.price} DH</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                          p.stock === 0 ? 'bg-red-100 text-red-700 border border-red-200' :
                          p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.stock} pièces
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.tag && <span className="text-[9px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded font-bold">{p.tag}</span>}
                          {p.inspiration && p.inspiration !== 'Aucune' && <span className="text-[9px] bg-rose-pnd-100 text-rose-pnd-700 px-1.5 py-0.5 rounded font-semibold">Insp: {p.inspiration}</span>}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 : QUICK STOCK MANAGEMENT */}
      {activeTab === 'stock' && (
        <div className="space-y-6" id="panel-tab-stock">
          <div className="rounded-xl bg-rose-pnd-100 border border-rose-pnd-200 p-4 text-xs text-rose-pnd-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-pnd-500 flex-shrink-0 animate-bounce" />
            <span>Ajustez directement les quantités ici. Tout produit arrivant à 0 désactive instantanément l\'achat sur le catalogue client pour éviter les sur-ventes !</span>
          </div>

          <div className="rounded-2xl border border-rose-pnd-100 bg-white shadow-md overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Article</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Stock Actuel</th>
                  <th className="p-4 text-center">Ajustements Express</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-4 font-bold text-zinc-850">{p.name}</td>
                    <td className="p-4 text-zinc-500 font-semibold">{p.category}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-extrabold font-mono ${
                        p.stock === 0 ? 'bg-red-100 text-red-600' :
                        p.stock <= 5 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleStockAdj(p.id, -5)}
                          className="px-2.5 py-1 border border-zinc-200 bg-white rounded-lg font-bold text-zinc-600 hover:bg-zinc-100"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockAdj(p.id, -1)}
                          className="px-2.5 py-1 border border-zinc-200 bg-white rounded-lg font-bold text-zinc-600 hover:bg-zinc-100"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockAdj(p.id, 1)}
                          className="px-2.5 py-1 border border-gold-300 bg-gold-50/50 rounded-lg font-bold text-gold-700 hover:bg-gold-100"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleStockAdj(p.id, 5)}
                          className="px-2.5 py-1 border border-gold-300 bg-gold-50/50 rounded-lg font-bold text-gold-700 hover:bg-gold-100"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4 : CLIENT ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6" id="panel-tab-orders">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold-600">
              Registre des Commandes ({orders.length} commandes enregistrées)
            </h3>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              <FileSpreadsheet className="h-4.5 w-4.5" />
              <span>Exporter pour Excel (.csv)</span>
            </button>
          </div>

          <div className="rounded-2xl border border-rose-pnd-100 bg-white shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-rose-pnd-50/30 border-b border-rose-pnd-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="p-4">CODE / Date</th>
                    <th className="p-4">Destinataire</th>
                    <th className="p-4">Articles achetés</th>
                    <th className="p-4">Total facturé</th>
                    <th className="p-4">Statut d\'expédition</th>
                    <th className="p-4">WhatsApp Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-rose-pnd-50/5">
                      <td className="p-4">
                        <p className="font-mono text-xs font-bold text-gold-700">{ord.id}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">{new Date(ord.date).toLocaleString('fr-FR')}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-800">{ord.customerName}</p>
                        <p className="text-zinc-500 leading-normal">{ord.customerPhone} — {ord.customerCity}</p>
                        <p className="text-[10px] text-zinc-400 font-light max-w-xs truncate">{ord.customerAddress}</p>
                      </td>
                      <td className="p-4 space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="bg-zinc-50 p-1 rounded font-medium text-zinc-700 flex justify-between">
                            <span>{it.productName}</span>
                            <span className="font-bold text-gold-600 pl-2">x{it.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-zinc-900">{ord.totalPrice} DH</span>
                        <p className="text-[9px] text-zinc-400 font-medium">Port inclus ({ord.shippingFee} DH)</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="rounded-lg border border-zinc-200 bg-white p-1.5 font-bold uppercase tracking-wide text-zinc-700"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Confirmée">Confirmée</option>
                          <option value="En cours d'expédition">En cours d'expédition</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[\s\+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                        >
                          <PhoneCall className="h-3.5 w-3.5" /> Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-450 italic">Aucune commande n\'est en historique pour l\'instant.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5 : CLIENTS DIRECTORY */}
      {activeTab === 'clients' && (
        <div className="space-y-6" id="panel-tab-clients">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold-600">
            Portefeuille Beauties de Beauty By PND
          </h3>

          <div className="rounded-2xl border border-rose-pnd-100 bg-white shadow-md overflow-hidden animate-fade-in">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Nom de la Beauty</th>
                  <th className="p-4">Numéro WhatsApp</th>
                  <th className="p-4">Ville</th>
                  <th className="p-4">Nombre d\'achats</th>
                  <th className="p-4 text-right">Volume d\'Affaires Global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clientList.map(cli => (
                  <tr key={cli.id} className="hover:bg-rose-pnd-50/5">
                    <td className="p-4 font-bold text-zinc-800">{cli.name}</td>
                    <td className="p-4 font-mono font-medium text-zinc-600">{cli.phone}</td>
                    <td className="p-4 text-zinc-550 font-semibold">{cli.city}</td>
                    <td className="p-4">
                      <span className="bg-gold-50 border border-gold-200 text-gold-700 rounded-full px-2.5 py-0.5 font-bold">
                        {cli.ordersCount} commande(s)
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-zinc-900">
                      {cli.totalSpent} DH
                    </td>
                  </tr>
                ))}
                {clientList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400 italic">Aucun client répertorié. Lancez vos premieres ventes !</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6 : SOURCING DEMANDES EN COURS */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6" id="panel-tab-sourcing">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold-600">
            Demandes de Sourcing Personnalisés en cours
          </h3>

          <div className="rounded-2xl border border-rose-pnd-100 bg-white shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-rose-pnd-50/30 border-b border-rose-pnd-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Sourcing Code / Date</th>
                    <th className="p-4">Aperçu</th>
                    <th className="p-4">Prospect / Client</th>
                    <th className="p-4">Article convoité / Spécifications</th>
                    <th className="p-4">Statut d\'Avancement</th>
                    <th className="p-4">Relancer le client</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {sourcingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-rose-pnd-50/5">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-gold-700">{req.id}</span>
                        <p className="text-[10px] text-zinc-400 mt-1">{new Date(req.date).toLocaleDateString('fr-FR')}</p>
                      </td>
                      <td className="p-4">
                        <img src={req.image} alt={req.productName} referrerPolicy="no-referrer" className="h-12 w-12 object-cover rounded-lg border bg-stone-50" />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-800">{req.customerName}</p>
                        <p className="text-zinc-505 leading-normal">{req.customerPhone} ({req.customerCity})</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-900">{req.productName}</p>
                        <p className="text-zinc-500 text-[11px] italic mt-1 font-light max-w-xs">{req.description || "Aucun lien ou commentaire s.v.p."}</p>
                        <div className="flex gap-2 pt-2 text-[10px]">
                          {req.colorOrSize && <span className="bg-rose-pnd-50 text-rose-pnd-500 px-1 rounded font-bold">{req.colorOrSize}</span>}
                          <span>Qté: {req.quantity}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateSourcingStatus(req.id, e.target.value as any)}
                          className="rounded-lg border border-zinc-200 bg-white p-1.5 font-bold uppercase tracking-wide text-zinc-700"
                        >
                          <option value="En attente">En attente</option>
                          <option value="En recherche">En recherche</option>
                          <option value="Trouvé">Trouvé !</option>
                          <option value="Livré">Livré & clos</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <a
                          href={`https://wa.me/${req.customerPhone.replace(/[\s\+]/g, '')}?text=Bonjour%20${req.customerName},%20nous%2520avons%2520du%2520nouveau%2520sur%2520votre%2520sourcing%2520${req.productName}%252520!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-2 py-1 font-bold hover:bg-emerald-100"
                        >
                          <PhoneCall className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                  {sourcingRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-450 italic">Aucune de demande personnalisée recueillie. En attente.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7 : GESTION DES CODES PROMOS ET FRAIS DE PORT */}
      {activeTab === 'coupons' && (
        <div className="grid gap-6 md:grid-cols-2" id="panel-tab-coupons">
          {/* Coupon codes controller */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-4 shadow-md">
            <h3 className="font-serif text-base font-bold text-zinc-900 border-b border-rose-pnd-50 pb-2">
              Gestionnaire de codes promotionnels
            </h3>

            <form onSubmit={handleAddCoupon} className="space-y-3 font-medium text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-zinc-650">CODE (uniquement MAJ)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BEAUTYGLASS"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full rounded-lg border border-zinc-250 p-2 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-650">Type de rabais</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-250 p-2 bg-white"
                  >
                    <option value="percentage">Pourcentage d\'achat (%)</option>
                    <option value="fixed">Montant fixe direct (DH)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-zinc-650">Valeur numérique</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-250 p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-zinc-650">Panier minimal obligatoire (DH)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-250 p-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl gold-gradient-bg px-4 py-2.5 text-white font-bold uppercase tracking-wider text-xs shadow hover:opacity-95"
              >
                Générer le Code Promo
              </button>
            </form>

            <div className="overflow-x-auto pt-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-rose-pnd-100 text-zinc-400 font-bold uppercase">
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Valeur</th>
                    <th className="pb-2">Min Panier</th>
                    <th className="pb-2">Active</th>
                    <th className="pb-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.code} className="border-b font-medium text-zinc-700">
                      <td className="py-2.5 font-mono font-bold text-gold-600">{c.code}</td>
                      <td className="py-2.5">{c.value} {c.discountType === 'percentage' ? '%' : 'DH'}</td>
                      <td className="py-2.5">{c.minOrderAmount || 0} DH</td>
                      <td className="py-2.5">
                        <button
                          onClick={() => toggleCouponStatus(c.code)}
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {c.active ? 'Oui' : 'Non'}
                        </button>
                      </td>
                      <td className="py-2.5 text-center">
                        <button onClick={() => handleDeleteCoupon(c.code)} className="text-zinc-400 hover:text-rose-500">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Morocco Shipping Cost manager */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white p-5 space-y-4 shadow-md">
            <h3 className="font-serif text-base font-bold text-zinc-900 border-b border-rose-pnd-50 pb-2">
              Ajustement des Frais de Port par Ville
            </h3>

            <div className="space-y-3">
              {shippingFees.map(fee => (
                <div key={fee.city} className="flex justify-between items-center bg-zinc-50 rounded-xl p-3 text-xs">
                  <span className="font-bold text-zinc-805">{fee.city}</span>
                  
                  {editingCityFee === fee.city ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="0"
                        value={editingFeeValue}
                        onChange={(e) => setEditingFeeValue(Number(e.target.value))}
                        className="w-16 rounded border p-1 text-xs text-center"
                      />
                      <button onClick={() => handleSaveCityFee(fee.city)} className="bg-emerald-500 text-white rounded px-2.5 py-1 text-[11px] font-bold">
                        Sauvegarder
                      </button>
                      <button onClick={() => setEditingCityFee(null)} className="text-zinc-400">
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center">
                      <span className="font-bold text-gold-600 font-mono">{fee.fee} DH</span>
                      <button
                        onClick={() => {
                          setEditingCityFee(fee.city);
                          setEditingFeeValue(fee.fee);
                        }}
                        className="text-zinc-455 hover:text-gold-500 font-bold"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
