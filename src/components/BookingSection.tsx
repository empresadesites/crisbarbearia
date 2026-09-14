import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scissors,
  Send,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Appointment, Barber, BarberService } from '../types';
import { StorageService } from '../services/storage';
import {
  BARBERSHOP_INFO,
  createWhatsAppConfirmationLink,
  formatDateBR,
  formatPhoneNumber,
  getDayNameBR,
} from '../utils/helpers';

interface BookingSectionProps {
  services: BarberService[];
  barbers: Barber[];
  preSelectedService?: BarberService | null;
  onAppointmentCreated?: (appointment: Appointment) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  barbers,
  preSelectedService,
  onAppointmentCreated,
}) => {
  // Step navigation: 1 = Service, 2 = Barber, 3 = Date & Time, 4 = Client info, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<BarberService | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Result state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Schedule Config from storage
  const scheduleConfig = useMemo(() => StorageService.getScheduleConfig(), []);

  // Update selection if preSelectedService changes
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService);
      // If only 1 barber, select him automatically
      if (barbers.length === 1 && barbers[0]) {
        setSelectedBarber(barbers[0]);
        setCurrentStep(3); // jump to date & time
      } else {
        setCurrentStep(2); // proceed to barber selection
      }
    }
  }, [preSelectedService, barbers]);

  // Default barber auto-selection if only 1 barber exists
  useEffect(() => {
    if (barbers.length === 1 && !selectedBarber && barbers[0]) {
      setSelectedBarber(barbers[0]);
    }
  }, [barbers, selectedBarber]);

  // Generate valid next 14 days for selection
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; dayName: string; formatted: string; isClosed: boolean }[] = [];
    const baseDate = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayOfWeek = d.getDay();
      const dayConfig = scheduleConfig.diasFuncionamento[dayOfWeek];
      const isClosed = !dayConfig || !dayConfig.aberto;

      dates.push({
        dateStr,
        dayName: getDayNameBR(dayOfWeek),
        formatted: `${day}/${month}`,
        isClosed,
      });
    }

    return dates;
  }, [scheduleConfig]);

  // Set initial selected date to first open day if none selected
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      const firstOpen = availableDates.find((d) => !d.isClosed);
      if (firstOpen) {
        setSelectedDate(firstOpen.dateStr);
      }
    }
  }, [availableDates, selectedDate]);

  // Calculate available timeslots for current date & barber
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return StorageService.getAvailableSlots(selectedDate, selectedBarber?.id);
  }, [selectedDate, selectedBarber]);

  // When date changes, reset time if not available
  useEffect(() => {
    if (selectedTime) {
      const match = timeSlots.find((s) => s.time === selectedTime && s.available);
      if (!match) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, timeSlots, selectedTime]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setClientPhone(formatted);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedService) {
      setErrorMessage('Por favor, selecione um serviço.');
      setCurrentStep(1);
      return;
    }

    const barber = selectedBarber || barbers[0];
    if (!barber) {
      setErrorMessage('Nenhum barbeiro disponível.');
      return;
    }

    if (!selectedDate) {
      setErrorMessage('Selecione uma data para o agendamento.');
      setCurrentStep(3);
      return;
    }

    if (!selectedTime) {
      setErrorMessage('Selecione um horário disponível.');
      setCurrentStep(3);
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!clientName.trim() || clientName.trim().length < 2) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }

    // Double check availability to prevent concurrency / double-booking
    const currentSlots = StorageService.getAvailableSlots(selectedDate, barber.id);
    const chosenSlot = currentSlots.find((s) => s.time === selectedTime);
    if (!chosenSlot || !chosenSlot.available) {
      setErrorMessage('Desculpe, esse horário acabou de ser ocupado. Por favor, escolha outro horário.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const newApt = StorageService.createAppointment({
        clienteNome: clientName.trim(),
        clienteTelefone: clientPhone.trim(),
        servicoId: selectedService.id,
        servicoNome: selectedService.nome,
        servicoPreco: selectedService.preco,
        barbeiroId: barber.id,
        barbeiroNome: barber.nome,
        data: selectedDate,
        horario: selectedTime,
        status: 'confirmado',
        observacoes: notes.trim() || undefined,
      });

      setConfirmedAppointment(newApt);
      setCurrentStep(5);
      if (onAppointmentCreated) {
        onAppointmentCreated(newApt);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocorreu um erro ao salvar seu agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFlow = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setNotes('');
    setConfirmedAppointment(null);
    setErrorMessage('');
  };

  return (
    <section id="agendamento" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0E0E11] border-y border-[#1C1C20] relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181B] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Reserva Rápida & Sem Complicações</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            AGENDAR HORÁRIO
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Escolha o serviço, data e horário ideal. Confirmação instantânea pelo WhatsApp.
          </p>
        </div>

        {/* Step Progress Tracker (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between max-w-md mx-auto mb-10 px-2">
            {[
              { num: 1, label: 'Serviço' },
              { num: 2, label: 'Barbeiro' },
              { num: 3, label: 'Data & Hora' },
              { num: 4, label: 'Seus Dados' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    disabled={step.num > currentStep}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step.num
                        ? 'bg-[#C5A059] text-black font-extrabold ring-4 ring-[#C5A059]/20 scale-105'
                        : currentStep > step.num
                        ? 'bg-[#1E1E24] text-[#D4AF37] border border-[#C5A059]/40'
                        : 'bg-[#18181B] text-zinc-500 border border-[#222226]'
                    }`}
                  >
                    {step.num}
                  </button>
                  <span
                    className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                      currentStep === step.num
                        ? 'text-white font-bold'
                        : currentStep > step.num
                        ? 'text-zinc-300'
                        : 'text-zinc-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      currentStep > idx + 1 ? 'bg-[#C5A059]/60' : 'bg-[#222226]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE SERVICE */}
        {currentStep === 1 && (
          <div className="bg-[#121215] border border-[#222226] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                  <span>Selecione o Serviço</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Clique no procedimento que deseja realizar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {services
                .filter((s) => s.status === 'ativo')
                .map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1B1B20] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                          : 'bg-[#151518] border-[#222226] hover:border-zinc-700 hover:bg-[#18181C]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`font-semibold text-sm sm:text-base ${
                            isSelected ? 'text-[#D4AF37]' : 'text-white'
                          }`}
                        >
                          {service.nome}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1F1F24] text-zinc-300 shrink-0">
                          {service.preco === 'Consultar' ? 'Consultar' : service.preco}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                        {service.descricao}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-[#222226]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          {service.duracaoMinutos} min
                        </span>
                        {isSelected && (
                          <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => {
                  // If only 1 barber, can proceed straight to date & time
                  if (barbers.length <= 1) {
                    setSelectedBarber(barbers[0] || null);
                    setCurrentStep(3);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                className={`px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  selectedService
                    ? 'gold-button shadow-lg shadow-[#C5A059]/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE BARBER (if multiple or to review) */}
        {currentStep === 2 && (
          <div className="bg-[#121215] border border-[#222226] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D4AF37]" />
                  <span>Escolha o Profissional</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Selecione com quem deseja cortar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {barbers
                .filter((b) => b.status === 'ativo')
                .map((barber) => {
                  const isSelected = selectedBarber?.id === barber.id;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'bg-[#1B1B20] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                          : 'bg-[#151518] border-[#222226] hover:border-zinc-700 hover:bg-[#18181C]'
                      }`}
                    >
                      <img
                        src={barber.fotoUrl}
                        alt={barber.nome}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="w-14 h-14 rounded-full object-cover border border-[#C5A059]/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm sm:text-base font-bold text-white truncate">
                            {barber.nome}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[#C5A059] font-medium">Barbeiro Especialista</p>
                        <p className="text-[11px] text-zinc-400 truncate mt-1">
                          {barber.especialidades.join(' • ')}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1F1F24]">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                disabled={!selectedBarber}
                onClick={() => setCurrentStep(3)}
                className={`px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  selectedBarber
                    ? 'gold-button shadow-lg'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE DATE & AVAILABLE TIME */}
        {currentStep === 3 && (
          <div className="bg-[#121215] border border-[#222226] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Data e Horário</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Serviço selecionado: <span className="text-[#D4AF37] font-semibold">{selectedService?.nome}</span> •
                Barbeiro: <span className="text-white font-semibold">{selectedBarber?.nome}</span>
              </p>
            </div>

            {/* Date Selector (Horizontal Scroll on Mobile) */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                1. Selecione o Dia
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      disabled={item.isClosed}
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`shrink-0 flex flex-col items-center justify-center w-20 py-3 rounded-xl border transition-all ${
                        item.isClosed
                          ? 'bg-[#151518]/50 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-[#1E1E24] border-[#C5A059] ring-2 ring-[#C5A059]/30 text-white font-bold'
                          : 'bg-[#151518] border-[#222226] text-zinc-300 hover:border-zinc-600 hover:bg-[#18181C]'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {item.dayName.slice(0, 3)}
                      </span>
                      <span
                        className={`text-base font-extrabold my-0.5 ${
                          isSelected ? 'text-[#D4AF37]' : 'text-white'
                        }`}
                      >
                        {item.formatted}
                      </span>
                      <span className="text-[9px] text-zinc-400">
                        {item.isClosed ? 'Fechado' : 'Aberto'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeslot Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  2. Horários Disponíveis para {formatDateBR(selectedDate)}
                </label>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" /> Livre
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-700" /> Ocupado
                  </span>
                </div>
              </div>

              {timeSlots.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#151518] border border-[#222226] text-zinc-400 text-sm">
                  Não há horários de atendimento nesta data (dia de folga ou barbearia fechada).
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    if (!slot.available) {
                      return (
                        <div
                          key={slot.time}
                          className="py-2.5 px-2 rounded-lg bg-[#141416] border border-[#1E1E22] text-zinc-600 text-xs font-medium text-center cursor-not-allowed flex flex-col items-center justify-center opacity-60"
                          title="Horário indisponível"
                        >
                          <span className="line-through">{slot.time}</span>
                          <span className="text-[9px] text-zinc-500 font-normal">
                            {slot.reason === 'bloqueado' ? 'Bloqueado' : 'Ocupado'}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#C5A059] text-black ring-2 ring-[#C5A059]/50 shadow-md font-extrabold'
                            : 'bg-[#18181C] hover:bg-[#202026] text-zinc-200 border border-[#26262C] hover:border-[#C5A059]/40'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-black/80 font-bold' : 'text-[#C5A059]'}`}>
                          Disponível
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1F1F24]">
              <button
                onClick={() => {
                  if (barbers.length <= 1) {
                    setCurrentStep(1);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setCurrentStep(4)}
                className={`px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  selectedDate && selectedTime
                    ? 'gold-button shadow-lg'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>Avançar para Seus Dados</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLIENT DATA & FINAL REVIEW */}
        {currentStep === 4 && (
          <form
            onSubmit={handleConfirmBooking}
            className="bg-[#121215] border border-[#222226] rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <span>Informações para Contato</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Preencha para identificarmos seu horário e facilitar o atendimento
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="p-4 rounded-xl bg-[#18181D] border border-[#282830] mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Serviço</span>
                <span className="font-bold text-white truncate block">{selectedService?.nome}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Barbeiro</span>
                <span className="font-bold text-[#D4AF37] truncate block">{selectedBarber?.nome}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Data</span>
                <span className="font-bold text-white block">{formatDateBR(selectedDate)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Horário</span>
                <span className="font-bold text-[#D4AF37] block">{selectedTime}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#18181C] border border-[#2A2A30] text-white text-sm focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={handlePhoneChange}
                    placeholder="(33) 99816-8468"
                    maxLength={15}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#18181C] border border-[#2A2A30] text-white text-sm focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Usado para confirmação e lembrete do horário.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Observações (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma preferência especial ou detalhe que queira avisar..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-[#18181C] border border-[#2A2A30] text-white text-sm focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1F1F24]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="gold-button px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
              >
                {isSubmitting ? (
                  <span>Salvando agendamento...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRMAR AGENDAMENTO</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: SUCCESS CONFIRMATION SCREEN & WHATSAPP BUTTON */}
        {currentStep === 5 && confirmedAppointment && (
          <div className="bg-[#121215] border border-[#C5A059]/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-300">
            {/* Top gold glow effect */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C5A059]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-[#18181E] border-2 border-[#C5A059] flex items-center justify-center mx-auto mb-5 text-[#D4AF37] shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Agendamento realizado com sucesso!
            </h3>
            <p className="text-zinc-300 text-sm max-w-md mx-auto mb-8">
              Seu horário foi reservado no sistema da Cristopher BarberShop.
              Clique no botão abaixo para confirmar diretamente pelo WhatsApp!
            </p>

            {/* Receipt Card */}
            <div className="max-w-md mx-auto bg-[#17171C] border border-[#2B2B33] rounded-2xl p-6 mb-8 text-left space-y-3.5">
              <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
                <span className="text-xs text-zinc-400">Serviço:</span>
                <span className="text-sm font-bold text-white">{confirmedAppointment.servicoNome}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
                <span className="text-xs text-zinc-400">Barbeiro:</span>
                <span className="text-sm font-bold text-[#D4AF37]">{confirmedAppointment.barbeiroNome}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
                <span className="text-xs text-zinc-400">Data:</span>
                <span className="text-sm font-bold text-white">{formatDateBR(confirmedAppointment.data)}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
                <span className="text-xs text-zinc-400">Horário:</span>
                <span className="text-sm font-bold text-[#D4AF37] text-base">{confirmedAppointment.horario}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
                <span className="text-xs text-zinc-400">Cliente:</span>
                <span className="text-sm font-semibold text-white">{confirmedAppointment.clienteNome}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Telefone:</span>
                <span className="text-sm font-semibold text-zinc-300">{confirmedAppointment.clienteTelefone}</span>
              </div>
            </div>

            {/* The Crucial WhatsApp Button */}
            <div className="max-w-md mx-auto space-y-3">
              <a
                href={createWhatsAppConfirmationLink(confirmedAppointment)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl text-base font-bold bg-[#25D366] hover:bg-[#20bd5a] text-black flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/20 transition-transform active:scale-95"
              >
                <Send className="w-5 h-5 fill-current" />
                <span>CONFIRMAR PELO WHATSAPP</span>
              </a>

              <p className="text-[11px] text-zinc-400">
                Uma mensagem com todos os detalhes será enviada para o WhatsApp da barbearia ({BARBERSHOP_INFO.phoneDisplay}).
              </p>

              <div className="pt-6">
                <button
                  onClick={handleResetFlow}
                  className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto py-2 px-4 rounded-lg hover:bg-[#1C1C22] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fazer outro agendamento</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
