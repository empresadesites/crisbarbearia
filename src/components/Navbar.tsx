import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, MapPin, Phone, Scissors, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BARBERSHOP_INFO } from '../utils/helpers';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Agendamento', href: '#agendamento' },
    { label: 'Localização', href: '#localizacao' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#agendamento') {
      onOpenBooking();
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#222226] py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#0B0B0C]/90 via-[#0B0B0C]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Official Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <BrandLogo size="md" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="text-sm font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors relative py-1 focus:outline-none"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            title="Acesso Administrativo"
            aria-label="Painel Administrativo"
            className="p-2.5 rounded-lg text-zinc-400 hover:text-[#D4AF37] hover:bg-[#18181B] border border-transparent hover:border-[#2A2A30] transition-all"
          >
            <Shield className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBooking}
            className="gold-button px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0C]" />
            <span>AGENDAR AGORA</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="gold-button px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#C5A059]/20"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0B0B0C]" />
            <span>AGENDAR</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-[#18181B] border border-[#2A2A30] text-zinc-200 hover:text-[#D4AF37] focus:outline-none"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F12] border-b border-[#222226] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-[#222226]">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-200 hover:text-[#D4AF37] hover:bg-[#18181B] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full gold-button py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>AGENDAR HORÁRIO AGORA</span>
            </button>

            <div className="flex items-center justify-between pt-3 text-xs text-zinc-400 px-1">
              <a
                href={BARBERSHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Veneza, Ipatinga - MG</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-1 hover:text-[#D4AF37]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
