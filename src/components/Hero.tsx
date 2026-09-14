import React from 'react';
import { Calendar, ChevronDown, MapPin, Scissors, Clock, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BARBERSHOP_INFO } from '../utils/helpers';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onScrollToServices }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Image with Dark Vignette and Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=85"
          alt="Cristopher BarberShop Interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/75 to-[#0B0B0C]/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0C]/40 to-[#0B0B0C]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Official Brand Logo Presentation */}
        <div className="mb-4">
          <BrandLogo size="xl" showSubtext={true} />
        </div>

        {/* Hero Top Location Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181B]/90 border border-[#C5A059]/40 text-[#D4AF37] text-xs sm:text-sm font-semibold tracking-wide shadow-lg backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Cristopher BarberShop • Veneza, Ipatinga - MG</span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          SEU ESTILO <br className="hidden sm:inline" />
          <span className="gold-gradient-text">COMEÇA AQUI.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed mb-10 text-balance">
          Cortes, barba e aquele acabamento impecável para você sair da cadeira renovado.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto gold-button px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-[#C5A059]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calendar className="w-5 h-5 text-[#0B0B0C]" />
            <span>AGENDAR HORÁRIO</span>
          </button>

          <button
            onClick={onScrollToServices}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-zinc-200 bg-[#18181B]/80 hover:bg-[#222226] border border-[#2E2E36] hover:border-[#C5A059]/50 transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
          >
            <Scissors className="w-4 h-4 text-[#D4AF37]" />
            <span>CONHECER SERVIÇOS</span>
          </button>
        </div>

        {/* Fast Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl pt-8 border-t border-[#222226]/80 text-left">
          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#121214]/60 border border-[#1E1E22]">
            <div className="w-9 h-9 rounded-md bg-[#1E1E22] border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Pontualidade</p>
              <p className="text-xs text-zinc-400">Atendimento com hora marcada</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#121214]/60 border border-[#1E1E22]">
            <div className="w-9 h-9 rounded-md bg-[#1E1E22] border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Acabamento Fino</p>
              <p className="text-xs text-zinc-400">Alinhamento preciso na navalha</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#121214]/60 border border-[#1E1E22]">
            <div className="w-9 h-9 rounded-md bg-[#1E1E22] border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Cuidado Pessoal</p>
              <p className="text-xs text-zinc-400">Produtos de padrão premium</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={onScrollToServices}
          aria-label="Rolar para serviços"
          className="mt-12 text-zinc-500 hover:text-[#D4AF37] transition-colors animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
