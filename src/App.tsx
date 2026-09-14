import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanel } from './components/AdminPanel';
import { StorageService } from './services/storage';
import { Barber, BarberService, GalleryPhoto } from './types';

export default function App() {
  const [services, setServices] = useState<BarberService[]>(() => StorageService.getServices());
  const [barbers, setBarbers] = useState<Barber[]>(() => StorageService.getBarbers());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => StorageService.getGallery());

  const [preSelectedService, setPreSelectedService] = useState<BarberService | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin'
    );
  });

  // Listen to hash changes for #admin navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleDataChanged = () => {
    setServices(StorageService.getServices());
    setBarbers(StorageService.getBarbers());
    setGallery(StorageService.getGallery());
  };

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('servicos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service: BarberService) => {
    setPreSelectedService(service);
    scrollToBooking();
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.location.hash = 'admin';
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F4F5] selection:bg-[#C5A059] selection:text-black font-sans relative">
      {/* Fixed Navigation Header */}
      <Navbar
        onOpenBooking={scrollToBooking}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Hero Section */}
      <Hero
        onOpenBooking={scrollToBooking}
        onScrollToServices={scrollToServices}
      />

      {/* Services Section */}
      <ServicesSection
        services={services}
        onSelectServiceToBook={handleSelectService}
      />

      {/* Booking Wizard Section */}
      <BookingSection
        services={services}
        barbers={barbers}
        preSelectedService={preSelectedService}
        onAppointmentCreated={handleDataChanged}
      />

      {/* About Section */}
      <AboutSection />

      {/* Gallery Section */}
      <GallerySection gallery={gallery} />

      {/* Location Section */}
      <LocationSection />

      {/* Footer */}
      <Footer
        onOpenBooking={scrollToBooking}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Protected Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={handleCloseAdmin}
          onDataChanged={handleDataChanged}
        />
      )}
    </div>
  );
}
