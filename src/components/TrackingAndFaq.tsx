import React, { useState } from 'react';
import { FAQItem, Order } from '../types';
import { LocalDB } from '../data/store';
import { Search, MapPin, Truck, RefreshCw, HelpCircle, CheckCircle, Package, ShieldCheck, HelpCircle as HelpIcon, ArrowRight, AlertCircle } from 'lucide-react';

interface TrackingAndFaqProps {
  faqs: FAQItem[];
}

export default function TrackingAndFaq({ faqs }: TrackingAndFaqProps) {
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);
  
  // FAQ active categories filter
  const [selectedFaqCat, setSelectedFaqCat] = useState('Tous');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Policies sub tab
  const [activeTab, setActiveTab] = useState<'track' | 'faq' | 'policies'>('track');

  const faqCategories = ['Tous', 'Livraison', 'Paiement', 'Retours', 'Sourcing'];

  const filteredFaqs = faqs.filter(f => 
    selectedFaqCat === 'Tous' || f.category === selectedFaqCat
  );

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = trackQuery.trim();
    if (!q) {
      setTrackedOrders([]);
      return;
    }

    const allOrders = LocalDB.getOrders();
    // Search by order code (e.g. ORD-9844) or phone number (e.g. 0612345678)
    const matched = allOrders.filter(ord => 
      ord.id.toLowerCase() === q.toLowerCase() || 
      ord.customerPhone === q ||
      ord.customerName.toLowerCase().includes(q.toLowerCase())
    );

    setTrackedOrders(matched);
  };

  const getStatusStep = (status: Order['status']) => {
    const steps = [
      { id: 'En attente', label: 'En attente de traitement' },
      { id: 'Confirmée', label: 'Commande confirmée' },
      { id: 'En cours d\'expédition', label: 'En cours d\'expédition' },
      { id: 'Livrée', label: 'Livrée à domicile' }
    ];

    let activeStepIndex = 0;
    if (status === 'Confirmée') activeStepIndex = 1;
    if (status === 'En cours d\'expédition') activeStepIndex = 2;
    if (status === 'Livrée') activeStepIndex = 3;
    if (status === 'Annulée') activeStepIndex = -1;

    return (
      <div className="space-y-4">
        {status === 'Annulée' ? (
          <div className="rounded-xl bg-rose-pnd-50 border border-rose-pnd-100 p-4 text-xs font-semibold text-rose-pnd-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Cette commande a été annulée. Contactez-nous sur WhatsApp pour en connaître la cause.</span>
          </div>
        ) : (
          <div className="relative flex flex-col sm:flex-row justify-between gap-4 py-2 border-t border-b border-rose-pnd-50 my-4 bg-rose-pnd-50/10 rounded-xl p-4">
            {steps.map((st, idx) => {
              const isPast = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div key={st.id} className="flex sm:flex-col items-center gap-2 flex-1 text-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isPast 
                      ? 'gold-gradient-bg text-white' 
                      : 'border border-zinc-200 bg-zinc-50 text-zinc-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <p className={`text-xs font-bold uppercase tracking-wide ${isPast ? 'text-zinc-900' : 'text-zinc-405'}`}>
                      {st.id}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium">{st.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8" id="tracking-faq-policies">
      {/* Sub menu Tabs */}
      <div className="flex justify-center border-b border-rose-pnd-100">
        <div className="grid w-full max-w-xl grid-cols-3 text-center">
          {[
            { id: 'track', label: 'Suivi de Commande' },
            { id: 'faq', label: 'Foire Aux Questions' },
            { id: 'policies', label: 'Nos Politiques & Info' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id 
                  ? 'border-b-2 border-gold-500 text-gold-700 font-extrabold' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs panels */}
      {activeTab === 'track' && (
        <div className="space-y-6" id="tracking-panel">
          <div className="rounded-3xl border border-rose-pnd-200 bg-white p-6 shadow-xl sm:p-10 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600">
              <Package className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-zinc-900">Suivre mon colis Beauty by PND</h3>
            <p className="mx-auto max-w-md text-xs text-zinc-400">
              Saisissez le code de votre commande (ex: ORD-9844) ou votre numéro de téléphone de livraison pour afficher l\'avancement en temps réel.
            </p>

            <form onSubmit={handleTrack} className="mx-auto flex max-w-md gap-2 pt-2">
              <input
                type="text"
                placeholder="N° de commande ou Téléphone Maroc..."
                value={trackQuery}
                required
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-xs font-medium focus:border-gold-300 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl gold-gradient-bg px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:opacity-95"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Results container */}
          {searched && (
            <div className="space-y-4" id="tracking-results">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold-600 border-b border-rose-pnd-50 pb-1">
                Résultats de la recherche ({trackedOrders ? trackedOrders.length : 0} colis trouvé)
              </h3>

              {!trackedOrders || trackedOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-rose-pnd-200 bg-white py-12 text-center text-zinc-400">
                  <AlertCircle className="mx-auto h-12 w-12 text-zinc-300 mb-2" />
                  <p className="text-sm font-semibold">Aucun colis correspondant trouvé</p>
                  <p className="text-xs">Vérifiez les caractères de votre référence ou assurez vous que l\'achat en ligne est bien validé.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {trackedOrders.map((ord) => (
                    <div key={ord.id} className="rounded-2xl border border-rose-pnd-100 bg-white p-5 shadow-md space-y-4">
                      {/* Grid upper header */}
                      <div className="flex flex-wrap justify-between gap-2 border-b border-rose-pnd-50 pb-3 items-center">
                        <div>
                          <span className="font-mono text-xs font-extrabold text-gold-600">ID: {ord.id}</span>
                          <p className="text-[10px] text-zinc-400">Le {new Date(ord.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-zinc-700 bg-rose-pnd-50 border border-rose-pnd-100 px-2.5 py-1 rounded">
                            Statut actuel : {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Timeline steps */}
                      {getStatusStep(ord.status)}

                      {/* Ship details & Products list */}
                      <div className="grid gap-6 sm:grid-cols-2 text-xs">
                        <div className="space-y-2 bg-rose-pnd-50/5 p-4 rounded-xl border border-rose-pnd-100/50">
                          <strong className="font-semibold block text-zinc-90 w-full text-gold-700">Coordonnées de livraison</strong>
                          <p className="font-bold text-zinc-800">{ord.customerName}</p>
                          <p className="text-zinc-500 font-medium">Tél: {ord.customerPhone}</p>
                          <p className="text-zinc-500 font-medium">{ord.customerCity}</p>
                          <p className="text-zinc-500 font-medium">{ord.customerAddress}</p>
                        </div>

                        <div className="space-y-2">
                          <strong className="font-semibold block text-zinc-90 text-gold-700">Détails de vos articles</strong>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-zinc-50 p-2 rounded">
                                <span className="font-medium text-zinc-700 line-clamp-1 flex-1 pr-2">{item.productName}</span>
                                <span className="font-bold text-zinc-500 pr-3">x{item.quantity}</span>
                                <span className="font-mono font-bold text-zinc-800">{item.price * item.quantity} DH</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-rose-pnd-50 pt-2 flex justify-between font-bold text-zinc-800">
                            <span>Frais de livraison ({ord.customerCity}) :</span>
                            <span className="font-mono">{ord.shippingFee} DH</span>
                          </div>
                          <div className="flex justify-between font-extrabold text-sm text-gold-600 border-t border-rose-pnd-50 pt-1">
                            <span>TOTAL COMMANDE (Paiement livraison) :</span>
                            <span className="font-mono">{ord.totalPrice} DH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-6" id="faq-panel">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-2xl font-bold text-zinc-900">Questions Fréquentes (FAQ)</h3>
            <p className="text-xs text-zinc-450">Toutes les réponses à vos questions d\'achats et de livraisons.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 border-b border-rose-pnd-50 pb-4">
            {faqCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCat(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedFaqCat === cat
                    ? 'gold-gradient-bg text-white shadow-sm'
                    : 'bg-rose-pnd-50 text-zinc-650 hover:bg-rose-pnd-100/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3.5 max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="rounded-2xl border border-rose-pnd-100 bg-white overflow-hidden shadow-xs transition">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold text-zinc-800 hover:bg-rose-pnd-50/20"
                  >
                    <span className="flex items-center gap-2">
                      <HelpIcon className="h-4.5 w-4.5 text-gold-500" />
                      {faq.question}
                    </span>
                    <span className="bg-rose-pnd-100 hover:bg-rose-pnd-200 text-gold-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {isOpen ? '-' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-500 leading-relaxed border-t border-rose-pnd-50/30 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="grid gap-6 md:grid-cols-2" id="policies-panel">
          {/* Shipping Policy */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white p-6 space-y-4 shadow-md">
            <h3 className="font-serif text-lg font-bold text-zinc-900 border-b border-rose-pnd-50 pb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-gold-500" /> Politique de Livraison
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Nous livrons à domicile sur l\'ensemble du territoire national marocain ! 
              <br /><br />
              • <strong className="text-zinc-800">Casablanca & Régions :</strong> Livraison assurée sous 24h ouvrées. Frais de port : 20 DH ou offerts dès 500 DH d\'achat.
              <br /><br />
              • <strong className="text-zinc-800">Autres Villes Principales :</strong> Rabat, Marrakech, Tanger, Fès, Meknès... Livraison en 24 à 48 heures ouvrées. Frais de port : 30 à 35 DH.
              <br /><br />
              • <strong className="text-zinc-800">Villes éloignées ou secondaires :</strong> 2 à 4 jours ouvrables. Frais de port : 45 DH.
              <br /><br />
              Vous réglez le livreur en espèces dès vérification de votre colis devant votre domicile. Un courriel ou SMS de confirmation vous est adressé avec le numéro de suivi de colis dès transfert au transporteur.
            </p>
          </div>

          {/* Return Policy */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white p-6 space-y-4 shadow-md">
            <h3 className="font-serif text-lg font-bold text-zinc-900 border-b border-rose-pnd-50 pb-2 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-gold-500" /> Politique d\'Échange et de Retour
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Votre sérénité et satisfaction sont sacrées chez Beauty By PND !
              <br /><br />
              Vous disposez d\'un délai de <strong className="text-zinc-800">7 jours</strong> à compter de la réception de votre commande pour nous notifier un souhait de retour ou d\'échange.
              <br /><br />
              • <strong className="text-zinc-800">Conditions de validation :</strong> Pour des raisons strictes d\'hygiène et d\'intégrité des produits cosmétiques et de parfums, les articles doivent nous être retournés impeccablement intacts, scellés, non ouverts de leur blister d\'origine et jamais utilisés.
              <br /><br />
              • <strong className="text-zinc-800">Procédure :</strong> Envoyez votre demande par messagerie WhatsApp en mentionnant votre ID de commande. Un livreur passera récupérer l\'article à échanger à votre domicile sous 48h.
            </p>
          </div>

          {/* About us context card */}
          <div className="rounded-2xl border border-rose-pnd-100 bg-white p-6 md:col-span-2 space-y-4 shadow-md">
            <h3 className="font-serif text-lg font-bold text-zinc-900 border-b border-rose-pnd-50 pb-2">
              À Propos de Beauty By PND
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Fondée avec passion, <strong className="text-gold-600">Beauty By PND</strong> est une boutique en ligne marocaine dédiée à l\'élégance et au raffinement féminin. Notre vocation ultime est de démocratiser l\'accès aux cosmétiques d\'exception et aux parfums de niche d\'Europe, tout en dénichant les accessoires et vêtements tendances viraux sur Shein, Action et Mercadona. Grâce à notre concept innovant de Sourcing sur-mesure, plus aucun produit esthétique convoité à l\'étranger ne vous sera inaccessible au Maroc.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
