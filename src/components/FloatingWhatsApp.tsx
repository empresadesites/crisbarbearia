import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppGeneralLink } from '../utils/helpers';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on Desktop hover */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-xl bg-[#18181C] text-xs font-semibold text-zinc-200 border border-[#2E2E36] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Agende ou tire dúvidas pelo WhatsApp
      </span>

      {/* Floating Button */}
      <a
        href={createWhatsAppGeneralLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp da Cristopher BarberShop"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black flex items-center justify-center shadow-2xl shadow-[#25D366]/30 transition-transform duration-200 hover:scale-110 active:scale-95 relative focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Animated pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75" />
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
      </a>
    </div>
  );
};
