import React, { useState } from 'react';
import { BlogPost } from '../types';
import { Clock, User, Calendar, BookOpen, ChevronRight, MessageSquare, Heart } from 'lucide-react';

interface BlogAndTipsProps {
  blogs: BlogPost[];
}

export default function BlogAndTips({ blogs }: BlogAndTipsProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8" id="blog-view-container">
      {/* Blog header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-gold-600 block">Blog Beauté & Lifestyle</span>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Astuces, Secrets & Tendances
        </h2>
        <p className="mx-auto max-w-lg text-xs text-zinc-500 leading-relaxed">
          Découvrez les meilleurs conseils de maquillage, astuces parfumées et rituels d\'Espagne & de Corée partagés par les expertes de Beauty By PND.
        </p>
      </div>

      {selectedPost ? (
        /* Full Post Layout */
        <div className="rounded-3xl border border-rose-pnd-100 bg-white p-6 shadow-xl sm:p-10 space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 hover:underline"
          >
            ← Retour aux articles
          </button>

          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-rose-pnd-50">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(selectedPost.date).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Par {selectedPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {selectedPost.readTime} de lecture
            </span>
          </div>

          <h3 className="font-serif text-2xl font-extrabold text-zinc-900 sm:text-3xl leading-tight">
            {selectedPost.title}
          </h3>

          <div className="text-sm text-zinc-650 leading-relaxed space-y-4 whitespace-pre-line border-t border-rose-pnd-50 pt-5">
            {selectedPost.content}
          </div>

          {/* Sourcing CTA inside blog */}
          <div className="rounded-2xl bg-gold-100/30 border border-gold-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-zinc-900">Envie d\'essayer les produits du blog ?</h4>
              <p className="text-xs text-zinc-500">Certains articles ne sont pas en stock ? Demandez les via notre service sourcing.</p>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="rounded-full gold-gradient-bg px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:opacity-95"
            >
              Voir les articles
            </button>
          </div>
        </div>
      ) : (
        /* Blog grid */
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedPost(b)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-rose-pnd-100 bg-white shadow-xs transition hover:shadow-md flex flex-col justify-between"
            >
              <div className="aspect-video w-full overflow-hidden bg-rose-pnd-50 relative">
                <img
                  src={b.image}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <button
                  onClick={(e) => handleLike(b.id, e)}
                  className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-xs p-2 text-rose-500 hover:bg-white transition flex items-center gap-1 text-[10px] font-bold"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-500" />
                  {likes[b.id] || 15}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> {b.readTime}
                  </span>
                  <h3 className="font-serif text-base font-extrabold text-zinc-905 group-hover:text-gold-500 transition line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-zinc-450 line-clamp-3">
                    {b.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-rose-pnd-50/70 pt-3 text-[11px] text-zinc-400 font-medium">
                  <span>{new Date(b.date).toLocaleDateString('fr-FR')} — Par {b.author}</span>
                  <span className="text-gold-600 font-bold group-hover:underline flex items-center gap-0.5">
                    Lire l\'article <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
