import React, { useState } from 'react';
import { SourcingRequest } from '../types';
import { LocalDB } from '../data/store';
import { Search, Sparkles, Clock, Check, RefreshCw, Bookmark, AlertTriangle } from 'lucide-react';

interface SourcingTrackingProps {
  requests: SourcingRequest[];
  onNewRequestClick: () => void;
}

export default function SourcingTracking({ requests: initialRequests, onNewRequestClick }: SourcingTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<SourcingRequest[]>(initialRequests);

  // Re-fetch from DB directly when searching/tracking to avoid stales
  const allRequests = LocalDB.getSourcingRequests();

  const filtered = allRequests.filter(req => 
    req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: SourcingRequest['status']) => {
    switch (status) {
      case 'En attente':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-650">
            <Clock className="h-3 w-3 animate-pulse text-zinc-400" /> En attente
          </span>
        );
      case 'En recherche':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <RefreshCw className="h-3 w-3 animate-spin text-blue-500" /> Sourcing actif
          </span>
        );
      case 'Trouvé':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Check className="h-3 w-3 text-emerald-500" /> Trouvé !
          </span>
        );
      case 'Livré':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-pnd-100 px-2.5 py-1 text-xs font-semibold text-gold-700">
            <Bookmark className="h-3 w-3 text-gold-500" /> Livré & Conclu
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl" id="sourcing-tracking-container">
      {/* Upper info card */}
      <div className="rounded-3xl bg-zinc-900 p-8 text-white shadow-xl sm:p-10 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold-500/10 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-rose-pnd-200/5 blur-2xl"></div>

        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400">
            Rares, Exclusifs & Sur-Mesure
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Suivi des Sourcing Personnalisés
          </h2>
          <p className="mt-4 text-xs font-medium text-zinc-400 leading-relaxed">
            Recherchez si votre article demandé est en cours d\'approvisionnement ou déjà disponible auprès de nos boutiques partenaires en Europe ou sur Shein. Vous pouvez également lancer votre propre recherche d\'article exclusif !
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={onNewRequestClick}
              className="rounded-full gold-gradient-bg px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:opacity-95"
            >
              Créer une demande de produit
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-rose-pnd-100 bg-white p-4 shadow-md sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher par ID (ex: SRC-101), article ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-2.5 text-xs focus:border-gold-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Sparkles className="h-4 w-4 text-gold-500 animate-pulse" />
          <span>{filtered.length} demande(s) enregistrée(s)</span>
        </div>
      </div>

      {/* Grid of tracking cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white py-12 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400" />
          <h4 className="mt-3 text-sm font-bold text-zinc-805">Aucun sourcing trouvé</h4>
          <p className="mt-1 text-xs text-zinc-400">Ressaisissez votre ID ou lancez une demande de recherche personnalisée !</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((req) => (
            <div key={req.id} className="group relative overflow-hidden rounded-2xl border border-rose-pnd-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex gap-4">
                {/* Product thumbnail */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-rose-pnd-50/50">
                  <img
                    src={req.image}
                    alt={req.productName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Text credentials */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] font-bold text-gold-600 block">
                      ID : {req.id}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(req.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <h4 className="font-serif text-sm font-bold text-zinc-900 line-clamp-1">
                    {req.productName}
                  </h4>
                  
                  <p className="text-[11px] text-zinc-500 line-clamp-2">
                    {req.description || "Aucune description additionnelle."}
                  </p>

                  <div className="pt-2 text-[11px] text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
                    {req.colorOrSize && (
                      <span className="bg-rose-pnd-50 px-2 py-0.5 rounded text-rose-pnd-500 font-medium">
                        {req.colorOrSize}
                      </span>
                    )}
                    <span>Qté: {req.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Status and customer details bar */}
              <div className="mt-4 flex items-center justify-between border-t border-rose-pnd-50/80 pt-3">
                <div className="text-[11px] text-zinc-500 font-medium">
                  Client : <span className="text-zinc-800 font-semibold">{req.customerName}</span> ({req.customerCity})
                </div>
                {getStatusBadge(req.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpful notice box */}
      <div className="mt-8 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-xs text-amber-800 flex gap-3 leading-relaxed">
        <Clock className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong className="font-bold">Comment fonctionne le Sourcing de Beauty By PND ?</strong><br />
          Lorsque vous soumettez une demande, nos experts vérifient la disponibilité de l\'article d\'exception auprès de nos réseaux de grossistes en Europe et boutiques agrégées. Dès que l\'article est localisé (généralement en 2-4 jours), son statut passe à "Sourcing actif" puis "Trouvé !". Notre équipe vous envoie un message récapitulatif pour confirmer le prix final et expédier l\'article directement chez vous au Maroc avec paiement sécurisé à la livraison.
        </div>
      </div>
    </div>
  );
}
