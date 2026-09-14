import React, { useState } from 'react';
import { Camera, X, ZoomIn, Scissors } from 'lucide-react';
import { GalleryPhoto } from '../types';

interface GallerySectionProps {
  gallery: GalleryPhoto[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [brokenPhotoIds, setBrokenPhotoIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'cortes', label: 'Cortes' },
    { id: 'barba', label: 'Barbas' },
    { id: 'detalhes', label: 'Detalhes' },
    { id: 'ambiente', label: 'Ambiente' },
  ];

  const handleImageError = (id: string) => {
    setBrokenPhotoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const validPhotos = gallery.filter((p) => !brokenPhotoIds.has(p.id));

  const filteredPhotos =
    selectedCategory === 'todos'
      ? validPhotos
      : validPhotos.filter((p) => p.categoria === selectedCategory);

  return (
    <section id="galeria" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0E0E12] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181B] border border-[#2A2A30] text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Portfólio Visual</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            NOSSO TRABALHO
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Confira alguns dos nossos cortes, barboterapias e a atmosfera da Cristopher BarberShop.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20'
                    : 'bg-[#151519] text-zinc-400 border border-[#222226] hover:text-white hover:border-zinc-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative h-80 rounded-2xl overflow-hidden border border-[#222226] bg-[#141418] cursor-pointer shadow-lg transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-2xl"
            >
              <img
                src={photo.url}
                alt={photo.titulo}
                referrerPolicy="no-referrer"
                onError={() => handleImageError(photo.id)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Title and Category on bottom */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                  {photo.categoria}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {photo.titulo}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#121215] border border-[#33333C] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:text-[#D4AF37] transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.url}
              alt={activePhoto.titulo}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-4 sm:p-5 bg-[#141418] border-t border-[#24242B] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">
                  {activePhoto.categoria}
                </span>
                <p className="text-base font-bold text-white">{activePhoto.titulo}</p>
              </div>
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Cristopher BarberShop</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
