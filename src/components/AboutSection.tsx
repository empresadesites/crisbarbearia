import React from 'react';
import { Award, Compass, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { BARBERSHOP_INFO } from '../utils/helpers';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase (Images / Collage) */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-[#26262D] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85"
                alt="Ambiente Cristopher BarberShop"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // If fails, replace with another verified image
                  e.currentTarget.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=85";
                }}
                className="w-full h-[420px] sm:h-[480px] object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent opacity-80" />
              
              {/* Badge overlay on image */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#121215]/90 border border-[#C5A059]/40 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
                  {BARBERSHOP_INFO.name}
                </p>
                <p className="text-sm font-semibold text-white">
                  Veneza, Ipatinga - MG • Excelência em cada detalhe
                </p>
              </div>
            </div>

            {/* Decorative subtle border frame */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-[#C5A059]/20 -z-0 pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181B] border border-[#2A2A30] text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conceito & Filosofia</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              MAIS QUE UM CORTE. <br />
              <span className="gold-gradient-text">UMA EXPERIÊNCIA.</span>
            </h2>

            <p className="text-zinc-300 text-base leading-relaxed">
              A <strong>Cristopher BarberShop</strong> foi pensada para o homem moderno que não abre mão de qualidade, pontualidade e uma atmosfera autêntica. Cada atendimento é individualizado, combinando técnicas precisas de corte, navalha afiada e produtos selecionados.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Aqui, valorizamos o seu tempo e respeitamos o seu estilo. Seja para manter o alinhamento semanal, renovar a barba com toalha quente ou transformar o visual com visagismo contemporâneo, nosso compromisso é que você saia renovado e confiante.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#131317] border border-[#202026]">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Precisão</h3>
                <p className="text-xs text-zinc-400">
                  Técnicas apuradas de acabamento e alinhamento milimétrico.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131317] border border-[#202026]">
                <HeartHandshake className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Cuidado Pessoal</h3>
                <p className="text-xs text-zinc-400">
                  Produtos de alto padrão e toalha quente para relaxamento.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131317] border border-[#202026]">
                <Compass className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Pontualidade</h3>
                <p className="text-xs text-zinc-400">
                  Respeito absoluto ao seu horário com agendamento organizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
