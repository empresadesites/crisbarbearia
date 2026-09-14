import React from 'react';
import { Scissors, MapPin, Phone, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BARBERSHOP_INFO, createWhatsAppGeneralLink } from '../utils/helpers';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070708] border-t border-[#1C1C20] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1A1A1E]">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Barbearia masculina premium em Ipatinga - MG. Cortes modernos, barba com toalha quente e acabamento impecável.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleScrollTo('#inicio')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#servicos')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-[#D4AF37] transition-colors font-semibold text-white"
                >
                  Agendamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#sobre')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#galeria')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Galeria
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#localizacao')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Localização
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Contato & Local
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="leading-snug">{BARBERSHOP_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="text-white font-semibold">{BARBERSHOP_INFO.phoneDisplay}</span>
              </li>
              <li>
                <a
                  href={createWhatsAppGeneralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-medium inline-block mt-1"
                >
                  WhatsApp: (33) 99816-8468
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hours summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Horário de Atendimento
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="text-zinc-300">
                <span className="text-zinc-500">Seg a Sex:</span> 09:00 - 19:30
              </p>
              <p className="text-zinc-300">
                <span className="text-zinc-500">Sábado:</span> 08:30 - 18:00
              </p>
              <p className="text-zinc-500">
                <span>Domingo:</span> Fechado
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onOpenBooking}
                className="gold-button w-full py-2.5 rounded-lg text-xs font-bold uppercase"
              >
                Agendar Horário
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Admin Portal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Cristopher BarberShop. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <a
              href={createWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300"
            >
              WhatsApp
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-zinc-600 hover:text-[#C5A059] transition-colors"
              title="Painel de Controle Administrativo"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
