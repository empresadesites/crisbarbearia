import React from 'react';
import { MapPin, Navigation, Phone, MessageSquare, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { BARBERSHOP_INFO, createWhatsAppGeneralLink } from '../utils/helpers';

export const LocationSection: React.FC = () => {
  return (
    <section id="localizacao" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181B] border border-[#2A2A30] text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Fácil Acesso no Veneza</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            ONDE ESTAMOS
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base">
            Localização privilegiada em Ipatinga - MG, com ambiente moderno e estacionamento fácil nas imediações.
          </p>
        </div>

        {/* Storefront Real Photo Banner */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-[#2A2A32] bg-[#121215] shadow-2xl relative group">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full max-h-[380px] overflow-hidden bg-black">
            <img
              src="/fachada.jpg"
              alt="Fachada Cristopher BarberShop - Av. Londrina, 215 - Lj 4 - Veneza, Ipatinga"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/30" />

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C5A059]/50 text-[#D4AF37] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Fachada da Barbearia
                </span>
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-white leading-tight">
                  Cristopher BarberShop • Av. Londrina, 215 - Lj 4
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                  Bairro Veneza, Ipatinga - MG • Fácil identificação no local
                </p>
              </div>

              <a
                href={BARBERSHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 self-start sm:self-auto"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Ver Rota no Mapa</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Information & Action Card */}
          <div className="lg:col-span-5 bg-[#121215] border border-[#222226] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Address item */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1A1A20] border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Endereço Completo
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-white leading-snug">
                    {BARBERSHOP_INFO.address}
                  </p>
                  <p className="text-xs text-[#C5A059] mt-1 font-semibold">
                    Código Plus: {BARBERSHOP_INFO.plusCode}
                  </p>
                </div>
              </div>

              {/* Phone item */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1A1A20] border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Telefone / WhatsApp
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-white leading-snug">
                    {BARBERSHOP_INFO.phoneDisplay}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Atendimento ágil para dúvidas e agendamentos
                  </p>
                </div>
              </div>

              {/* Hours summary item */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1A1A20] border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Funcionamento
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200">
                    <strong className="text-white">Segunda a Sexta:</strong> 09:00 às 19:30
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-200">
                    <strong className="text-white">Sábado:</strong> 08:30 às 18:00
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Domingo: Fechado</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-8 border-t border-[#1E1E24] mt-6">
              <a
                href={BARBERSHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full gold-button py-3.5 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#C5A059]/20"
              >
                <Navigation className="w-4 h-4 text-[#0B0B0C]" />
                <span>COMO CHEGAR</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0B0B0C] opacity-75" />
              </a>

              <a
                href={createWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl text-sm font-bold bg-[#18181D] hover:bg-[#202026] text-white border border-[#2B2B33] hover:border-[#C5A059]/50 flex items-center justify-center gap-2.5 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>CHAMAR NO WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Box */}
          <div className="lg:col-span-7 bg-[#121215] border border-[#222226] rounded-2xl overflow-hidden shadow-2xl relative min-h-[360px] flex flex-col">
            <iframe
              title="Localização Cristopher BarberShop no Google Maps"
              src={BARBERSHOP_INFO.googleMapsEmbed}
              className="w-full flex-1 border-0 filter contrast-105"
              loading="lazy"
              allowFullScreen
            />
            <div className="bg-[#141418] border-t border-[#222226] px-5 py-3 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">Av. Londrina, 215 - Lj 4 - Veneza, Ipatinga - MG</span>
              </span>
              <a
                href={BARBERSHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline shrink-0 font-semibold"
              >
                Abrir Mapa Completo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
