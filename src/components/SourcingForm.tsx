import React, { useRef, useState } from 'react';
import { Sparkles, Send, Upload, CheckCircle, Smartphone, HelpCircle, ArrowRight } from 'lucide-react';
import { SourcingRequest } from '../types';
import { LocalDB } from '../data/store';

interface SourcingFormProps {
  onSuccess: () => void;
}

export default function SourcingForm({ onSuccess }: SourcingFormProps) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [colorSize, setColorSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Casablanca');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !customerName || !customerPhone) {
      alert('Veuillez remplir au moins le nom du produit, votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);

    const newRequest: SourcingRequest = {
      id: `SRC-${Math.floor(1000 + Math.random() * 9000)}`,
      productName,
      description,
      image: imagePreview || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200', // Default luxury beauty placeholder
      colorOrSize: colorSize,
      quantity,
      status: 'En attente',
      date: new Date().toISOString(),
      customerName,
      customerPhone,
      customerCity
    };

    // Save Sourcing
    const current = LocalDB.getSourcingRequests();
    LocalDB.saveSourcingRequests([newRequest, ...current]);

    // Build WhatsApp message
    const waText = `*Demande de Sourcing - Beauty By PND*%0A%0A` +
      `*Id:* ${newRequest.id}%0A` +
      `*Produit d\'exception recherché:* ${newRequest.productName}%0A` +
      `*Description/Lien:* ${newRequest.description || 'Non renseignée'}%0A` +
      `*Taille / Couleur:* ${newRequest.colorOrSize || 'Non spécifiée'}%0A` +
      `*Quantité:* ${newRequest.quantity}%0A%0A` +
      `*Client:* ${newRequest.customerName}%0A` +
      `*Téléphone:* ${newRequest.customerPhone}%0A` +
      `*Ville:* ${newRequest.customerCity}%0A%0A` +
      `_Veuillez vérifier la disponibilité auprès de vos fournisseurs s.v.p._`;

    const waLink = `https://wa.me/34631276315?text=${waText}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess();
      // Auto open whatsapp
      window.open(waLink, '_blank');
    }, 1200);
  };

  const handleReset = () => {
    setProductName('');
    setDescription('');
    setColorSize('');
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setImagePreview(null);
    setIsSubmitted(false);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-6 shadow-xl sm:p-10" id="sourcing-form-container">
      {isSubmitted ? (
        <div className="py-8 text-center" id="sourcing-success">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-zinc-900">Demande enregistrée avec succès !</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500 leading-relaxed">
            Votre demande a été sauvegardée et transmise à nos équipes. Vous allez être redirigé vers WhatsApp pour finaliser l'envoi de vos photos de référence.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => handleReset()}
              className="rounded-full border border-zinc-300 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 transition hover:bg-zinc-50"
            >
              Faire une autre demande
            </button>
            <a
              href="https://wa.me/34631276315"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:opacity-95"
            >
              Partager sur WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" id="sourcing-request-form">
          <div className="border-b border-rose-100 pb-5 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              Sourcing Personnalisé Sur-Mesure
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-zinc-500 leading-relaxed">
              Vous rêvez d'un parfum rare, d'un sac de luxe inaccessible, d'un article de mode sur Shein, Action ou Mercadona qui n'est pas listé ? Décrivez-le nous, envoyez-nous une photo et nous le recherchons sous <strong className="text-rose-600">7 à 15 jours</strong> avec livraison à domicile !
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left section: Product details */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-rose-500 border-b border-rose-100 pb-1">
                1. Détails de l'article
              </h3>
              
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Nom du produit recherché *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Palette Fenty Beauty Snap Shadows N°4"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Description, Marque ou Lien Shein/Zara/Dior
                </label>
                <textarea
                  rows={3}
                  placeholder="Précisez la marque, la référence précise ou collez un lien internet ici..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none placeholder:text-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Couleur ou Taille
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rose Gold / XL"
                    value={colorSize}
                    onChange={(e) => setColorSize(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Quantité souhaitée
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right section: Upload + Customer info */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-rose-500 border-b border-rose-100 pb-1">
                2. Vos coordonnées & Photo
              </h3>

              {/* Photo Upload Box */}
              <div>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Photo ou Capture d'écran d'illustration
                </span>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-200 bg-[#fffbfc] hover:bg-rose-50 transition-all overflow-hidden relative"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu du produit"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="p-4 text-center">
                      <Upload className="mx-auto h-6 w-6 text-rose-400 mb-1" />
                      <p className="text-[11px] font-semibold text-zinc-500">Cliquez pour ajouter l'image</p>
                      <p className="text-[9px] text-zinc-400">Format JPG, PNG (glisser-déposer ou capture)</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Votre Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Yasmine Alaoui"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    N° de Téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0612345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-4 py-3 text-sm focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Votre Ville *
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-[#fffbfc] px-3 py-3 text-sm focus:border-rose-400 focus:outline-none bg-white font-medium"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Fès">Fès</option>
                    <option value="Oujda">Oujda</option>
                    <option value="Meknès">Meknès</option>
                    <option value="Autre">Autre Ville</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-rose-100 pt-5 sm:flex-row">
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
              <Smartphone className="h-4 w-4 text-[#10b981]" />
              Confirmation de recherche instantanée par WhatsApp.
            </span>
            <button
              id="submit-sourcing-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95 sm:w-auto disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Lancer la recherche et notifier WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
