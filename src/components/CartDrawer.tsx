import React, { useState, useMemo } from 'react';
import { Product, Coupon, Order, ShippingFee } from '../types';
import { LocalDB } from '../data/store';
import { ShoppingBag, X, MessageSquare, Trash2, Tag, Gift, Check, ArrowRight, Truck } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  shippingFees: ShippingFee[];
  onOrderPlaced: (order: Order) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  shippingFees,
  onOrderPlaced
}: CartDrawerProps) {
  // Form Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [address, setAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotal calculator
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  // Selected city shipping cost
  const shippingCost = useMemo(() => {
    const feeObj = shippingFees.find(f => f.city === selectedCity);
    return feeObj ? feeObj.fee : 45; // Default 45
  }, [selectedCity, shippingFees]);

  // Coupon Discount Calculator
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      return 0; // Doesn't meet min order bounds
    }
    if (appliedCoupon.discountType === 'fixed') {
      return appliedCoupon.value;
    } else {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
  }, [appliedCoupon, subtotal]);

  const finalTotal = useMemo(() => {
    const calc = subtotal - discountAmount + shippingCost;
    return calc < 0 ? 0 : calc;
  }, [subtotal, discountAmount, shippingCost]);

  // Handle promo code submit
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const dbCoupons = LocalDB.getCoupons();
    const found = dbCoupons.find(c => c.code === code && c.active);

    if (found) {
      if (found.minOrderAmount && subtotal < found.minOrderAmount) {
        setCouponError(`Montant minimal de commande de ${found.minOrderAmount} DH nécessaire.`);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(found);
      }
    } else {
      setCouponError('Code promo invalide ou expiré.');
      setAppliedCoupon(null);
    }
  };

  // Checkout submission
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Votre panier est actuellement vide.');
      return;
    }
    if (!fullName || !phone || !address) {
      alert('Veuillez remplir toutes vos coordonnées pour la livraison.');
      return;
    }

    setIsSubmitting(true);

    // Build unique tracking order id
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: fullName,
      customerPhone: phone,
      customerCity: selectedCity,
      customerAddress: address,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      totalPrice: finalTotal,
      shippingFee: shippingCost,
      couponApplied: appliedCoupon?.code || undefined,
      status: 'En attente',
      date: new Date().toISOString(),
      paymentMethod: 'Paiement à la livraison'
    };

    // Update Product Stock instantly in state & local persistence
    const originalProds = LocalDB.getProducts();
    const updatedProds = originalProds.map(p => {
      const cartItem = cartItems.find(c => c.product.id === p.id);
      if (cartItem) {
        const nextStock = p.stock - cartItem.quantity;
        return { ...p, stock: nextStock < 0 ? 0 : nextStock };
      }
      return p;
    });
    LocalDB.saveProducts(updatedProds);

    // Save and submit Order
    const originalOrders = LocalDB.getOrders();
    LocalDB.saveOrders([newOrder, ...originalOrders]);

    // Format WhatsApp confirmation text automatically
    const itemsText = cartItems.map(item => `• ${item.product.name} (x${item.quantity})`).join('%0A');
    const waMsg = `*Nouvelle Commande - Beauty By PND*%0A%0A` +
      `*Référence:* ${orderId}%0A` +
      `*Client:* ${fullName}%0A` +
      `*Téléphone:* ${phone}%0A` +
      `*Ville:* ${selectedCity}%0A` +
      `*Adresse de livraison:* ${address}%0A%0A` +
      `*Détails des articles:*%0A${itemsText}%0A%0A` +
      `*Sous-Total:* ${subtotal} DH%0A` +
      `*Livraison:* ${shippingCost} DH%0A` +
      (appliedCoupon ? `*Réduction:* -${discountAmount} DH (${appliedCoupon.code})%0A` : '') +
      `*TOTAL À PAYER:* ${finalTotal} DH%0A%0A` +
      `_Merci pour votre confiance chez Beauty By PND. Veuillez préparer le montant exact lors du passage du livreur s.v.p._`;

    const waLink = `https://wa.me/34631276315?text=${waMsg}`;

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClearCart();
      onClose();
      // Auto redirect to whatsapp
      window.open(waLink, '_blank');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-backdrop">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-rose-100 shadow-2xl flex flex-col justify-between text-zinc-800" id="cart-drawer-content">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5.5 w-5.5 text-rose-500" />
              <h2 className="font-serif text-lg font-extrabold tracking-tight text-zinc-900">
                Mon Panier Chic ({cartItems.length} articles)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Core scrollable context */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-rose-200 mb-3" />
                <h3 className="font-serif text-base font-bold text-zinc-900">Votre panier est bien vide</h3>
                <p className="mt-1.5 text-xs text-zinc-500 font-serif">Parcourez nos de superbes collections et craquez pour nos pépites beautés !</p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-rose-500 hover:bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 rounded-xl border border-rose-100 p-3 bg-[#fffbfc] shadow-xs">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-rose-50 bg-rose-50">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-zinc-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="text-[10px] text-rose-500 font-semibold">{item.product.category}</p>

                        <div className="flex items-center justify-between pt-1.5">
                          {/* Rich Item Quantities */}
                          <div className="flex items-center border border-rose-200 rounded-lg bg-white overflow-hidden text-zinc-850">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs font-bold text-rose-500 hover:bg-rose-55 transition"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-zinc-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity >= item.product.stock) {
                                  alert(`Stock limite de ${item.product.stock} pièces atteint.`);
                                  return;
                                }
                                onUpdateQuantity(item.product.id, item.quantity + 1);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-rose-500 hover:bg-rose-55 transition"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono text-xs font-bold text-rose-600">
                            {item.product.price * item.quantity} DH
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <form onSubmit={handleApplyCoupon} className="border-t border-rose-100 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CODE PROMO (ex: PNDWELCOME)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 rounded-xl border border-rose-100 bg-[#fffbfc] text-[#d44865] px-3.5 py-2 text-xs focus:border-rose-400 focus:outline-none placeholder:text-zinc-400 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition whitespace-nowrap"
                    >
                      Appliquer
                    </button>
                  </div>
                  {couponError && <p className="mt-1.5 text-[10px] text-rose-650 font-bold">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-2.5 flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                        <Gift className="h-4 w-4 animate-bounce text-rose-500" />
                        Code {appliedCoupon.code} activé !
                      </span>
                      <span className="text-[11px] font-bold">-{discountAmount} DH</span>
                    </div>
                  )}
                </form>

                {/* Checkout Fields form */}
                <form id="checkout-fields-form" onSubmit={handleCheckout} className="border-t border-rose-100 pt-4 space-y-3.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#d44865]">
                    Coordonnées de livraison (Morocco)
                  </h3>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nom & Prénom *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-rose-100 bg-[#fffbfc] text-zinc-800 px-4 py-2.5 text-xs focus:border-rose-400 focus:outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="N° de Téléphone *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 bg-[#fffbfc] text-zinc-800 px-4 py-2.5 text-xs focus:border-rose-400 focus:outline-none placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 bg-[#fffbfc] text-zinc-800 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none font-medium [&>option]:bg-white [&>option]:text-zinc-850"
                      >
                        {shippingFees.map(fee => (
                          <option key={fee.city} value={fee.city}>
                            {fee.city} ({fee.fee} DH)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Adresse de livraison complète *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-rose-100 bg-[#fffbfc] text-zinc-800 px-4 py-2.5 text-xs focus:border-rose-400 focus:outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-800 flex items-center gap-2">
                    <Truck className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0 animate-bounce" />
                    <span>Mode : <strong>Paiement cash à la livraison</strong> disponible pour cette commande !</span>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Pricing totals & Checkout button */}
          {cartItems.length > 0 && (
            <div className="border-t border-rose-100 bg-[#fffbfc] px-6 py-5 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-500 font-medium">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-mono text-zinc-700">{subtotal} DH</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Réduction ({appliedCoupon.code})</span>
                    <span className="font-mono">-{discountAmount} DH</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison ({selectedCity})</span>
                  <span className="font-mono text-zinc-700">{shippingCost} DH</span>
                </div>
                <div className="flex justify-between border-t border-rose-100 pt-2 text-sm font-extrabold text-zinc-800">
                  <span>TOTAL ESTIMÉ</span>
                  <span className="font-mono text-base text-rose-600">{finalTotal} DH</span>
                </div>
              </div>

              <button
                form="checkout-fields-form"
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Création du Bon...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmer la commande & Ouvrir WhatsApp</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
