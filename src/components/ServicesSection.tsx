import React from 'react';
import { Clock, Calendar, Scissors, Sparkles, Check, ChevronRight } from 'lucide-react';
import { BarberService } from '../types';

interface ServicesSectionProps {
  services: BarberService[];
  onSelectServiceToBook: (service: BarberService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook,
}) => {
  const activeServices = services.filter((s) => s.status === 'ativo');

  const getServiceBadgeIcon = (category?: string) => {
    switch (category) {
      case 'barba':
        return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
      case 'combo':
        return <Check className="w-4 h-4 text-[#D4AF37]" />;
      default:
        return <Scissors className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] relative">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181B] border border-[#2A2A30] text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
            <Scissors className="w-3.5 h-3.5" />
            <span>Excelência & Tradição</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            NOSSOS SERVIÇOS
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Procedimentos realizados com foco na sua identidade e precisão no acabamento.
            Escolha o serviço desejado e garanta seu horário.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="group bg-[#121214] hover:bg-[#161619] border border-[#222226] hover:border-[#C5A059]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/60 relative overflow-hidden"
            >
              {/* Subtle gold accent top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-[#C5A059] group-hover:to-transparent transition-all duration-300" />

              <div>
                {/* Header of card: Name & Category Icon */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {service.nome}
                  </h3>
                  <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#2A2A30] flex items-center justify-center shrink-0">
                    {getServiceBadgeIcon(service.categoria)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {service.descricao}
                </p>
              </div>

              {/* Footer of Card: Duration, Price, and Booking Button */}
              <div className="pt-5 border-t border-[#1F1F24] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Aprox. {service.duracaoMinutos} min</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-medium">Valor</span>
                    <span className="text-sm font-bold text-[#E5C07B] tracking-wide">
                      {service.preco === 'Consultar' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-zinc-300 border border-[#2E2E36] text-xs font-semibold">
                          Consultar
                        </span>
                      ) : (
                        service.preco
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectServiceToBook(service)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#18181B] group-hover:bg-[#C5A059] text-zinc-200 group-hover:text-[#0B0B0C] border border-[#2A2A30] group-hover:border-[#C5A059] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar este serviço</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
